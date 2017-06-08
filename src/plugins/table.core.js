import { ie, lowie } from './../core/browser';
import { fillChar } from './../core/const';
import Monitor from './../core/monitor';
import $ from 'jquery';

let table_uid = 0;
let table_td_tbpadding = 10;
let table_td_lrpadding = 20;
let rowheight = 18;
let validDragTime = 100; //毫秒
let br = '<br>';

function render(editor) {
    var arr = [];
    var cellwidth = Math.floor((this.width - this.cell * table_td_lrpadding - (this.cell + 1)) / this.cell);
    var rowheight = 18
    arr.push(`<table class='${ table_mark }' uid='${ this.uid }'>`);
    for (var i = 0; i < this.row; i++) {
        arr.push(`<tr row = '${ i }'>`);
        for (var j = 0; j < this.cell; j++) {
            arr.push(`<td width='${ cellwidth }' height='${ rowheight }' cell = '${ j }'>${ lowie ? fillChar : br }</td>`);
        }
        arr.push(`</tr>`);
    }
    arr.push(`</table>`);

    this._init();

    var table = createElement('table');

    return table;
}
export const table_mark = 'sheet';

export default class Table {
    constructor(editor, row, cell) {
        this.uid = table_uid++;
        this.row = row;
        this.cell = cell;
        this.editor = editor;
        Editor.plugins.table.instances[this.uid] = this;
        this.caption = false;
        this.width = this.editor.width - 2 * this.editor.padding;

        this._init();
    }

    getCaptionHeight() {
        let captions = this.el.find('caption');
        return this.caption ? captions.get(0).offsetHeight * captions.length : 0;
    }

    getWidth() {
        return this.el.width();
    }

    getHeight() {
        return this.el.height();
    }

    getTop() {
        return this.el.offset().top;
    }

    _init() {
        this._bindEvent();
    }

    _bindEvent() {
        let that = this;
        let temp = null;
        let dir = undefined;
        let cursor = {};
        let currentLine = undefined;
        let selectstart = null;
        let startdrag = false;
        let createLine = function() {
            if (!dir) return;
            startdrag = true;
            let record;
            that.editor.selection.clear();
            currentLine = that.editor.doc.createElement('div');
            currentLine.onselectable = "on";
            currentLine.contenteditable = "false";
            currentLine.onresizestart = "return false;";
            currentLine.ondragstart = "return false;";
            currentLine.onselectstart = "return false;";
            switch (dir) {
                case 'v':
                    currentLine.className = 'v line';
                    currentLine.style.height = that.getHeight() - that.getCaptionHeight() + 'px';
                    currentLine.style.left = (record = (cursor.first ? cursor.left : cursor.right)) + 'px';
                    currentLine.style.top = that.getTop() + that.getCaptionHeight() + 'px';
                    that.editor.doc.body.appendChild(currentLine);
                    break;
                case 'h':
                    currentLine.className = 'h line';
                    currentLine.style.width = that.getWidth() + 'px';
                    currentLine.style.top = (record = (cursor.first ? cursor.top : cursor.bottom)) + 'px';
                    that.editor.doc.body.appendChild(currentLine);
                    break;
                default:
                    break;
            }
            afterMouseBindEvent(record);
            lineBind();
        }
        let clearLine = function(record) {
            lineUnbind();
            let real = ~~currentLine.style[dir == 'v' ? 'left' : 'top'].replace('px', '')
            let distance = real - record;
            that._render(cursor.grid, distance, dir);
            that.editor.doc.body.removeChild(currentLine);
            currentLine = undefined;
            startdrag = false;
            that.editor.doc.onselectstart = selectstart;
            dir = undefined;
            $(that.editor.doc).trigger(`mousemove.tableMouseMoveListener${ that.uid }`)
        }
        let lineBind = function() {
            let firstload = true;
            $(that.editor.doc).on(`mousemove.tableLineMouseMoveListener${ that.uid }`, function(e) {
                if (!firstload) {
                    let offset = dir == 'v' ? e.pageX || (e.clientX + that.editor.doc.body.scrollLeft) : e.pageY || (e.clientY + that.editor.doc.body.scrollTop),
                        distance = offset;
                    if (cursor.min[dir] > offset)
                        distance = cursor.min[dir];
                    if (cursor.max[dir] < offset)
                        distance = cursor.max[dir];
                    currentLine.style[dir == 'v' ? 'left' : 'top'] = distance + 'px';
                } else firstload = false;
            })
        };
        let lineUnbind = function() {
            $(that.editor.doc).off(`mousemove.tableLineMouseMoveListener${ that.uid }`);
        };
        let afterMouseBindEvent = function(record) {
            $(that.editor.doc).one(`mouseup.tableLineMouseUpListener${ that.uid }`, function(e) {
                clearLine(record);
            });
        };
        $(this.editor.doc).on(`mousemove.tableMouseMoveListener${ this.uid }`, `table.${ table_mark }[uid=${ this.uid }] td, table.${ table_mark }[uid=${ this.uid }] caption`, function(e) {
                if (startdrag) return;
                let $this = $(this),
                    $row = $this.closest('tr'),
                    offset = $this.offset(),
                    top = cursor.top = ~~(offset.top),
                    bottom = cursor.bottom = ~~(top + this.offsetHeight),
                    left = cursor.left = ~~(offset.left),
                    right = cursor.right = ~~(left + this.offsetWidth),
                    ey = e.pageY || (e.clientY + that.doc.body.scrollTop),
                    ex = e.pageX || (e.clientX + that.doc.body.scrollLeft);

                dir = this.nodeName !== 'TD' ? undefined :
                    (((cursor.first = (left - 1 < ex && left + 5 > ex)) || !(cursor.first = !(right - 5 < ex && right > ex))) ? 'v' :
                        ((cursor.first = (top - 1 < ey && top + 5 > ey)) || !(cursor.first = !(bottom - 5 < ey && bottom > ey)) ? 'h' : undefined));
                if (this.nodeName === 'TD' && dir) {
                    let cell = ~~$this.attr('cell');
                    let row = ~~$row.attr('row');
                    cursor.grid = {
                        row: cursor.first && row != 0 ? row - 1 : row,
                        cell: cursor.first && cell != 0 ? cell - 1 : cell
                    };
                    if ((row == 0 && dir == 'h' || cell == 0 && dir == 'v') && cursor.first || (row == that.row - 1 && dir == 'h' || cell === that.cell - 1 && dir == 'v') && !cursor.first) {
                        //这里还要处理第一列或者第一行，不能移动边界
                        if ((row == 0 && dir == 'h' || cell == 0 && dir == 'v') && cursor.first) {
                            cursor.min = {
                                'v': that.editor.padding,
                                'h': that.editor.padding
                            }
                            cursor.max = {
                                'v': that.editor.padding,
                                'h': that.editor.padding
                            }
                        } else {
                            cursor.min = {
                                'v': left + table_td_lrpadding + 1,
                                'h': top
                            }
                            cursor.max = {
                                'v': that.editor.width - that.editor.padding - 1,
                                'h': 99999
                            }
                        }

                    } else {
                        let fellow;
                        if (cursor.first) {
                            fellow = dir == 'h' ? $row.prev().find('td').eq(cell).get(0) : $this.prev().get(0);
                            cursor.min = {
                                'v': left - fellow.offsetWidth + table_td_lrpadding + 1,
                                'h': top - fellow.offsetHeight + table_td_tbpadding + 1
                            }
                            cursor.max = {
                                'v': right - table_td_lrpadding - 1,
                                'h': 999999 //bottom - table_td_tbpadding - 1
                            }
                        } else {
                            fellow = dir == 'h' ? $row.next().find('td').eq(cell).get(0) : $this.next().get(0);
                            cursor.min = {
                                'v': left + table_td_lrpadding + 1,
                                'h': top + table_td_tbpadding + 1
                            }
                            cursor.max = {
                                'v': right + fellow.offsetWidth - table_td_lrpadding - 1,
                                'h': 999999 //bottom + fellow.offsetHeight - table_td_tbpadding - 1
                            }
                        }
                    }
                }

                that.editor.doc.body.style.cursor = (dir == "h" ? "row-resize" : (dir == 'v' ? 'col-resize' : "text"));
            })
            .on(`mousedown.tableMouseDown${ this. uid }`, `table.${ table_mark }[uid=${ this.uid }]`, function(e) {
                if (!startdrag && dir && e.which == 1) {
                    selectstart = that.editor.doc.onselectstart;
                    that.editor.doc.onselectstart = new Function("return false;");
                    createLine();
                }
            })
            .on(`mouseout.tableMouseOut${ this.uid }`, function() {
                that.editor.doc.body.style.cursor = 'text';
            })
    }

    _render({ row, cell }, distance, dir) {
        let el = this.el,
            w, h, $tr, $td, changeOne = true,
            changeTwo = true,
            arrfnOne = [],
            arrfnTwo = [],
            createFn = function(t, attr, d) {
                return function() {
                    t.attr(attr, d);
                }
            },
            callFn = function(...args) {
                let arr = args.reduce((previous, current) => previous.concat(current));
                arr.forEach(fn => fn());
            }
        if (dir == 'v') {
            w = ~~el.find(`tr:eq(${ row }) td:eq(${ cell })`).attr('width');
            el.find('tr').each(function() {
                $td = $(this).find(`td:eq(${ cell })`);
                w = ~~$td.attr('width');
                changeOne = changeOne && w + distance >= 0;
                arrfnOne.push(createFn($td, 'width', w + distance >= 0 ? w + distance : 0));
            });
            if (cell < this.cell - 1) {
                el.find('tr').each(function() {
                    $td = $(this).find(`td:eq(${ cell + 1 })`);
                    w = ~~$td.attr('width');
                    changeTwo = changeTwo && w - distance >= 0;
                    arrfnTwo.push(createFn($td, 'width', w - distance >= 0 ? w - distance : 0));
                })
            }
            if (changeOne && changeTwo) {
                callFn(arrfnOne, arrfnTwo)
            }
        } else if (dir == 'h') {
            $tr = el.find(`tr:eq(${ row })`);
            h = ~~$tr.find(`td:not([rowspan])`).attr('height');
            $tr.find('td').each(function() {
                $td = $(this);
                $td.attr('height', h + distance >= rowheight ? h + distance : rowheight)
            })
        }
    }

    static getInstance(uid) {
        return Editor.plugins.table.instances[uid];
    }

    get el() {
        return $(this.editor.doc).find(`table.${ table_mark }[uid=${ this.uid }]`);
    }

    get html() {
        var arr = [];
        var cellwidth = Math.floor((this.width - this.cell * table_td_lrpadding - (this.cell + 1)) / this.cell);
        var rowheight = 18
        arr.push(`<table class='${ table_mark }' uid='${ this.uid }'>`);
        for (var i = 0; i < this.row; i++) {
            arr.push(`<tr row = '${ i }'>`);
            for (var j = 0; j < this.cell; j++) {
                arr.push(`<td width='${ cellwidth }' height='${ rowheight }' cell = '${ j }'>${ lowie ? fillChar : br }</td>`);
            }
            arr.push(`</tr>`);
        }
        arr.push(`</table>`);

        return arr.join('')
    }

    /**
     * 
     * 添加标题
     * 
     * @memberOf Table
     */
    addCaption() {
        if (this.caption) return;
        var caption = this.editor.doc.createElement('caption');
        this.el.prepend(caption);
        this.editor.selection.select(caption);
        this.caption = true;
    }

    /**
     * 
     * 删除标题
     * 
     * @memberOf Table
     */
    removeCaption() {
        if (!this.caption) return;
        this.el.find('caption').remove();
        this.caption = false;
    }

    /**
     * 
     * 获取可合并状态
     * 
     * @memberOf Table
     * @return {number} -1:都不;0:向右;1:向下;
     */
    mergeState() {
        var td = this.editor.selection.anchorNode;
        if (!td || td.nodeName !== 'TD') return -1;
        var cell = td.getAttribute('cell');
        var row = td.parentElement.getAttribute('row');
    }

    /**
     * 
     * 向右合并
     * 
     * @memberOf Table
     */
    merge2right() {

    }

    /**
     * 
     * 向下合并
     * 
     * @memberOf Table
     */
    merge2bottom() {

    }

    /**
     * 
     * 拆分单元格
     * 
     * @memberOf Table
     */
    splitCell() {

    }

    /**
     * 
     * 删除行
     * 
     * @memberOf Table
     */
    delRow() {}

    /**
     * 
     * 删除列
     * 
     * @memberOf Table
     */
    delCell() {}

    destroy() {
        this.el.remove();
        this.editor.fireEvent('selectionchange');
        $(this.editor.doc).off('mousemove.tableMouseMoveListener' + this.uid);
    }
}