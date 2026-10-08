(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  await sleep(1500)
  document.querySelector('.dropdown > .nav-item').click()
  await sleep(200)
  document.querySelector('#quickref-menu button').click()
  await sleep(600)
  await sfc.capture('a1-closed')
  document.querySelector('.qr-adv summary').click()
  await sleep(300)
  await sfc.capture('a2-open')
  return { main: [...document.querySelectorAll('.quickref > .qr-steps li .qr-short')].map((e) => e.textContent), adv: [...document.querySelectorAll('.qr-adv .qr-short')].map((e) => e.textContent) }
})()
