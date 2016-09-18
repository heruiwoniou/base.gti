import $ from 'jQuery';

export default class Header {
    constructor(context) {
        this.context = context;
    }

    get height() {
        return this.context.options.titleHeight;
    }

    render() {
        let context = this.context;
        let head = context.el.querySelector('h1');
        let init = head == null;
        head = head || document.createElement('h1');
        head.innerHTML = `<span class="left"><</span>${context.date.year()}年${context.date.month() + 1}月<span class="right">></span>`
        head.style.lineHeight = context.options.titleHeight + 'px'
        if (init) {
            context.el.appendChild(head);
            $(head).on('click', 'span', function() {
                if (this.className == 'left') {
                    context.prev();
                } else {
                    context.next()
                }
            })
        }
    }
}