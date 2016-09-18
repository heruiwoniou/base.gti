import Calendar from './Calendar';
import Drag from './render/drag';
import Drop from './render/drop';

import $ from 'jQuery';

class Schedule extends Calendar {
    constructor(
        element,
        options = {},
        date = (new Date())
    ) {
        super(element, date, options);
        this.draggable = null;

        let dropcontainer = null;
        let dropitems = null;
        this.handler.events = {
            click: function(evt) {},
            changed: function() {},
            close: {
                before: function(evts) {},
                after: function() {}
            }
        };
        this.handler.cell.click = function(dt) {}

        this.oncellrendering = function(date, txt, row, cell) {
            var that = this;
            var $span = $(`<span>${ txt }</span>`);
            var $div = $('<div class="schedule-item"></div>');
            var $draggable = $('<div class="schedule-draggable"></div>');
            let events = this.options.events.filter(o => date.isSame(o.date));

            $div.css({ minHeight: this.cellHeight + 'px' });
            $div.append($span);
            dropitems.push({ row, cell, date });

            if (events.length !== 0) {
                let drag = new Drag(events, that);
                $div.append(drag.html);
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
            let that = this;
            $(this.el).find('tbody td').each((i, td) => {
                let height = $(td).height();
                let width = this.cellWidth;
                let drop = new Drop(width, height, that, dropitems[i])
                dropcontainer.append(drop.html);
            })
            dropcontainer.find('.schedule-drop').droppable({
                accept: '.schedule-draggable',
                hoverClass: 'schedule-to',
                tolerance: 'pointer',
                drop(event, ui) {
                    let $this = $(this);

                    let drag = ui.helper.data('source');
                    let drop = $this.data('source');
                    if (!drop.date.isSame(drag.events[0].date)) {
                        let o = $.extend(true, [], drag.events);
                        drag.events.forEach(o => o.date = drop.date._d);
                        let n = drag.events;
                        that.handler.events.changed.call(that, o, n);
                        that.render();
                    }
                }
            });
            if (this.draggable) {
                $.ui.ddmanager.prepareOffsets(this.draggable);
                $.ui.ddmanager.dragStart(this.draggable)
            }
        }

    }

    /**
     * 单元格被单击事件
     */
    set oncellclick(oncellclick) {
        if (typeof oncellclick !== 'function') throw new Error('must a function key');
        this.handler.cell.click = oncellclick;
    }

    /**
     * 日程内容变动后事件
     */
    set oneventschanged(oneventschanged) {
        if (typeof oneventschanged !== 'function') throw new Error('must a function key');
        this.handler.events.changed = oneventschanged;
    }

    /**
     * 日程明细点击事件
     */
    set oneventclick(oneventclick) {
        if (typeof oneventclick !== 'function') throw new Error('must a function key');
        this.handler.events.click = oneventclick;
    }

    /**
     * 日程被清除前事件
     */
    set oneventclosebefore(oneventclosebefore) {
        if (typeof oneventclosebefore !== 'function') throw new Error('must a function key');
        this.handler.events.close.before = oneventclosebefore;
    }

    /**
     * 日程被清除后事件
     */
    set oneventcloseafter(oneventcloseafter) {
        if (typeof oneventcloseafter !== 'function') throw new Error('must a function key');
        this.handler.events.close.after = oneventcloseafter;
    }


}

export default Schedule