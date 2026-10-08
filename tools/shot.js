// Screenshot script for the chat page. Run from the sanctuary-pov folder (it has Electron):
//   SFC_DEV_URL=http://127.0.0.1:3000 SFC_SHOW=1 SFC_SHOT_DIR=<dir> SFC_TEST_SCRIPT=<this file> npx electron .
(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  const type = async (text) => {
    const input = document.getElementById('q')
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
    setter.call(input, text)
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await sleep(100)
    document.querySelector('button.btn.primary').click()
    await sleep(900)
  }
  await sleep(1500)
  await sfc.capture('c1-hero')
  await type('battery reads 0 volts')
  await sfc.capture('c2-answer')
  await type('A2_11, A1_3 and Z9_99')
  await sfc.capture('c3-codes')
  await type('what is the capital of france')
  await sfc.capture('c4-none')
  const chip = document.querySelector('.also .chip')
  return { hasAlso: !!chip, messages: document.querySelectorAll('.log > *').length }
})()
