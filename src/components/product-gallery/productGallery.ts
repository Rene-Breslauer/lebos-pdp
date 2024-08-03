import Swiper from 'swiper/bundle'
import 'swiper/swiper-bundle.css'
import { Navigation, Pagination, Scrollbar } from 'swiper/modules'


export default (Alpine: any) => {
  Alpine.data(
    'productGallery',
    (productHandle: string, selectedVariant: number) => ({
      productHandle,
      selectedVariant,
      newVariantImages: [],
      swiper: null as Swiper | null,

      init() {
        const config = {
          direction: 'vertical',
          loop: false,
          slidesPerView: 1,
          spaceBetween: 20,
          breakpoints: {
            767: {
              slidesPerView: 5,
              direction: 'horizontal'
            }
          },
          pagination: {
            el: '.swiper-pagination'
          },
          zoom: {
            maxRatio: 2
          }
        }

        this.swiper = new Swiper('.swiper', config)

        window.addEventListener('option-changed', event => {
          this.updateGallery(event.detail.variant)
        })

        // Update vertical slider height
        function throttle(func, limit) {
          let inThrottle
          return function (...args) {
            const context = this
            if (!inThrottle) {
              func.apply(context, args)
              inThrottle = true
              setTimeout(() => (inThrottle = false), limit)
            }
          }
        }

        this.browserWidth = window.innerWidth

        if (this.browserWidth < 767) {
          this.updateSlider()
        } else {
          this.updateVerticalSliderHeight()
        }

        const updateWidth = throttle(() => {
          this.browserWidth = window.innerWidth
        }, 100) // 100ms throttle interval

        // Watch for changes in browser width
        window.addEventListener('resize', updateWidth)

        this.$watch('browserWidth', newBrowserWidth => {
          if (newBrowserWidth < 767) {
            this.updateSlider()
            this.$refs.verticalSlider.style.height = 'auto'
          } else {
             this.updateVerticalSliderHeight()
          }
        })
      },

      updateGallery(variant: object) {
        this.newVariantImages = []
        let swiperWrapper = this.$el.querySelector('.swiper-wrapper')
        swiperWrapper.innerHTML = ''

        document.querySelector('.featuredMedia').src =
          variant.featured_media.preview_image.src

        window.variantImages[variant.id].forEach((image: any) => {
          this.newVariantImages.push(image)
        })

        this.swiper.update()

        swiperWrapper.innerHTML = `
          <template x-for="image in newVariantImages">
            <div @click="updateImage(image)" class="swiper-slide cursor-pointer">
              <img :src="image" class='h-full w-full object-contain'>
            </div>
          </template>
        `
        
      },

      updateImage(mediaId: string) {
        document.querySelector('.featuredMedia').src = mediaId
      },
      updateSlider() {
      this.swiper.changeDirection('horizontal', true)
      },
      updateVerticalSliderHeight() {
        let verticalSlider = this.$el
        let sliderHeight = this.$refs.imageTrack.offsetHeight
        verticalSlider.style.height = sliderHeight + 'px'
         this.swiper.changeDirection('vertical', true)
      }
    })
  )
}
