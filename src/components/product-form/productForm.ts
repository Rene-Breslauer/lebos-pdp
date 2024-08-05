import { getUrlWithVariant, ProductForm } from '@shopify/theme-product-form'

export default (Alpine: any) => {
 Alpine.data(
   'productForm',
   (
     productHandle: string,
     selectedVariant: number,
     available: boolean,
     availability: string
   ) => ({
     formElement: null as HTMLFormElement | null,
     variantIdInputDisabled: false,
     submitButton: null as HTMLButtonElement | null,
     submitButtonText: '',
     productHandle,
     selectedVariant,
     available,
     availability,
     productForm: null as ProductForm | null,
     quantity: 1,
     selectedOptions: {} as { [key: string]: string },
     variant: {},
     groupedVariants: {} as { [key: string]: any },

     init() {
       this.formElement = this.$el.querySelector('.form')

       if (this.formElement) {
         this.formElement.addEventListener(
           'submit',
           this.onFormSubmit.bind(this)
         )
       }

       this.submitButton = this.$el.querySelector('.submit')
       if (this.submitButton) {
         this.submitButtonText = 'Submit'
       }

       this.fetchProduct(this.productHandle)

       this.updateVariant(this.selectedVariant)
     },

     fetchProduct(productHandle: string) {
          fetch(`/products/${productHandle}.js`)
         .then(response => response.json())
         .then(productJSON => {
           this.productForm = new ProductForm(this.formElement, productJSON, {
             onOptionChange: this.onOptionChange.bind(this),
             onFormSubmit: this.onFormSubmit.bind(this)
           })

           this.productOptions = this.productForm.optionInputs
         })
         .catch(error => {
           console.error('Error fetching product data:', error)
         })
      },

     onOptionChange(event: any) {
       const variant = event.dataset.variant

      //  this.renderOptions(event.target.value)

       window.dispatchEvent(
         new CustomEvent('option-changed', {
           detail: { variant }
         })
       )

       const url = getUrlWithVariant(window.location.href, variant.id)
       window.history.replaceState({ path: url }, '', url)

       this.selectedVariant = variant.id

       this.updateVariant(this.selectedVariant)

       if (variant === null) {
         // The combination of selected options does not have a matching variant
         this.available = false
         this.availability = 'unavailable'
       } else if (variant && !variant.available) {
         // The combination of selected options has a matching variant but it is
         // currently unavailable
         this.available = false
         this.availability = 'sold_out'
       } else if (variant && variant.available) {
         // The combination of selected options has a matching variant and it is
         // available
         this.available = true
         this.availability = 'available'
       }
     },


     renderOptions(optionValue: string) {

      for (let i = 1; i <= 3; i++) {
        // Adjust if more options exist
        const optionName = `option${i}`
        this.groupedVariants[optionName] = this.groupVariantsByOption(
          optionValue, optionName, this.productForm.product.variants
        )
      }

      Object.keys(this.groupedVariants).forEach(optionName => {
        let fieldset = document.getElementById(optionName)
        
        if (fieldset && optionName !== 'option1') {
          const optionContainer = fieldset.querySelector('div.variant-container')
          optionContainer.innerHTML = '' 

          Object.keys(this.groupedVariants[optionName]).forEach(optionValue => {

            this.groupedVariants[optionName][optionValue].forEach(variant => {
                const optionElement = document.createElement('div')
                optionElement.classList.add('flex')
                let fieldName = fieldset.dataset.name
                let fieldForm = fieldset.dataset.form
                let variantId = variant.id
                optionElement.innerHTML = `
                <input
                  type="radio"
                  id="${fieldName}-${variant[optionName]}"
                  name="options[${fieldName}]"
                  value="${variant[optionName]}"
                  class="appearance-none h-0 w-0 absolute inset-0 hidden"
                  form="${fieldForm}"
                  data-variant="${variantId}"
                >
                <label
                  for="${fieldName}-${variant[optionName]}"
                  class="px-3.5 py-1.5 border border-gray-200 rounded-sm text-sm font-semibold cursor-pointer transition"
                  :class="${variant.available} ? '' : 'cursor-not-allowed bg-gray-200 line-through text-gray-700'"
                >
                  ${variant[optionName]}
                </label>
              `

              setTimeout(() => {
                if (variantId === this.selectedVariant) {
                  optionElement.querySelector('input').checked = true
                }
              },200)

              optionContainer.appendChild(optionElement)

                
            })
          })
        }
      })
      this.fetchProduct(this.productHandle)

    },

    groupVariantsByOption(optionValue: string, optionName: string, variants: any) {
     const variantsArray = Object.values(variants)

     // Filter the array to include only variants where option1 matches optionName
     const filteredVariants = variantsArray.filter(
       variant => variant.option1 === optionValue
     )
     // Group the filtered variants into an array within one object
      const groupedVariants = {}
      filteredVariants.forEach(variant => {
        const optionValue = variant[optionName]
        if (!groupedVariants[optionValue]) {
          groupedVariants[optionValue] = []
        }
        groupedVariants[optionValue].push(variant)
      })
      return groupedVariants

      },

     updateVariant(variantId: any) {
       let variant = window.variant[variantId]

       this.variant = {
         id: variant.id,
         price: Alpine.store('currency').formatMoney(variant.price),
         compareAtPrice: Alpine.store('currency').formatMoney(
           variant.compare_at_price
         ),
         available: variant.available,
         quantityRuleSoldOut: variant.quantity_rule_sold_out,
         showCompareAt: variant.price < variant.compare_at_price
       }

       Alpine.store('variant', this.variant)

     },

     getQueryParam(param) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    },

     onQuantityChange(event: any) {
       this.quantity = event.target.value
     },

     onFormSubmit(event: Event) {
       event.preventDefault()
       console.log('event', event)
     }
   })
 )
}
