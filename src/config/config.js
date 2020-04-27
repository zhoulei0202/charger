import Env from './env';
import util from '@/libs/util.js';

// global.API_PREFIX = 'https://49.4.15.243:8088/charger';
global.API_PREFIX = '/charger';

if (util.locals.get("token") && util.locals.get("token") !== '') {
    if (util.locals.get("isMobile") == 'mobile') {
        global.SERVER_HEADER = {};
        global.SERVER_HEADER["AccessToken"] = util.locals.get("token");
        global.SERVER_HEADER["X-HW-ID"] = "com.huawei.energy.fusioncharge.mqs";
        global.SERVER_HEADER["X-HW-APPKEY"] = "aGNuZHpid0QhN2pOaDNxMw==";
    } else {
        global.SERVER_HEADER = {};
        global.SERVER_HEADER["Authorization"] = "Bearer" + " " + util.locals.get("token");

    }
}
window.logout = function () {
    let account = util.locals.get("account");
    const token = {};
    token["token"] = util.locals.get("token");
    global.SERVER_HEADER["token"] = util.locals.get("token");
    util.request(global.API_PREFIX + '/logout/' + account, token).then((response) => {
        if (response.data.success) {
            util.removeItem("token");
            window.location.href = "/#/login";
            if (!!window.ActiveXObject || "ActiveXObject" in window) {
                window.location.reload();
            }
        }
    }).catch((e) => {
        util.handleError(e);
        window.location.href = "/#/login";
    });
};

let config = {
    env: Env
};
export default config;
