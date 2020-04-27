(function(Mock) {
    //菜单
    Mock.mock(
        global.API_PREFIX + "/menu/getMenusList", 
        'post', 
        require("../data/common/menu.json")
    );

    //登录
    Mock.mock(
        global.API_PREFIX + "/security/login", 
        'post', 
        require("../data/common/login.js")["default"]
    );

    //登出
    Mock.mock(
        global.API_PREFIX + "/security/logout", 
        'post', 
        require("../data/common/logout.js")["default"]
    );
    
})(require("mockjs"));
