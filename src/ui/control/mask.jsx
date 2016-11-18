import Class from '../../core';
import {ElBase} from '../core/ElBase';

import {assign, isObject, isString} from './../../util'

//单例对象
var SingletonInstance = null;
export const Mask = Class('ui.control.Mask', {
    base: ElBase,
    constructor(data) {
        let private_data = {
            level: 0,
            zIndex: 10000
        }
        let default_data = {
            visible: false,
            text: '正在加载...'
        }
        if (SingletonInstance) {
            assign(SingletonInstance.data, data);
            return SingletonInstance
        }
        this.callParent(assign(default_data, private_data, data));
        SingletonInstance = this;
    },
    template(h, data, scope) {
        return (data.visible
            ? <div className="mask" style={{ zIndex:data.zIndex - 2 }}>
                <div className="background" style={{ zIndex:data.zIndex - 1 }}></div>
                <span></span>
                <div className="loading" onselectstart={function(){ return false; }} style={{ zIndex:data.zIndex }}>{ data.text }</div>
            </div>
            : null);
    },
    show(data) {
        this.data.visible = true;
        if (isString(data)) 
            this.data.text = data;
        if (isObject(data)) 
            assign(this.data, data);
        this.update();
    },
    hide() {
        this.data.visible = false;
        this.update();
    }
});