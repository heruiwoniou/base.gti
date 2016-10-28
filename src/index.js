import {
    ElBase
} from './ui';

var div = document.createElement('div');
var instance = new ElBase(div, { a: 1, b: 2 });

export default instance;