import $ from 'jquery';
import Editor from './config';
export function load(editor) {
    let init;
    for (var cmd in Editor.plugins) {
        init = Editor.plugins[cmd];
        init.call(editor, cmd);
    }
}
export default class Plugin {
    constructor(editor) {
        this.editor = editor;
    }

    register(pluginName, init) {
        init.call(this.editor, pluginName);
    }

}