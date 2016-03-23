/**
 * Description:
 * Author:Administrator
 * CreateDateTime:2016/2/4.
 */

var PORT = 3000;

var http = require('http');
var url=require('url');
var path=require('path');
var dispose=require('./Common/dispose');

var server = http.createServer(function (request, response) {
	var uri=url.parse(request.url);
	var pathname = uri.pathname;
	var query=uri.query;
	if (pathname.charAt(pathname.length - 1) == "/") {
		pathname += "index.html";
	}
	var realPath = path.join("_Runtime", pathname);
	var ext = path.extname(realPath);
	ext = ext ? ext.slice(1) : 'unknown';

	switch(request.method.toLocaleLowerCase())
	{
		case "post":
			request.on("data",function(form){
				dispose.responseData(response,pathname,query,form.toString())
			})
			break;
		default :
			ext=='unknown'?dispose.responseData(response,pathname,query):
				dispose.responseFile(realPath,response,pathname,ext);
			break;
	}

});
server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");