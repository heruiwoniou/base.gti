import moment from 'moment';
import $ from 'jQuery';
import Body from './render/body.js';
import Header from './render/header.js';
import Menology from './render/menology.js';

class Calendar {
    constructor(
        element, date = (new Date()), options = {}
    ) {
        this.el = element.nodeName ? element : document.querySelector(element);
        this.el.className = (this.el.className ? ' calendar' : 'calendar');
        this.date = moment(date);
        this.events = {
            cell: {
                rendering: function(date, txt) { return txt; }
            }
        }
        this.options = $.extend(true, {
            width: '100%',
            theadHeight: 20,
            titleHeight: 30,
            cellHeight: null
        }, options);
    }

    /**
     * 设置宽度
     */
    get width() {
        if (typeof this.options.width == 'number')
            return this.options.width;
        else return this.el.offsetWidth;
    }

    set width(value) {
        if ('number' !== typeof value) throw new Error('must a number key');
        this.options.width = value;
        this.render();
    }

    /**
     * 设置事件
     */
    set oncellrendering(rendering) {
        if (typeof rendering !== 'function') throw new Error('must a function key');
        this.events.cell.rendering = rendering;
    }

    next() {
        this.date = this.date.add(1, 'month');
        this.render(false);
    }

    prev() {
        this.date = this.date.subtract(1, 'month');
        this.render(false);
    }

    clear() {

    }

    render(
        refresh = true
    ) {
        Body(this);
        Header(this);
        Menology(this);
    }
}
export default Calendar;