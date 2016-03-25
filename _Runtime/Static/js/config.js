/**
 * Created by Administrator on 2016/3/17.
 */
require.config({
    urlArgs: "bust=" +  (new Date()).getTime(),
    baseUrl: "Static/js",
    map:{
        '*': {
            'css': 'libs/require-css/css.min'
        }
    },
    paths: {
        "jquery": "libs/jquery/dist/jquery.min",
        "Class":"common/core/Class",
        "system":"../../Content"
    }
});

require(["jquery","application"],function($,application){
    application.init();
})
