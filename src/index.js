import {
    ElBase,
    query
} from './ui';


var b = new ElBase(document.createElement('div'), { a: 1, b: 1 });
query('body span').hide();
export default {};