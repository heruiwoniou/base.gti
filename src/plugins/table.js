import { ie } from './../core/browser';
import { fillChar } from './../core/const';
import $ from 'jquery';
import './../../bower_components/jquery-ui/jquery-ui';

let table_uid = 0;
let table_mark = 'sheet';
let table_td_tbpadding = 10;
let table_td_lrpadding = 20;
let validDragTime = 200; //毫秒

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
        this.width = this.editor.width;

        this.dir = undefined;
        this.cursor = {};
        this.currentLine = undefined;
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
        let timer = null;
        let temp = null;
        let clearTime = function() {
            that.editor.win.clearTimeout(timer);
            timer = null;
            $(that.editor.doc).off(`mouseup.tableMouseUpListenerDown${ that.uid } mousemove.tableMouseMoveListenerDown${ that.uid }`);
        }
        let createLine = function() {
            var line;
            clearTime();
            if (!that.dir) return;
            switch (that.dir) {
                case 'v':
                    line = that.editor.doc.createElement('div');
                    line.className = 'v line';
                    line.style.height = that.getHeight() + 'px';
                    line.style.left = (that.cursor.first ? that.cursor.left : that.cursor.right) + 'px';
                    line.style.top = that.getTop() + 'px';
                    that.editor.doc.body.appendChild(line);
                    break;
                case 'h':
                    line = that.editor.doc.createElement('div');
                    line.className = 'h line';
                    line.style.width = that.getWidth() + 'px';
                    line.style.top = (that.cursor.first ? that.cursor.top : that.cursor.bottom) + 'px';
                    that.editor.doc.body.appendChild(line);
                    break;
                default:
                    break;
            }
            afterMouseBindEvent();
            that.currentLine = line;
        }
        let clearLine = function() {
            that.editor.doc.body.removeChild(that.currentLine);
            that.currentLine = undefined;
        }
        let beforeMouseBindEvent = function() {
            $(that.editor.doc).on(`mouseup.tableMouseUpListenerDown${ that.uid }`, function(e) {
                clearTime();
            });
            window.setTimeout(function() {
                $(that.editor.doc).on(`mousemove.tableMouseMoveListenerDown${ that.uid }`, function(e) {
                    clearTime();
                })
            }, 100);
        }
        let afterMouseBindEvent = function() {
            $(that.editor.doc).one(`mouseup.tableLineMouseUpListener${ that.uid }`, function(e) {
                clearLine();
            });
        };
        $(this.editor.doc).on(`mousemove.tableMouseMoveListener${ this.uid }`, `table.${ table_mark } td, table.${ table_mark } caption`, function(e) {
                let $this = $(this),
                    offset = $this.offset(),
                    top = that.cursor.top = ~~(offset.top),
                    bottom = that.cursor.bottom = ~~(top + this.offsetHeight),
                    left = that.cursor.left = ~~(offset.left),
                    right = that.cursor.right = ~~(left + this.offsetWidth),
                    ey = e.clientY,
                    ex = e.clientX,
                    dir = that.dir =
                    (((that.cursor.first = (left - 5 < ex && left + 5 > ex)) || !(that.cursor.first = !(right - 5 < ex && right + 5 > ex))) ? 'v' :
                        ((that.cursor.first = (top - 5 < ey && top + 5 > ey)) || !(that.cursor.first = !(bottom - 5 < ey && bottom + 5 > ey)) ? 'h' : undefined));
                that.editor.doc.body.style.cursor = (dir == "h" ? "row-resize" : (dir == 'v' ? 'col-resize' : "text"));
                //console.log(left, right, '|', top, bottom);
            })
            .on(`mousedown.tableMouseDown${ this. uid }`, `table.${ table_mark }`, function() {
                if (timer == null && that.dir) {
                    beforeMouseBindEvent();
                    timer = that.editor.win.setTimeout(createLine, validDragTime);
                }
            })
    }

    static getInstance(uid) {
        return Editor.plugins.table.instances[uid];
    }

    get el() {
        return $(this.editor.doc).find(`table.${ table_mark }[uid=${ this.uid }]`);
    }

    get html() {
        var arr = [];
        var cellwidth = ~~(this.width / this.cell.length);
        arr.push(`<table class='${ table_mark }' uid='${ this.uid }'>`);
        for (var i = 0; i < this.row.length; i++) {
            arr.push(`<tr row = '${ i }'>`);
            for (var j = 0; j < this.cell.length; j++) {
                arr.push(`<td width='${ cellwidth }' cell = '${ j }'>${ fillChar }</td>`);
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