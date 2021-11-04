import { DirectiveBinding } from "vue"

/** Calls the callback provided as binding.value. */
export const clickedOutside = {
    beforeMount: (el: any, binding: DirectiveBinding<() => void>) => {
        el.clickOutsideEvent = (event: any) => {
            if (el == event.target || el.contains(event.target)) {
                return
            }
            binding.value()
        }
        document.addEventListener("click", el.clickOutsideEvent)
    },
    unmounted: (el: any) => {
        document.removeEventListener("click", el.clickOutsideEvent)
    },
}
