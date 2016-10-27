import Class from './core/class';
Class('Widgets.base', {
    constructor() {
        this.a = 1;
        this.b = 2;
    }
})
export default Class('Widgets.bar', {
    base: 'Widgets.base',
    constructor() {
        this.callParent();
        this.c = 3;
        this.d = 4;
    }
})