export {}

let loaded = false

const init = async () => {
  if (loaded) return
  loaded = true
  const { default: Alpine } = await import('alpinejs')


  const { ProductForm } = await import('../components/index')
  const { ProductGallery } = await import('../components/index')
  const { StoreAvailability } = await import('../components/index')

  Alpine.plugin(ProductForm)
  Alpine.plugin(ProductGallery)
  Alpine.plugin(StoreAvailability)

  Alpine.store('variant', {})

  Alpine.store('currency', {
    formatMoney(price) {
      return price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    }
  })



  Alpine.start()
  window.Alpine = Alpine
}

document.addEventListener('mousedown', init, { once: true })
document.addEventListener('mousemove', init, { once: true })
document.addEventListener('scroll', init, { once: true })
document.addEventListener('touchstart', init, { once: true })
document.addEventListener('keydown', init, { once: true })

init()
