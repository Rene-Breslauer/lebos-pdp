import Swiper from 'swiper/bundle'
import 'swiper/swiper-bundle.css'
import { Navigation, Pagination, Scrollbar } from 'swiper/modules'

export default (Alpine: any) => {
  Alpine.data(
    'featuredCollection', () => ({
      config: {},
      swiper: null as Swiper | null,
      variantData: window.variant,

      init() {
        this.config = {
          direction: 'horizontal',
          loop: false,
          slidesPerView: 2,
          spaceBetween: 20,
          resizeObserver: true,
          breakpoints: {
            767: {
              slidesPerView: 5
            }
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        }

        this.swiper = new Swiper('.swiper-featured-col', this.config)
      },

      selectOption(event: Event, index: number) {

        const variantId = event.currentTarget.dataset.variantId
        const variant = this.variantData[variantId]
        const variantImage = this.variantData[variantId].image

        const cards = document.querySelectorAll('.card-wrapper')

        cards.forEach((card, i) => {
          if (parseInt(card.dataset.index) === index) {
            let image = card.querySelector('.card__media > div > img')
            let priceContainer = card.querySelector('.price__container')
            priceContainer.innerHTML = ''

            image.setAttribute('src', variantImage)
            
            if (variant.price >= variant.compare_at_price) {
              priceContainer.innerHTML = `<span class="text-sm font-bold text-gray-800">${Alpine.store('currency').formatMoney(variant.price)}</span>`
            } else {
              priceContainer.innerHTML = `<span class="text-sm font-bold text-gray-800">${Alpine.store(
                'currency'
              ).formatMoney(variant.price)}</span> 
              <span class="text-xs line-through">${Alpine.store(
                'currency'
              ).formatMoney(variant.compare_at_price)}</span>`
            }
          }
        })
      },

     
    })
  )
}
