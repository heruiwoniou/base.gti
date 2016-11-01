export default {
    show() { return this.each(el => el.style.display = 'block'); },
    hide() { return this.each(el => el.style.display = 'none'); }
}