import moment from 'moment';
import $ from 'jQuery';

import Header from './render/header.js';
import Menology from './render/menology.js';

class Calendar {
    constructor(
        element, date = (new Date()) , options = {}
        ) {
        this.el = element.nodeName ? element : document.querySelector(element);
        this.el.className =  ( this.el.className ? ' calendar' : 'calendar' );
        this.date = moment(date);
        this.options = $.extend(true,
            {
                render : {
                    before : function(){},
                    after : function(){}
                }
            },options);
        this.render();
    }

    next()
    {
        this.date = this.date.add(1, 'month');
        this.render(false);
    }

    prev()
    {
        this.date = this.date.subtract(1, 'month');
        this.render(false);
    }

    clear()
    {

    }

    render(
        refresh = true
        ){
        this.options.render.before.apply(this);
        Header(this);
        Menology(this);
        this.options.render.after.apply(this);
    }

    render_schedule(){

    }
}
export default Calendar
