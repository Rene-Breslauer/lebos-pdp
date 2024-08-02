import { getUrlWithVariant, ProductForm } from '@shopify/theme-product-form'

export default (Alpine: any) => {
 Alpine.data(
   'productForm',
   (productHandle: string, selectedVariant: number) => ({
     formElement: null as HTMLFormElement | null,
     variantIdInputDisabled: false,
     submitButton: null as HTMLButtonElement | null,
     submitButtonText: '',
     productHandle,
     selectedVariant,
     productForm: null as ProductForm | null,
     quantity: 1,
     selectedOptions: {} as { [key: string]: string },

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

       fetch(`/products/${this.productHandle}.js`)
         .then(response => response.json())
         .then(productJSON => {
           this.productForm = new ProductForm(this.formElement, productJSON, {
             onOptionChange: this.onOptionChange.bind(this),
             onFormSubmit: this.onFormSubmit.bind(this)
           })

           console.log('this.productForm', this.productForm)
           this.productOptions = this.productForm.optionInputs
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

       this.updateSelectedOption(event.target.name, event.target.value)

       if (variant === null) {
         // The combination of selected options does not have a matching variant
       } else if (variant && !variant.available) {
         // The combination of selected options has a matching variant but it is
         // currently unavailable
       } else if (variant && variant.available) {
         // The combination of selected options has a matching variant and it is
         // available
       }

        
     },

     updateSelectedOption(optionName: string, value: string) {
       let selectedOptions = this.$el.querySelectorAll(
         '.selectedOption'
       )

       selectedOptions.forEach(option => {
          if (option.dataset.optionName === optionName) {
            option.textContent = value
          }
        })
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
