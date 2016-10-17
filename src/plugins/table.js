import { ie, lowie } from './../core/browser';
import { fillChar } from './../core/const';
import $ from 'jquery';
import './../../bower_components/jquery-ui/jquery-ui';

let table_uid = 0;
let table_mark = 'sheet';
let table_td_tbpadding = 10;
let table_td_lrpadding = 20;
let validDragTime = 100; //毫秒
let br = '<br>';

function CreateVessel(number) {
    let arr = [];
    while (--number >= 0)
        arr.push({
            index: number,
            merge: 0
        });
    return arr;
}

class Table {
    constructor(editor, row, cell) {
        this.uid = table_uid++;
        this.row = CreateVessel(row);
        this.cell = CreateVessel(cell);
        this.editor = editor;
        Editor.plugins.table.instances[this.uid] = this;
        this.caption = false;
        this.width = this.editor.width - 2 * this.editor.padding;
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
                    (((cursor.first = (left - 5 < ex && left + 5 > ex)) || !(cursor.first = !(right - 5 < ex && right + 5 > ex))) ? 'v' :
                        ((cursor.first = (top - 5 < ey && top + 5 > ey)) || !(cursor.first = !(bottom - 5 < ey && bottom + 5 > ey)) ? 'h' : undefined));

                if (this.nodeName === 'TD' && dir) {
                    let cell = ~~$this.attr('cell');
                    let row = ~~$row.attr('row');
                    cursor.grid = {
                        row: cursor.first && row != 0 ? row - 1 : row,
                        cell: cursor.first && cell != 0 ? cell - 1 : cell
                    };
                    if ((row == 0 && dir == 'h' || cell == 0 && dir == 'v') && cursor.first || (row == that.row.length - 1 && dir == 'h' || cell === that.cell.length - 1 && dir == 'v') && !cursor.first) {
                        //这里还要处理第一列或者第一行，不能移动边界
                        cursor.min = {
                            'v': left,
                            'h': top
                        }
                        cursor.max = {
                            'v': right - table_td_lrpadding,
                            'h': bottom - table_td_tbpadding
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
                                'h': bottom - table_td_tbpadding - 1
                            }
                        } else {
                            fellow = dir == 'h' ? $row.next().find('td').eq(cell).get(0) : $this.next().get(0);
                            cursor.min = {
                                'v': left + table_td_lrpadding + 1,
                                'h': top + table_td_tbpadding + 1
                            }
                            cursor.max = {
                                'v': right + fellow.offsetWidth - table_td_lrpadding - 1,
                                'h': bottom + fellow.offsetHeight - table_td_tbpadding - 1
                            }
                        }
                    }
                }

                that.editor.doc.body.style.cursor = (dir == "h" ? "row-resize" : (dir == 'v' ? 'col-resize' : "text"));
            })
            .on(`mousedown.tableMouseDown${ this. uid }`, `table.${ table_mark }[uid=${ this.uid }]`, function() {
                if (!startdrag && dir) {
                    selectstart = that.editor.doc.onselectstart;
                    that.editor.doc.onselectstart = new Function("return false;");
                    createLine();
                }
            })
    }

    _render({ row, cell }, distance, dir) {
        console.log(row, cell, distance, dir)
        let el = this.el,
            w, $tr, $td, changeOne = true,
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
            if (cell < this.cell.length - 1) {
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
        var cellwidth = Math.floor((this.width - this.cell.length * table_td_lrpadding - (this.cell.length + 1)) / this.cell.length);
        arr.push(`<table class='${ table_mark }' uid='${ this.uid }'>`);
        for (var i = 0; i < this.row.length; i++) {
            arr.push(`<tr row = '${ i }'>`);
            for (var j = 0; j < this.cell.length; j++) {
                arr.push(`<td width='${ cellwidth }' cell = '${ j }'>${ lowie ? fillChar : br }</td>`);
            }
            arr.push(`</tr>`);
        }
        arr.push(`</table>`);

        this._init();

        return arr.join('')
    }

    addCaption() {
        if (this.caption) return;
        var caption = this.editor.doc.createElement('caption');
        this.el.prepend(caption);
        this.editor.selection.select(caption);
        this.caption = true;
    }

    removeCaption() {
        if (!this.caption) return;
        let sc = this.editor.selection;
        this.el.find('caption').remove();
        this.caption = false;
    }
    destroy() {
        this.el.remove();
        this.editor.fireEvent('selectionchange');
        $(this.editor.doc).off('mousemove.tableMouseMoveListener' + this.uid);
    }
}

Editor.plugins.table = function() {
    var editor = this;
    this.on('selectionchange', function() {
        addButton.disabled = this.queryCommandState('tableState') == 1;
        deleteButton.disabled = this.queryCommandState('tableState') == -1;
        this.execCommand('contextmenuhide')
    })
    Editor.plugins.contextmenu.instance.on('itemclick', function(type, instance, cmd, e) {
        instance[cmd]();
        return false;
    })
    this.on('contextmenu', function(type, e) {
        this.fireEvent('selectionchange');
        if (this.queryCommandState('tableState') == 1) {
            let source = $(this.selection.anchorNode).closest('table.' + table_mark);
            let uid = source.attr('uid');
            let instance = Table.getInstance(uid);
            this.execCommand('contextmenushow', instance, this.frameLeft + e.clientX, this.frameTop + e.clientY, [
                instance.caption ? { text: '删除标题', command: 'removeCaption' } : { text: '添加标题', command: 'addCaption' },
                '-',
                '-',
                { text: '删除表格', command: 'destroy' }
            ]);
            return false;
        }
    })

    this.commands.tableState = {
        queryCommandState() {
            return $(this.selection.anchorNode).closest('table.' + table_mark).length == 0 ? -1 : 1;
        }
    }

    this.commands.addTable = {
        execCommand() {
            this.execCommand('insertHtml', new Table(this, 3, 5).html)
        }
    }

    this.commands.removeTable = {
        execCommand() {
            Table.getInstance($(this.selection.anchorNode).closest('.' + table_mark).attr('uid')).destroy()
        }
    }
}
Editor.plugins.table.instances = {};