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
           console.log('products', productJSON)

         })
         .catch(error => {
           console.error('Error fetching product data:', error)
         })
      },

     onOptionChange(event: any) {
       const variant = event.dataset.variant

       window.dispatchEvent(
         new CustomEvent('option-changed', {
           detail: { variant }
         })
       )

       const url = getUrlWithVariant(window.location.href, variant.id)
       window.history.replaceState({ path: url }, '', url)
       this.selectedVariant = variant.id

       this.updateVariant(this.selectedVariant)

       this.renderOptions()

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

     renderOptions() {

      let options = this.productForm.optionInputs
       const fieldsets = document?.querySelectorAll('variant-selects fieldset')
       options?.forEach(option => {
           fieldsets?.forEach(fieldset => {
             fieldset
               ?.querySelectorAll('.variant-container input')
                 .forEach(input => {
                   if (option?.getAttribute('id') === input?.getAttribute('id')) {
                     input?.setAttribute(
                       'data-option-value-id',
                       option.getAttribute('id')
                       )
                     }
                   })
             })
         })

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

