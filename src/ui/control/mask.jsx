import { assign, isObject } from './../../util'
import Class from '../../core';
import { ElBase } from '../core/ElBase';
export const Mask = Class('ui.control.Mask', {
    base: ElBase,
    constructor(data) {
        var default_data = {
            visible: true,
            text: '正在加载...'
        }
        this.callParent(assign(default_data, data));
    },
    render(h, data) {
        return (data.visible
            ? <div className="mask">
                <div className="background"></div>
                <span></span>
                <div className="loading">{data.text}</div>
            </div>
            : null);
    },
    show(data) {
        this.data.visible = true;
        if (isObject(data))
            assign(this.data, data);
        this.update();
    },
    hide() {
        this.data.visible = false;
        if (isObject(data))
            assign(this.data, data);
        this.update();
    }
});