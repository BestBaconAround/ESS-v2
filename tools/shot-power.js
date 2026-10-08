(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  await sleep(1500)
  document.querySelector('.dropdown > .nav-item').click()
  await sleep(200)
  await sfc.capture('p1-menu')
  document.querySelectorAll('#quickref-menu button')[2].click()
  await sleep(700)
  await sfc.capture('p2-top')
  document.querySelector('#qr-generator').scrollIntoView()
  await sleep(300)
  await sfc.capture('p3-generator')
  return { sections: [...document.querySelectorAll('.qr-section')].map((s) => s.id + ':' + s.querySelectorAll('.qr-steps')[0].children.length + '+' + (s.querySelectorAll('.qr-adv li').length)), overflow: document.documentElement.scrollWidth > innerWidth }
})()
