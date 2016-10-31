import Selector from './Selector';
export function query(selector) {
    return new Selector(selector);
}