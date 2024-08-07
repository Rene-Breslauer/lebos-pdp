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
      todayHours: null as object | null,

      init() {
        window.addEventListener('option-changed', event => {
          this.updateStores(event.detail.variant)
        })
        this.updateStores({ id: this.defaultVariantId })

        this.$watch('locationModal', value => {
          document.querySelector('body').style.overflowY = value
            ? 'hidden'
            : 'auto'
        })
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
      const parsedHours = JSON.parse(hours);
      const operatingHours = parsedHours?.operating_hours?.daily_hours;

      if (!operatingHours) {
        return ['No operating hours available'];
      }

      const groupedHours = this.groupConsecutiveDays(operatingHours);
      const formattedHoursArray = groupedHours.map(
        group =>
          `<span>${group.days}</span> <span>${this.parseTime(
            group.open
          )} - ${this.parseTime(group.close)}</span>`
      );

      const today = new Date().toLocaleString('en-us', { weekday: 'long' });

      const todayHoursObj = this.findTodayHours(groupedHours, today);

      this.todayHours = todayHoursObj
        ? `${this.parseTime(todayHoursObj.open)} - ${this.parseTime(todayHoursObj.close)}`
        : 'Closed';

      return formattedHoursArray;
    },

    findTodayHours(groupedHours, today) {
      for (const group of groupedHours) {
        const daysRange = group.days.split('-');
        if (daysRange.length === 1 && daysRange[0] === today) {
          return group;
        } else if (daysRange.length === 2) {
          const startDayIndex = this.getDayIndex(daysRange[0]);
          const endDayIndex = this.getDayIndex(daysRange[1]);
          const todayIndex = this.getDayIndex(today);

          if (startDayIndex <= todayIndex && todayIndex <= endDayIndex) {
            return group;
          }
        }
      }
      return null;
    },

    getDayIndex(day) {
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return daysOfWeek.indexOf(day);
    },

    groupConsecutiveDays(hours) {
      let groupedHours = [];
      let currentGroup = { days: [], open: hours[0].open, close: hours[0].close };

      hours.forEach((hour, index) => {
        if (hour.open === currentGroup.open && hour.close === currentGroup.close) {
          currentGroup.days.push(hour.days);
        } else {
          groupedHours.push(currentGroup);
          currentGroup = { days: [hour.days], open: hour.open, close: hour.close };
        }

        if (index === hours.length - 1) {
          groupedHours.push(currentGroup);
        }
      });

      return groupedHours.map(group => {
        if (group.days.length > 1) {
          return {
            days: `${group.days[0]}-${group.days[group.days.length - 1]}`,
            open: group.open,
            close: group.close
          };
        } else {
          return {
            days: group.days[0],
            open: group.open,
            close: group.close
          };
        }
      });
    },

    parseTime(time) {
      const [hour, minute] = time.split(':');
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minute} ${ampm}`;
    },


      renderPopup(location: object) {
        this.popupLocation = location
        this.locationModal = true
      }
    })
  )
}
