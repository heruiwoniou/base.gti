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

        let dropcontainer = null;
        let dropitems = null;

        this.oncellrendering = function(date, txt, row, cell) {
            var that = this;
            var $span = $(`<span>${ txt }</span>`);
            var $div = $('<div class="schedule-item"></div>');
            $div.css({ minHeight: this.cellHeight + 'px' });
            var $draggable = $('<div class="schedule-draggable"></div>');
            let events = this.options.events.filter(o => date.isSame(o.start));
            events.forEach(o => $draggable.append(`<a href="javascript:;">${o.title}</a>`));
            $div.append($span);
            dropitems.push({ row, cell });
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
            dropitems = [];
            if (!dropcontainer) {
                let { titleHeight, theadHeight } = this.options;
                dropcontainer = $(`<div class="schedule-drop-container" style="top:${ titleHeight + theadHeight + 2 }px"></div>`);
                this.el.appendChild(dropcontainer.get(0));
            }
            dropcontainer.empty();
        }
        this.onrenderafter = function() {
            $(this.el).find('tbody td').each((i, td) => {
                    let height = $(td).height();
                    let width = this.cellWidth;
                    let { row, cell } = dropitems[i];
                    let html = `<div class="schedule-drop" style="height:${ height + 4 }px;width:${ width }px"></div>`;
                    dropcontainer.append(html)
                })
                // .droppable({
                //     accept: '.schedule-draggable',
                //     hoverClass: 'schedule-to'
                // });
            if (this.draggable) {
                $.ui.ddmanager.prepareOffsets(this.draggable);
                $.ui.ddmanager.dragStart(this.draggable)
            }
        }
    }
}

export default Schedule