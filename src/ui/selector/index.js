import Selector from './Selector';
import css from './css';
import doc from './doc';
import effect from './effect';
import events from './events';
import filter from './filter';
import property from './property';

/**
 * @description 添加插件
 */
Selector.use(
    css,
    doc,
    effect,
    events,
    filter,
    property
);

/**
 * @description 选择器
 */
export function selector(selector) {
    return new Selector(selector);
}

selector.use = function(...args) {
    Selector.use(...args);
}