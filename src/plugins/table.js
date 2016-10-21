import $ from 'jquery';
import Table, { table_mark } from './table.core';

Editor.plugins.table = function() {
    var editor = this;
    this.on('selectionchange', function() {
        var state = this.queryCommandState('tableState');
        addButton.disabled = state == 1;
        deleteButton.disabled = state == -1;
    })
    Editor.plugins.contextmenu.instance.on('itemclick', function(type, instance, cmd, e) {
        if (instance[cmd]) instance[cmd]();
        return false;
    })
    this.on('contextmenu', function(type, e) {
        this.fireEvent('selectionchange');
        if (this.queryCommandState('tableState') == 1) {
            let source = $(this.selection.anchorNode).closest('table.' + table_mark);
            let uid = source.attr('uid');
            let instance = Table.getInstance(uid);
            var mergeState = instance.mergeState();
            this.execCommand('contextmenushow', instance, this.frameLeft + e.clientX, this.frameTop + e.clientY, [
                mergeState == -1 ? null : {
                    text: '单元格',
                    cls: 'icon-table-cell',
                    items: [
                        { text: '向左合并', cls: 'icon-merge2right', command: 'merge2right' },
                        { text: '向下合并', cls: 'icon-merge2bottom', command: 'merge2bottom' },
                        '-',
                        { text: '拆分', command: 'splitCell' }
                    ]
                },
                '-',
                instance.caption ? { text: '删除标题', cls: 'icon-del-caption', command: 'removeCaption' } : { text: '添加标题', cls: 'icon-add-caption', command: 'addCaption' },
                '-',
                {
                    text: '行',
                    items: [
                        { text: '添加行', command: 'addRow' },
                        { text: '删除行', command: 'delRow' }
                    ]
                },
                {
                    text: '列',
                    items: [
                        { text: '添加列', command: 'addCell' },
                        { text: '删除列', command: 'delCell' }
                    ]
                },
                '-',
                { text: '删除表格', cls: 'icon-del-table', command: 'destroy' }
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
            this.execCommand('insertHtml', new Table(this, 2, 2).html)
        }
    }



    this.commands.removeTable = {
        execCommand() {
            Table.getInstance($(this.selection.anchorNode).closest('.' + table_mark).attr('uid')).destroy()
        }
    }
}
Editor.plugins.table.instances = {};