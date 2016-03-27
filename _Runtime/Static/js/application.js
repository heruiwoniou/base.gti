/**
 * Created by Administrator on 2016/3/17.
 */
define(function(){
    return {
        init:function(){

            var json_string="{a:1}";
            var reg=/(\s*?{\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9]+)('")?:/g;
            json_string=json_string.replace(reg,'$1"$3":');
            console.log(json_string);
        }
    }
})