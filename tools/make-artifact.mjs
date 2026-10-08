// Turns the single-file build (dist-static/index.html) into the page body the Artifact tool publishes: a <title>, the inlined
// <style> and <script>, and the root element. The Artifact tool adds the doctype, head and body itself.
//   npm run build:static
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const html = await readFile(new URL('../dist-static/index.html', import.meta.url), 'utf8')

const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1])
const scripts = [...html.matchAll(/<script type="module"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1])
if (!styles.length || scripts.length !== 1) throw new Error(`Expected styles and exactly one module script, found ${styles.length} style and ${scripts.length} script.`)
if (scripts[0].includes('</script')) throw new Error('The script contains a closing script tag and cannot be inlined as it is.')

const page = `<title>Lion ESS Chat</title>
<style>
${styles.join('\n')}
</style>
<div id="root"></div>
<script type="module">
${scripts[0]}
</script>
`
await mkdir(new URL('../artifact/', import.meta.url), { recursive: true })
await writeFile(new URL('../artifact/index.html', import.meta.url), page)
console.log(`artifact/index.html: ${(page.length / 1024).toFixed(0)} KB`)
