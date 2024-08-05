import ProductForm from '@shopify/theme-product-form'

export default (Alpine: any) => {
  Alpine.data(
    'storeAvailability',
    (defaultVariantId: number) => ({
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
        const locations = window.storeAvailabilities[variant.id]
        if (locations && typeof locations === 'object') {
          this.pickupLocations = Object.values(locations).map(location => {
            location.address = this.formatAddress(location.address)
            return location
          })
        } else {
          console.error(
            'Expected an object for store availabilities, but got:',
            locations
          )
          this.pickupLocations = []
        }
      },

      formatAddress(address: string) {
        let addressParts = address.split('<br>')
        addressParts.pop()
        return addressParts.join(' ')
      },

      renderPopup(location: object) {
        this.popupLocation = location
        this.locationModal = true
      },

      
    })
  )
}
