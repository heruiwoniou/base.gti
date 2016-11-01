import {
    ElBase,
    selector
} from './ui';

new ElBase(document.createElement('div'), { a: 1, b: 1 });
selector('body span').hide();
export default {};