/**
 * Author:Herui/Administrator;
 * CreateDate:2016/2/16
 *
 * Describe:
 */

var fs=require('fs');
var mine=require('./ctype').types;
var querystring=require('querystring');

exports.responseFile=function(realPath,response,pathname,ext){
    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {
                    var contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
};

exports.responseData=function(response,pathname,query,form){
    var paths=pathname.split("/");
    try {
        if(paths.length>3) throw new Error("URL Error !");
        if(paths.length<3) paths.push("index");
        paths[0]==''?paths.shift():null;
        var controller = require("./../Controller/" + paths[0]);
        var action=paths.pop();
        if(!controller[action]) controller[action]=function(){ return this.render.view();}
        controller.controller=paths.join("/");
        controller.action=action;
        controller.querystring=querystring.parse(query);
        controller.form=querystring.parse(form);
        var content = controller[action](controller.querystring,controller.form);
        response.writeHead(200, {'Content-Type': content.type});
        response.write(content.data);
        response.end();
    }
    catch(e)
    {
        response.writeHead(500, {'Content-Type': 'text/plain'});
        response.write(e.code|| e.message);
        response.end();
    }
}