import ProductForm from '@shopify/theme-product-form'

export default (Alpine: any) => {
  Alpine.data(
    'storeAvailability',
    (defaultVariantId: number, productHandle: string) => ({
      locationModal: false,
      pickupLocations: [],
      defaultVariantId,
      productHandle,
      popupLocation: null as object | null,

      init() {
        window.addEventListener('option-changed', event => {
          this.updateStores(event.detail.variant)
        })
        this.updateStores({ id: this.defaultVariantId })
      },

      async fetchLocationData(variantId: number) {
        const graphql = JSON.stringify({
          query: `query GetStoreAvailability($handle: String!) {
            product(handle: $handle) {
              variants(first: 250) {
                nodes {
                  id
                  storeAvailability(first: 10) {
                    edges {
                      node {
                        available
                        pickUpTime
                        location {
                          name
                          address {
                            address1
                            address2
                            city
                            provinceCode
                            zip
                            phone
                          }
                          metafield(namespace:"store",key:"operating_hours") {
                            value
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }`,
          variables: {
            handle: `${productHandle}`,
            id: `${this.defaultVariantId}`
          }
        })

        const myHeaders = new Headers()
        myHeaders.append(
          'X-Shopify-Storefront-Access-Token',
          '2af480c4bcfab71479b314fff1b12f60'
        )
        myHeaders.append('Content-Type', 'application/json')

        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: graphql,
          redirect: 'follow'
        }

        try {
          const response = await fetch(
            'https://lebos-test.myshopify.com/api/2024-10/graphql.json',
            requestOptions
          )
          const result = await response.json()

          console.log('result', result)

          const variants = result.data.product.variants.nodes

          const targetVariant = variants.find(
            variant =>
              variant.id === `gid://shopify/ProductVariant/${variantId}`
          )

          if (targetVariant) {
            // Reduce the storeAvailability to an object with store location names as keys
            const storeAvailability =
              targetVariant.storeAvailability.edges.reduce((acc, edge) => {
                const locationName = edge.node.location.name
                acc[locationName] = edge.node
                return acc
              }, {})

            // Transform the object into an array of key-value pairs
            this.pickupLocations = Object.entries(storeAvailability).map(
              ([key, value]) => ({
                name: key,
                ...value,
                address: `${value?.location?.address?.address1}, ${value?.location?.address?.city}, ${value?.location?.address?.provinceCode} ${value?.location?.address?.zip}`,
                addressPopup: `${value?.location?.address?.address1}<br>${value?.location?.address?.city}, ${value?.location?.address?.provinceCode} ${value?.location?.address?.zip}`,
                phone: value?.location?.address?.phone,
                pickUpTime: value?.pickUpTime,
                formattedHours: this.formatHours(
                  value?.location?.metafield?.value
                )
              })
            )

            console.log(
              'pickupLocations hours',
              this.pickupLocations.formatHours
            )
          } else {
            console.log('Variant not found')
          }
        } catch (error) {
          console.error(error)
        }
      },

      updateStores(variant: object) {
        this.fetchLocationData(variant.id)
      },

      formatHours(hours) {
        const parsedHours = JSON.parse(hours)
        const operatingHours = parsedHours?.operating_hours?.regular_hours

        if (!operatingHours) {
          return ['No operating hours available']
        }

        const formattedHoursArray = operatingHours.map(
          hour =>
            `<span>${hour.days}</span> <span>${this.parseTime(
              hour.open
            )} - ${this.parseTime(hour.close)}</span>`
        )

        return formattedHoursArray
      },

      parseTime(time: string) {
        const [hour, minute] = time.split(':').map(Number)
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const adjustedHour = hour % 12 || 12 // Convert 0 to 12 for midnight
        return `${adjustedHour}:${minute.toString().padStart(2, '0')} ${ampm}`
      },

      renderPopup(location: object) {
        this.popupLocation = location
        this.locationModal = true
      },


    })
  )
}
