import Class from './../../core';
import { Base } from './Base';
import { Promise } from './promise';
import h from 'virtual-dom/h';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import create from 'virtual-dom/create-element';

export const ElBase = Class('ui.core.ElBase', {
    base: Base,
    constructor(data) {
        this.callParent(data);
        this.tree = null;
        this.rootNode = null;
        this.isInitialize = false;
        new Promise().promise(this);
    },
    render(h) {
        return (
            <div uid={ this.uid.toString() }>
            { this.template.call(this, h, this.data, this) }
            </div>
        )
    },
    template(h, data, scope) {
        return null;
    },
    update() {
        if (this.isInitialize) {
            var newTree = this.render.call(this, h, this.data, this);
            var patches = diff(this.tree, newTree);
            var rootNode = patch(this.el, patches);
            this.tree = newTree;
            this.el = rootNode;
        }
    },
    active(el) {
        return document.body.appendChild(el);
    },
    initialize() {
        if (this.isInitialize) return this;
        this.tree = this.render.call(this, h, this.data, this);
        this.el = create(this.tree);
        this.active(this.el);
        this.isInitialize = true;
        return this;
    }
})