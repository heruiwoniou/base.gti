/**
 * Author:Herui/Administrator;
 * CreateDate:2016/2/16
 *
 * Describe:
 */

var TPLEngine = require('./tplEngine');
var fs = require("fs");

function Render(controller) {
    this.controller = controller;
}

Render.prototype = {
    constructor: Render,
    json: function (data) {
        return {
            type: 'application/json',
            data: JSON.stringify(data)
        }
    },
    tpl: function (string, data) {
        return {
            type: 'text/html',
            data: TPLEngine.render(string, data)
        }
    },
    view: function () {
        var view,data;
        if(arguments.length==0)
        {
            view=this.controller.action;
            data=this.controller.querystring;
        } else if(arguments.length==1)
        {
            if(typeof arguments[0]=="string")
            {
                view=arguments[0];
                data=this.controller.querystring;
            }
            else
            {
                view=this.controller.action;
                data=arguments[0];
            }
        } else
        {
            view=arguments[0];
            data=arguments[1];
        }
        return this.tpl(base._TPLData.call(this.controller, view), data);
    }
}

var base = {
    _TPLData: function (view) {
        return fs.readFileSync("View/" + this.controller + "/" + (view || this.action) + ".html", "utf-8");
    },
    render: {},
    init: function (controller) {
        controller=controller || {};
        controller.render = new Render(controller);
        return controller;
    }
}

module.exports = base;
