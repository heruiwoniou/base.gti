import './shim';
import { Mask } from './ui/control/mask.jsx';
import { Dialog } from './ui/control/dialog.jsx';
let layer = new Mask({ text: 'HeroControls Loading ...' }).initialize();
var instance = new Dialog().initialize();
export default {
    dialog(setting) {
        var a = instance.show(setting);
        a.then(function() {
            debugger;
        })
    },
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