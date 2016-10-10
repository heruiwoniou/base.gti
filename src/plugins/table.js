import { ie } from './../core/browser';
import $ from 'jquery';

let table_uid = 0;

function CreateVessel(number) {
    let arr = [];
    while (number-- >= 0)
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
    }

    get html() {
        var arr = [];
        arr.push(`<table class='sheet' uid='${ this.uid }'>`);
        for (var i = 0; i < this.row.length; i++) {
            arr.push(`<tr row = '${ i }'>`);
            for (var j = 0; j < this.cell.length; j++) {
                arr.push(`<td row = '${ j }'><br></td>`);
            }
            arr.push(`</tr>`);
        }
        arr.push(`</table>`);
        return arr.join('')
    }

    destroy() {
        $(this.editor.doc).find(`table.sheet[uid=${ this.uid }]`).remove();
    }
}

Editor.plugins.table = function() {
    this.on('selectionchange', function() {
        addButton.disabled = this.queryCommandState('tableState') == 1;
        deleteButton.disabled = this.queryCommandState('tableState') == -1;
        this.execCommand('contextmenuhide')
    })
    Editor.plugins.contextmenu.instance.on('itemclick', function() {

    })
    this.on('contextmenu', function(type, e) {
        this.fireEvent('selectionchange');
        if (this.queryCommandState('tableState') == 1) {
            this.execCommand('contextmenushow', this.frameLeft + e.clientX, this.frameTop + e.clientY, [
                { text: '添加行' },
                { text: '删除行' },
                '-',
                { text: '添加列' },
                { text: '删除列' }
            ]);
            return false;
        }
    })

    this.commands.tableState = {
        queryCommandState() {
            return $(this.selection.Selection.anchorNode).closest('table.sheet').length == 0 ? -1 : 1;
        }
    }

    this.commands.addTable = {
        execCommand() {
            this.execCommand('insertHtml', new Table(this, 3, 5).html)
        }
    }

    this.commands.removeTable = {
        execCommand() {
            Editor.plugins.table.instances[$(this.selection.Selection.anchorNode).closest('.sheet').attr('uid')].destroy();
            this.fireEvent('selectionchange');
        }
    }
}
Editor.plugins.table.instances = {};