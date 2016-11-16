import Class from './../../core';
import { Base } from './Base';
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
    },
    elrender(h) {
        return (
            <div id={ this.uid.toString() }>
            { this.render.call(this, h, this.data) }
            </div>
        )
    },
    render(h, data) {
        return null;
    },
    update() {
        if (this.isInitialize) {
            var newTree = this.elrender.call(this, h, this.data);
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
        this.tree = this.elrender.call(this, h, this.data);
        this.el = create(this.tree);
        this.active(this.el);
        this.isInitialize = true;
        return this;
    }
})