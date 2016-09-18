import $ from 'jQuery';

export default class Drag {
    constructor(events, context) {
        this._events = events;
        this._context = context;

        this.onstart = function() {};
    }

    get events() {
        return this._events;
    }


    get html() {
        let that = this;
        let $draggable = $('<div class="schedule-draggable"></div>');
        let $close = $('<span class="close">x</span>')
        $draggable.append($close);
        this.events.forEach(
            o => {
                let $a = $(`<a href="javascript:;">${o.title}</a>`);
                $a.click(function() {
                    that._context.handler.events.click.call(that, o);
                })
                $draggable.append($a);
            });
        let draggable =
            $.ui.draggable({
                helper: 'clone',
                appendTo: this._context.el,
                opacity: '.5',
                start(event, ui) {
                    that._context.draggable = draggable;
                    ui.helper.css({ width: that._context.cellWidth - 10 }).data('source', that);
                    $(document).off('mousewheel.globalmousewheel').on('mousewheel.globalmousewheel', function(...args) {
                        args[3] == -1 ? that._context.next() : that._context.prev();
                    })
                },
                stop(event, ui) {
                    that._context.draggable = null;
                    $(document).off('mousewheel.globalmousewheel')
                }
            }, $draggable);
        $close.click(function() {
            that._context.handler.events.close.before.call(that, that.events);
            for (let i = that._context.options.events.length - 1; i >= 0; i--) {
                if (that.events.filter(o => o == that._context.options.events[i]).length != 0)
                    that._context.options.events.splice(i, 1);
            }
            that._context.render();
            that._context.handler.events.close.after.call(that);
        })
        return $draggable;
    }
}