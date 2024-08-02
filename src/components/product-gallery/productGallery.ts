import Swiper from 'swiper/bundle'
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
          loop: true,
          slidesPerView: 5
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
        }

        const updateWidth = throttle(() => {
          this.browserWidth = window.innerWidth
        }, 100) // 100ms throttle interval

        // Watch for changes in browser width
        window.addEventListener('resize', updateWidth)

        this.$watch('browserWidth', newBrowserWidth => {
          if (newBrowserWidth < 767) {
            this.updateSlider()
          } 
        })
      },

      updateGallery( variant: object) {
        this.newVariantImages = []
        let swiperWrapper = this.$el.querySelector('.swiper-wrapper')
        swiperWrapper.innerHTML = ''
        
        document.querySelector('.featuredMedia').src = variant.featured_media.preview_image.src


        window.variantImages[variant.id].forEach((image: any) => {
          this.newVariantImages.push(image)
        })

        swiperWrapper.innerHTML = `
          <template x-for="image in newVariantImages">
            <div @click="updateImage(image)" class="swiper-slide cursor-pointer">
              <img :src="image" class='h-full w-full object-contain'>
            </div>
          </template>
        `
        this.swiper.update()
    
      },

      updateImage(mediaId: string) {
        document.querySelector('.featuredMedia').src =
          mediaId
      },
      updateSlider() {
        this.swiper.destroy()

        this.swiper = new Swiper('.swiper', {
          direction: 'horizontal',
          loop: true,
          slidesPerView: 5,
        })
      }
    })
  )
}
