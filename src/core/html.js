export default function BaseHtml(uid) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>htmleditor</title>
        <link rel="stylesheet" href="dist/style/core.css">
        <style>
            html,
            body {
                margin: 0px;
            }
            html{
                height: 100%;
                box-sizing: border-box;
                padding: 5px;
            }
        </style>
        <script>
            window.onload = function(){
                setTimeout(function() {
                    var editor = window.parent.Editor.instances["instance${ uid }"];
                    editor.setup(window, document);
                });
            }
        </script>
    </head>
    <body>
        
    </body>
    </html>
    `
}