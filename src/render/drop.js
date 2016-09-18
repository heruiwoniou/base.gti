import $ from 'jQuery';
import moment from 'moment';

export default class Drop {
    constructor(width, height, context, { row, cell, date }) {
        this.row = row;
        this.cell = cell;
        this.date = moment(date);
        this.context = context;

        this._width = width;
        this._height = height;
    }

    set width(value) {
        this.width = value;
    }

    set height(value) {
        this.height = value;
    }

    get width() { return this._width; }
    get height() { return this._height; }

    get html() {
        var that = this;
        var $result = $(`<div class="schedule-drop" style="height:${ this.height + 4 }px;width:${ this.width }px"></div>`)
        $result.click(function() {
            that.context.handler.cell.click.call(that, that.date._d)
        })
        $result.data('source', this);
        return $result;
    }
}