/**
 * Created by Administrator on 2016/3/17.
 */
define([
    'Class'
],function(Class){
    return {
        init:function(){

            var A=Class('A',{
                constructor:function(){
                    alert(1);
                    alert(2);
                    alert(3);
                }
            })

            var a=new A();
        }
    }
})