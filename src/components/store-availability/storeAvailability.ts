import Swiper from 'swiper/bundle'
export default (Alpine: any) => {
  Alpine.data(
    'storeAvailability', (defaultVariantId: number) => ({
      locationModal: false,
      pickupLocations: [],
      defaultVariantId,
      popupLocation: null as object | null,

      init() {
          window.addEventListener('option-changed', event => {
            this.updateStores(event.detail.variant)
          })
          this.updateStores({ id: this.defaultVariantId })

      },

      updateStores(variant: object) {
        this.pickupLocations = window.storeAvailabilities[variant.id]
      },

      renderPopup(location: object) {
        this.popupLocation = location
        this.locationModal = true
      }

      
    })
  )
}
