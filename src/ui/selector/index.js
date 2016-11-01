import Selector from './Selector';
import css from './css';
import doc from './doc';
import effect from './effect';
import filter from './filter';
import property from './property';

/**
 * @description 添加插件
 */
Selector.use(
    css,
    doc,
    effect,
    filter,
    property
);

/**
 * @description 选择器
 */
export function selector(selector) {
    return new Selector(selector);
}