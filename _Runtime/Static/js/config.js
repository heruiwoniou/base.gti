/**
 * Created by Administrator on 2016/3/17.
 */
require.config({
    baseUrl: "Static/js",
    map:{
        '*': {
            'css': 'libs/require-css/css.min'
        }
    },
    paths: {
        "jquery": "libs/jquery/dist/jquery.min",

        "Core":"common/core/Core",
        "Class":"common/core/Class"
    },
    deps:[
        "Class"
    ]
});

require(["jquery","application"],function($,application){
    application.init();
})
