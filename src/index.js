import './shim';
import { Mask } from './ui/control/mask.jsx';
import { Dialog } from './ui/control/dialog.jsx';
let layer = new Mask().initialize();
var instance = new Dialog().initialize();
export default {
    win: instance,
    ready(fn) {
        window.onload = fn;
    },
    showlayer(data) {
        layer.show(data);
    },
    hidelayer() {
        layer.hide();
    }
}