import Config from './config';

let result = {
    start: function() {}
};

/**
 * 接口请求拦截处理函数
 */
function startMock() {
    require("./mock.common.js");

}

if (Config.env === "development") {
    result = {
        start: startMock
    };
}

export default result;
