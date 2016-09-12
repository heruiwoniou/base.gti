import moment from 'moment';
import $ from 'jQuery';

export default function Menology(context) {
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

    let year = context.date.year();
    let month = context.date.month() + 1;
    let day = context.date.date();
    var start_date = moment([year, month - 1, 1]);
    var end_date = moment([year, month, 1]).subtract(1, 'd');
    var all_days = end_date.date();
    var first_d = start_date.day();
    start_date.subtract(first_d + 1, 'd');
    //确认几行显示
    var cells = (all_days + first_d + 6 - end_date.day()) >= 42 ? 49 : 42;
    let tr = document.createElement('tr'),
        td,
        i_d;
    for (let i = 1; i <= cells; i++) {
        td = document.createElement('td');
        let current_date = start_date.add(1, 'day');
        var cm = current_date.month() + 1;
        $(td).append(
            context.events.cell.rendering.call(context, moment(current_date), current_date.date())
        )
        td.className = cm == month ? 'c' : 'o';
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