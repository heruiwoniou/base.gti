import moment from 'moment';
import $ from 'jQuery';
import Header from './render/header.js';
import Menology from './render/menology.js';

const set_options = function(date, options) {
    this.date = moment(date);
    this.options = $.extend(true, {
        width: '100%',
        theadHeight: 50,
        titleHeight: 100,
        cellHeight: null
    }, this.options, options);
}

class Calendar {
    constructor(
        element, date = (new Date()), options = {}
    ) {
        this.el = element.nodeName ? element : document.querySelector(element);
        this.el.className = (this.el.className ? ' calendar' : 'calendar');
        this.options = {};
        this.handler = {
            cell: {
                rendering: function(date, txt, row, cell) { return txt; }
            },
            render: {
                before: function() {},
                after: function() {}
            }
        }

        set_options.call(this, date, options);

        this.Header = new Header(this);
        this.Menology = new Menology(this);
    }

    get cellHeight() {
        return (this.options.cellHeight === null ? this.width / 7 : this.options.cellHeight);
    }

    get cellWidth() {
        return this.width / 7;
    }

    /**
     * 获取宽度
     */
    get width() {
            if (typeof this.options.width == 'number')
                return this.options.width;
            else return this.el.offsetWidth;
        }
        /**
         * 设置高度 
         */
    set width(value) {
        if ('number' !== typeof value) throw new Error('must a number key');
        this.options.width = value;
        this.render();
    }

    /**
     * 设置事件
     */
    set oncellrendering(cellrendering) {
        if (typeof cellrendering !== 'function') throw new Error('must a function key');
        this.handler.cell.rendering = cellrendering;
    }

    /*
     * 设置日历渲染前进行的操作
     */

    set onrenderbefore(renderbefore) {
            if (typeof renderbefore !== 'function') throw new Error('must a function key');
            this.handler.render.before = renderbefore;
        }
        /*
         * 设置日历渲染完毕进行的操作
         */
    set onrenderafter(renderafter) {
        if (typeof renderafter !== 'function') throw new Error('must a function key');
        this.handler.render.after = renderafter;
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

    render(...args) {

        if (args.length != 0 && (Array.isArray(args[0]) || typeof args[0].getYear == 'function'))
            set_options.call(this, args[0], args[1] || {});

        this.handler.render.before.apply(this);

        this.el.style.height = this.options.height + 'px';
        this.el.style.width = this.options.width + 'px';

        this.Header.render();
        this.Menology.render();

        this.handler.render.after.apply(this);
    }
}
export default Calendar;