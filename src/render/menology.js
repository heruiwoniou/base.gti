import moment from 'moment';

export default function Menology(context){
    let cal = context.el.querySelector('.calendar-panel');
    let init = cal == null ;
    cal = cal || document.createElement('div');
    let table = document.createElement('table');
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    thead.innerHTML = '<tr><td>日</th><td>一</th><td>二</th><td>三</th><td>四</th><td>五</th><td>六</th></tr>';

    let year = context.date.year();
    let month = context.date.month() + 1;
    let day = context.date.date();
    var temp_date = moment([year, month - 1, 1])
    var first_d = temp_date.day();
    var all_days = temp_date.add(1, 'month').subtract(1, 'd').date();

    let tr = document.createElement('tr'),
        td,
        i_d;
    for ( let i = 1 ; i <= 42 ; i ++)
    {
        td = document.createElement('td');
        if( first_d < i && i <= all_days + first_d)
        {
            //显示出几号
            i_d = i - first_d;
            td.innerHTML = i_d;
        }
        else
        {
            td.innerHTML = '&nbsp;';
        }
        tr.appendChild(td);
        if(i % 7 == 0 && i < 42)
        {
            tbody.appendChild(tr);
            tr = document.createElement('tr');
        }
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    cal.innerHTML = table.outerHTML;
    if( init ) {
        cal.className = 'calendar-panel';
        context.el.appendChild(cal);
    }
}