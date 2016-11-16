import { Mask } from './ui/control/mask.jsx';
let layer = new Mask({ text: '正在加载呢!' }).initialize();
export default {
    showlayer(data) {
        layer.show(data);
    },
    hidelayer() {
        layer.hide();
    }
}