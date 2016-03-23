/**
 * Author:Herui;
 * CreateDate:2016-01-26
 *
 * Describe: comSysFrame core libary
*/


define(
    function () {
        window.ClassLibray={
            Classes:{},
            _callParent:function ()
            {
                return arguments.callee.caller && arguments.callee.caller.fn ? arguments.callee.caller.fn.apply(this, arguments) : null;
            },
            _isDontEnum:function(){
                for(var key in {constructor:1}) if(key=="constructor") return false;
                return true;
            },
            _extend:function(b,e,isRecursion){
                b = b||{};
                for (var k in e) {
                    var current=e[k];
                    if (current instanceof Function) {
                        var fn;
                        if (b[k] instanceof Function)
                            fn = b[k];
                        b[k] = current;
                        if (fn) b[k].fn = fn;
                    }else if(current instanceof Array || current instanceof HTMLElement)
                        b[k]=current;
                    else if(current instanceof Object)
                    {
                        if(!b[k]) b[k]={}
                        arguments.callee(b[k],e[k],true)
                    }
                }
                if(!isRecursion&&ClassLibray._isDontEnum()&& b.constructor) {
                    var constructor = b.constructor;
                    b.constructor = e.constructor;
                    b.constructor.fn = constructor;
                }
            },
            Class:function(sub, method, sup, area){
                sup=sup || Object;

                area = area || ClassLibray.Classes;
                var name;
                var space = sub.split('.');
                space.reverse();
                sub = space.shift();
                while ((name = space.pop()) != null) {
                    if (!area[name]) area[name] = {};
                    area = area[name];
                }

                var subclassProto = Object.create(sup.prototype);
                ClassLibray._extend(subclassProto, method);

                sub = area[sub] = subclassProto.constructor;
                sub.prototype = subclassProto;
                sub.prototype.constructor = sub;
                sub.prototype.callParent = ClassLibray._callParent;

                return sub;
            }
        }

        return ClassLibray.Class;
    })