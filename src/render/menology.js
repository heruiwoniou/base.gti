import moment from 'moment';
import $ from 'jQuery';

class Menology {
    constructor(context) {
        this.context = context;
    }

    get year() {
        return this.context.date.year();
    }
    get month() {
        return this.context.date.month() + 1;
    }

    get startDate() {
        return moment([this.year, this.month - 1, 1]);
    }

    get endDate() {
        return moment([this.year, this.month, 1]).subtract(1, 'd');
    }

    get monthTotalDays() {
        return this.endDate.date();
    }

    get totlCells() {
        return (this.monthTotalDays + this.startDate.day() + 6 - this.endDate.day()) >= 42 ? 49 : 42;
    }

    render() {
        let context = this.context;
        let cal = context.el.querySelector('.calendar-panel');
        let init = cal == null;
        cal = cal || document.createElement('div');
        let $cal = $(cal);
        let table = document.createElement('table');
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');
        thead.innerHTML = '<tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>';
        thead.style.lineHeight = context.options.theadHeight + 'px';
        tbody.style.lineHeight = context.cellHeight + 'px'

        var cells = this.totlCells;
        var start_date = moment(this.startDate);
        var first_d = this.startDate.day();
        start_date.subtract(first_d + 1, 'd');
        let tr = document.createElement('tr'),
            td,
            i_d;
        for (let i = 1; i <= cells; i++) {
            td = document.createElement('td');
            let current_date = start_date.add(1, 'day');
            var cm = current_date.month() + 1;
            $(td).append(
                context.events.cell.rendering.call(context, moment(current_date), current_date.date(), Math.ceil(i / 7) - 1, (i - 1) % 7)
            )
            td.className = cm == this.month ? 'c' : 'o';
            tr.appendChild(td);
            if (i % 7 == 0 && i < cells) {
                tbody.appendChild(tr);
                tr = document.createElement('tr');
            }
        }

        table.appendChild(thead);
        table.appendChild(tbody);
        $cal.empty().append(table);
        if (init) {
            $cal.addClass('calendar-panel');
            context.el.appendChild($cal.get(0));
        }
    }
}

export default Menology