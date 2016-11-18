import { Mask } from './ui/control/mask.jsx';
import { Dialog } from './ui/control/dialog.jsx';
let layer = new Mask({ text: 'HeroControls Loading ...' }).initialize();
export default {
    dialog(setting) {
        new Dialog(setting).initialize();
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