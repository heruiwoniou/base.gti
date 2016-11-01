export default {
    show() {
        return this.each(function(el) { el.style.display = 'block' })
    },
    hide() {
        return this.each(function(el) { el.style.display = 'none' })
    }
}