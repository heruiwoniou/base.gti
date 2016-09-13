import Calendar from './Calendar';
import $ from 'jQuery';

class Schedule extends Calendar {
    constructor(
        element,
        date = (new Date()),
        options = {}
    ) {
        super(element, date, options);
        this.draggable = null;

        this.oncellrendering = function(date, txt, row, cell) {
            var that = this;
            var $span = $(`<span>${ txt }</span>`);
            var $div = $('<div class="schedule-item"></div>');
            $div.css({ minHeight: this.cellHeight + 'px' });
            var $draggable = $('<div class="schedule-draggable"></div>');
            let events = this.options.events.filter(o => date.isSame(o.start));
            events.forEach(o => $draggable.append(`<a href="javascript:;">${o.title}</a>`));
            $div.append($span);
            if (events.length !== 0) {
                $div.append($draggable);
                let draggable =
                    $.ui.draggable({
                        helper: 'clone',
                        appendTo: that.el,
                        revert: 'invalid',
                        opacity: '.5',
                        start(event, ui) {
                            that.draggable = draggable;
                            ui.helper.css({ width: that.cellWidth - 10 });
                            $(document).off('mousewheel.globalmousewheel').on('mousewheel.globalmousewheel', function(...args) {
                                args[3] == -1 ? that.next() : that.prev();
                            })
                        },
                        stop(event, ui) {
                            that.draggable = null;
                            $(document).off('mousewheel.globalmousewheel')
                        }
                    }, $draggable);
            }
            return $div;
        }

        this.onrenderbefore = function() {

        }
        this.onrenderafter = function() {
            $(this.el).find('tbody:not([droppable]) td').each(function() {
                console.log($(this).height());
            }).droppable({
                accept: '.schedule-draggable',
                hoverClass: 'schedule-to'
            });
            if (this.draggable) {
                $.ui.ddmanager.prepareOffsets(this.draggable);
                $.ui.ddmanager.dragStart(this.draggable)
            }
        }
    }
}

export default Schedule