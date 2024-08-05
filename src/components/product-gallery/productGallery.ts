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
      config: {},
      swiper: null as Swiper | null,

      init() {
        this.config = {
          direction: 'horizontal',
          loop: false,
          slidesPerView: 1,
          spaceBetween: 20,
          resizeObserver: true,
          breakpoints: {
            767: {
              direction: 'vertical',
              slidesPerView: 5
            }
          },
          pagination: {
            el: '.swiper-pagination'
          },
          zoom: {
            maxRatio: 2
          }
        }

        this.swiper = new Swiper('.swiper', this.config)

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
        this.swiper.destroy()

        let swiperWrapper = this.$el.querySelector('.swiper-wrapper')
        swiperWrapper.innerHTML = ''

        document.querySelector('.featuredMedia').src =
          variant.featured_media.preview_image.src

        window.variantImages[variant.id].forEach((image: any) => {
          this.newVariantImages.push(image)
        })

        this.newVariantImages.forEach((image: any) => {
          let slide = document.createElement('div')
          slide.classList.add('swiper-slide', 'cursor-pointer')
          slide.addEventListener('click', event => {
            this.updateImage(event, image)
          })
          let img = document.createElement('img')
          img.src = image
          img.classList.add('h-full', 'w-full', 'object-contain')
          slide.appendChild(img)
          swiperWrapper.appendChild(slide)
        })

        this.swiper = new Swiper('.swiper', this.config)

      },

      updateImage(event: object, mediaId: string) {
        console.log('mediaid', mediaId, 'event', event.target)
        this.$refs.imageTrack.src = mediaId

        let slides = document.querySelectorAll('.swiper-slide')

        slides.forEach(slide => {
          slide === event?.target?.parentElement ||
          slide.querySelector('img') === event?.target
            ? slide.classList.add('md:border', 'md:border-gray-800')
            : slide.classList.remove('md:border', 'md:border-gray-800')
        })
      },

      updateSlider() {
        // this.swiper.changeDirection('horizontal', true)
      },
      updateVerticalSliderHeight() {
        let verticalSlider = this.$el
        let sliderHeight = this.$refs.imageTrack.offsetHeight
        verticalSlider.style.height = sliderHeight + 'px'
        //  this.swiper.changeDirection('vertical', true)
      }
    })
  )
}
