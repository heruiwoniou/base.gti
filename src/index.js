import Calendar from './Calendar';
import $ from 'jQuery';

class Schedule extends Calendar {
    constructor(
        element,
        date = (new Date()),
        options = {}
    ) {
        super(element, date, options);
        this.oncellrendering = function(date, txt) {
            var $span = $(`<span>${ txt }</span>`);
            var $div = $('<div class="schedule-item"></div>');
            $div.html("<a href='javascript:;'>标签一</a><a href='javascript:;'>标签二</a><a href='javascript:;'>标签三</a>");
            $div.prepend($span)
            return $div;
        }
        this.render();
    }
}

export default Schedule