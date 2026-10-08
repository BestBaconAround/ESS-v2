// Builds shared/tsm/sections.json from the Technical Service Manual PDF (needs `pdftotext` on PATH).
//   node tools/build-tsm.mjs "<path to Lion- Sanctuary Technical Service Manual.pdf>"
// One entry per section of the manual's table of contents, with the manual's own text and page numbers.
// Figures, photos and diagrams are not text and are not included. The PDF page number equals the printed page number.
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const pdf = process.argv[2]
if (!pdf) throw new Error('Pass the path to the Technical Service Manual PDF.')

/** The table of contents, as printed. `subs` are the sub-headings listed under a section. */
const TOC = [
  { title: 'Safety', from: 6, subs: ['Symbols Used', 'Follow these directives for safe use', 'General Safety Guidelines'] },
  { title: 'Introduction', from: 8 },
  { title: 'Installation', from: 8, subs: ['Parallel or Single Inverter', 'Parallel Batteries', 'Current Transformers (CT)', 'Powering on the Sanctuary', 'Completely Shutting Down the System'] },
  { title: 'Commissioning (First-Time Setup)', from: 11, subs: ['What Commissioning Does', 'Commissioning Parallel Sanctuary 3 Inverters With an Inoperable EMS-C Battery', 'Post-Commissioning Checklist'] },
  { title: 'Sanctuary Version Identification', from: 14 },
  { title: 'Version Compatibility', from: 16 },
  { title: 'Sanctuary Architecture', from: 17 },
  { title: 'Tools for Troubleshooting', from: 18, subs: ['Installation may require additional tools and supplies'] },
  { title: 'General Troubleshooting', from: 19 },
  { title: 'Battery', from: 20, subs: ['Cells', 'Circuit Breaker', 'Sanctuary 2 vs Sanctuary 3 Batteries', 'BMS', 'BMS Communication Failure', 'BMS communication failure – Sanctuary 2', 'Sanctuary 2: One Battery is Low and its Breaker is Off', "Sanctuary 2 Battery Won't Connect (Charging or Discharging is Disabled)", 'Testing the BMS MOSFETs'] },
  { title: 'Sanctuary 3 Battery Communication', from: 27, subs: ['Battery Power Switch'] },
  { title: 'Load Power is Off', from: 32, subs: ['Transfer (Bypass) Switch', 'Off-grid and Low Battery', 'Remote Shutdown Switch', 'Off-grid and BMS communication Failure'] },
  { title: 'Connecting to the Grid', from: 33, subs: ['Possible Problems', 'Check Alerts', 'Solutions'] },
  { title: 'Power Button Testing', from: 34, subs: ['RSD / EMS-C 12V Power', 'Complete System Shut Down', 'Control Board Switch', 'Battery Power Switch', 'Wire Labels (Sanctuary 2, rev 4)', 'Wire Labels, Sanctuary 3'] },
  { title: 'Sanctuary 2 Inverter Relay Check', from: 45, subs: ['Load Relay Check', 'Grid Relay Check', 'EPS Relay Check', 'Generator Relay Check'] },
  { title: 'Sanctuary 3 Relay Tests', from: 48, subs: ['Grid Relay Check', 'While the inverter is on', 'While the inverter is off', 'EPS Relay Check', 'Generator Relay Check'] },
  { title: 'IGBT Testing (Sanctuary 2)', from: 51, subs: ['Test points', 'Battery IGBT', 'MPPT IGBT', 'MPPT Diode Check', 'Inverter IGBT'] },
  { title: 'How to Recover From a Failed Firmware Update', from: 55, subs: ['Signs of a failed firmware update', 'Troubleshooting Steps'] },
  { title: 'Communicator', from: 57, subs: ['WCM', 'WCM pins', 'EMS-C', 'Communicator Wiring for Sanctuary 2 revs 1-2', 'Communicator Wiring for Sanctuary 2 rev 3', 'Communicator Wiring for Sanctuary 2 Rev4', 'Communicator Wiring for Sanctuary 3', 'Offline (no data showing on smart.lionenergy.com)', 'Changing the WiFi SSID and password', 'Hard-wired Ethernet'] },
  { title: 'Solar', from: 61, subs: ['Voltage', 'Solar String Peak Open-Circuit Voltage Calculation', 'Example Calculation', 'Polarity', 'Ground Leakage', 'Ground Current Measurements', 'Rapid Shutdown MLPE', 'Grid Voltage and Frequency affecting Solar Production', 'AC Solar'] },
  { title: 'Generator', from: 66, subs: ['Generator Auto-Start', 'Generator Manual Start', 'Generator as Grid'] },
  { title: 'Alarm / Fault / Status Codes', from: 67, faults: true },
  { title: 'Commonly Used Terms in Solar', from: 97 },
  { title: 'Reference Materials', from: 99, subs: ['Troubleshooting Assistance'] },
]

const norm = (s) => s.replace(/[–—�]/g, '-').replace(/\s+/g, ' ').trim().toLowerCase()
const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const raw = execFileSync('pdftotext', [pdf, '-'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
const pages = raw.split('\f')

// One flat list of lines, each tagged with its page. Running headers and the page number are dropped.
const lines = []
pages.forEach((text, i) => {
  const page = i + 1
  for (const l of text.split('\n')) {
    const t = l.trim()
    if (!t || t === 'Sanctuary User Manual' || t === String(page)) continue
    lines.push({ page, text: t })
  }
})

// Where each section starts: its heading line, on or after its first page.
const starts = TOC.map((sec) => {
  const at = lines.findIndex((l) => l.page >= sec.from && norm(l.text) === norm(sec.title))
  if (at < 0) throw new Error(`Heading not found: ${sec.title} (p.${sec.from})`)
  return at
})
for (let i = 1; i < starts.length; i++) if (starts[i] <= starts[i - 1]) throw new Error(`Sections out of order at: ${TOC[i].title}`)

const sections = TOC.map((sec, i) => {
  const end = i + 1 < TOC.length ? starts[i + 1] : lines.length
  let body = lines.slice(starts[i] + 1, end)
  if (sec.faults) body = body.slice(0, Math.max(0, body.findIndex((l) => l.text.startsWith('Code Name')))) // only the intro; the code tables are served from the fault entries
  const subs = new Set((sec.subs ?? []).map(norm))
  const blocks = body.map((l) => (subs.has(norm(l.text)) ? { h: l.text, page: l.page } : { p: l.text, page: l.page }))
  const last = body.length ? body[body.length - 1].page : sec.from
  return { id: slug(sec.title), title: sec.title, from: sec.from, to: Math.max(last, sec.from), ...(sec.faults ? { faults: true } : {}), blocks }
})

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'shared', 'tsm')
mkdirSync(out, { recursive: true })
writeFileSync(join(out, 'sections.json'), JSON.stringify({ source: 'Lion Sanctuary Technical Service Manual, updated 9/30/2026', sections }, null, 1) + '\n')
for (const s of sections) console.log(s.id.padEnd(48), `p.${s.from}-${s.to}`, `${s.blocks.length} blocks`, `${s.blocks.filter((b) => b.h).length} headings`)
