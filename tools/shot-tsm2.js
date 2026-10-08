(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  await sleep(1500)
  const open = async (needle) => {
    document.querySelector('.dropdown > .nav-item').click(); await sleep(200)
    if (!document.querySelector('#tsm-toc')) { document.querySelector('.menu-toggle').click(); await sleep(200) }
    ;[...document.querySelectorAll('#tsm-toc button')].find((b) => b.textContent.includes(needle)).click()
    await sleep(1500)
  }
  await open('Version Compatibility')
  await sfc.capture('u1-compat')
  await open('Power Button')
  document.querySelectorAll('.tsm-fig')[3].scrollIntoView()
  await sleep(1200)
  await sfc.capture('u2-power')
  const imgs = [...document.querySelectorAll('.tsm-fig img')]
  return { n: imgs.length, loaded: imgs.filter((i) => i.complete && i.naturalWidth > 0).length, overflow: document.documentElement.scrollWidth > innerWidth }
})()
