import { Mask } from './ui/control/mask.jsx';
let layer = new Mask({ text: 'HeroControls Loading ...' }).initialize();
export default {
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