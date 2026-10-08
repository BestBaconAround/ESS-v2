(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  await sleep(1500)
  document.querySelector('.dropdown > .nav-item').click()
  await sleep(200)
  document.querySelector('.menu-toggle').click()
  await sleep(300)
  await sfc.capture('t1-toc')
  const items = [...document.querySelectorAll('#tsm-toc button')]
  items[9].click() // Battery
  await sleep(600)
  await sfc.capture('t2-battery')
  const title = document.querySelector('.qr-title').textContent
  document.querySelector('.dropdown > .nav-item').click(); await sleep(200)
  ;[...document.querySelectorAll('#tsm-toc button')].find((b) => b.textContent.includes('Alarm')).click()
  await sleep(600)
  document.querySelector('.fault-btn').click()
  await sleep(500)
  await sfc.capture('t3-faults')
  return { title, items: items.length, faultButtons: document.querySelectorAll('.fault-btn').length, overflow: document.documentElement.scrollWidth > innerWidth }
})()
