import axios from "axios";
let Q = require("q");

let util = {
    //工程标题
    title(title) {
        const _title = title ? title + ' - ' : '';
        window.document.title = _title;
    },

    //请求后台
    request(url, data) {
        // debugger;
        let _data = data || {};
        return axios({
            method: "post",
            url: url,
            headers: global.SERVER_HEADER,
            data: _data
        });
    },
    //请求后台流文件
    requestfile(url, data) {
        let _data = data || {};
        return axios({
            method: "post",
            url: url,
            // responseType: "arraybuffer",
            headers: global.SERVER_HEADER,
            data: _data
        });
    },
    downLoadFile(params, url, method) {
        if (Object.keys(params).length === 0) {
            // console.log('params为必选参数');
            return false;
        }
        let form = util.createElement('form');
        for (let key in params) {
            let input = util.createElement('input');
            input["type"] = "hidden";
            input['name'] = key;
            input['value'] = params[key];
            form.appendChild(input);
        }
        ///隐藏域            
        // <input type="hidden" name="_header" value="${licence }"/>
        let input1 = util.createElement("input");
        input1["type"] = "hidden";
        input1["name"] = "Authorization";
        input1["value"] = global.SERVER_HEADER.Authorization;
        form.appendChild(input1);
        ////
        document.body.appendChild(form);
        form['method'] = method;
        form['action'] = url;
        // form['header'] = global.SERVER_HEADER;
        form.submit();
    },
    createElement(ele) {
        return document.createElement(ele);
    },
    //get请求
    requestget(url, params) {
        let _params = params || {};
        return axios({
            url: url,
            method: "get",
            // responseType: "arraybuffer",
            params: _params,
            headers: global.SERVER_HEADER,
        });
    },
    //get请求
    requestgetfile(url, params) {
        let _params = params || {};
        return axios({
            url: url,
            method: "get",
            responseType: "arraybuffer",
            params: _params,
            headers: global.SERVER_HEADER,
        });
    },
    //时间戳格式化
    dateformatter(time) {
        if (!time) {
            return time;
        }
        let time2 = time - 0;
        let date = new Date(time2);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
        let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
        let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
        return Y + M + D + h + m + s;
    },
    //本地方法
    locals: {
        //存储单个属性
        set: function (key, value) {
            if (typeof value !== "undefined") {
                window.localStorage[key] = value;
            }
        },

        //读取单个属性
        get: function (key, defaultValue) {
            return window.localStorage[key] || defaultValue;
        },

        //存储对象，以JSON格式存储
        setObject: function (key, value) {
            if (typeof value !== "undefined") {
                window.localStorage[key] = JSON.stringify(value);
            }
        },

        //读取对象
        getObject: function (key) {
            return window.localStorage[key] ? JSON.parse(window.localStorage[key]) : null;
        },

        //删除某一键值对
        removeItem: function (key) {
            return window.localStorage.removeItem(key);
        },
        //清空整个localStorage
        clearLocalStorage: function () {
            return window.localStorage.clear();
        }
    },

    //其他方法
    methods: {
        //判断path是否为单页面
        isSinglePage(path) {
            let singlePageList = [
                "/secure/iforget",
                "/secure/active_account",
                "/login"
            ];
            return singlePageList.indexOf(path) !== -1;
        },

        //判断[变量]是否存在于[数组]
        oneOf(value, validList) {
            for (let i = 0; i < validList.length; i++) {
                if (value === validList[i]) {
                    return true;
                }
            }
            return false;
        },

        //[字符串]转对象
        jsonParse(str) {
            return (!str || str === "") ? {} : JSON.parse(str);
        },

        //[对象]属性的值去空格
        trimObj(obj) {
            let param = obj;
            for (const key in param) {
                if (typeof param[key] === "string") {
                    param[key] = param[key].trim();
                }
            }
            return param;
        },

        //超时后运行 fn2
        verifyTictoc(fn1, fn2) {
            let verifySec = 120;
            let interval = setInterval(() => {
                verifySec = verifySec - 1;
                if (verifySec <= 0) {
                    verifySec = 120;
                    clearInterval(interval);
                    fn2(verifySec);
                } else {
                    fn1(verifySec);
                }
            }, 1000);
            return interval;
        },

        //从页码组件同步到对象
        copyObj(targetObj, originalObj) {
            for (let key in originalObj) {
                if (targetObj.hasOwnProperty(key) && originalObj.hasOwnProperty(key)) {
                    targetObj[key] = originalObj[key];
                }
            }
        },

        //将个位数变为'0' + 个位数
        handleTheUnit(num) {
            if (typeof (num) === 'number' && num.toString().length === 1) {
                return `0${num}`;
            } else {
                return num;
            }
        },

        //获取interval年前的日期
        getPreviousYears(interval = 1) {
            const currentStamp = new Date();
            const CURRENT_YEAR = currentStamp.getFullYear();
            const CURRENT_MONTH = currentStamp.getMonth() + 1;
            const CURRENT_DAY = currentStamp.getDate();

            //判断当前年份
            const PREVIOUS_YEAR = CURRENT_YEAR - interval;
            const PREVIOUS_DATE = `${PREVIOUS_YEAR}/${CURRENT_MONTH}/${CURRENT_DAY}`;

            const PREVIOUS = new Date(PREVIOUS_DATE);
            const PREVIOUS_STAMP = PREVIOUS.getTime();

            return PREVIOUS_STAMP;
        },

        /**
         * 获取某日期interval天前的 日期
         * 
         * @param {Date} date 日期
         * @param {Number} interval 间隔 默认14天
         * @param {String} separator 分隔符 默认为'-'
         * @return {Date} xxxx-xx-xx
         */
        getPreviousDays(date, interval = 1, separator = '-') {

            const intervalTimeStamp = interval * 24 * 3600 * 1000;

            const current = (date instanceof Date) ? date : new Date(date.replace(/-/g, '/'));
            const currentTimeStamp = current.getTime();

            //timeStamp: current - interval = previous
            const previousTimeStamp = new Date(currentTimeStamp - intervalTimeStamp);

            //transform format
            const YEAR = previousTimeStamp.getFullYear();
            let MONTH = previousTimeStamp.getMonth() + 1;
            MONTH = util.methods.handleTheUnit(MONTH);
            let DAY = previousTimeStamp.getDate();
            DAY = util.methods.handleTheUnit(DAY);

            const previous = `${YEAR}${separator}${MONTH}${separator}${DAY}`;
            return previous;
        },

        //初始化日期 (14天前日期, 当前日期)
        initialDate(interval = 1) {
            const DATE = new Date();
            const separator = '-';

            const YEAR = DATE.getFullYear();
            let MONTH = DATE.getMonth() + 1;
            MONTH = util.methods.handleTheUnit(MONTH);
            let DAY = DATE.getDate();
            DAY = util.methods.handleTheUnit(DAY);

            const currentDate = `${YEAR}${separator}${MONTH}${separator}${DAY}`;

            const previousDate = util.methods.getPreviousDays(currentDate, interval, separator);

            return [previousDate, currentDate];
        },

        //返回0-max的随机整数
        getRandomInteger(max) {
            if (Number.isInteger(max)) {
                return Math.floor(Math.random() * max);
            } else {
                throw new Error('getRandomInteger 函数参数应为整数');
            }

        },

        //获取操作结果 (大于0成功 String number)
        getResult(code) {
            let myCode = code;
            if (code === undefined || code === '' || code === null) {
                return '';
            }

            if (typeof (code) === 'string') {
                myCode = parseInt(code, 10);
            }
            return myCode > 0 ? '成功' : '失败';
        },
        hasUserAths(code) {
            if (util.locals.get("USER_AUTHS")) {
                let obj = JSON.parse(util.locals.get("USER_AUTHS"));
                if (obj[code] && obj[code]) {
                    return true;
                } else {
                    return false;
                }
            }

        },
    },

    //校验方法
    valid: {
        // 非空校验
        required: (_this, item, itemName, itemType) => {
            let checkFlag = true;

            //校验失败 提示信息
            let promptMsg = () => {
                checkFlag = false;
                _this.$message(itemName + '不能为空');
            };

            switch (itemType) {
                case 'num':
                    if (isNaN(item)) {
                        promptMsg();
                    }
                    break;
                default:
                    //string
                    if (item.toString().trim() === "") {
                        promptMsg();
                    }
            }
            return checkFlag;
        },

        password(value) {
            let result = {
                msg: "",
                ok: true
            };
            const isSafe = function (val) {
                const hasNum = /\d/.test(val);
                const hasUpCase = /[A-Z]/.test(val);
                const hasLowCase = /[a-z]/.test(val);
                const hasSpecChar = /[\~\!\@\#\$\%\^\&\*\(\)_\+\`\-\{\}\|\:\"\<\>\?\[\]\;\'\,\.\/\=\\\s]/.test(val);
                let count = 0;
                count = count + (hasNum ? 1 : 0);
                // count = count + (hasUpCase ? 1 : 0);
                count = count + ((hasUpCase || hasLowCase) ? 1 : 0);
                count = count + (hasSpecChar ? 1 : 0);
                return count >= 3;
            };
            if (value.length < 8) {
                result.msg = "密码长度过低（至少8位，且必须包含字母数字特殊符号）";
                result.ok = false;
            } else if (value.length > 20) {
                result.msg = "密码长度过长（至少8位，且必须包含字母数字特殊符号）";
                result.ok = false;
            } else if (!isSafe(value)) {
                result.msg = "密码安全性低（至少8位，且必须包含字母数字特殊符号）";
                result.ok = false;
            } else if (/[\u4e00-\u9fa5\uFF00-\uFFFF]/.test(value)) {
                result.msg = "不能包含中文或全角字符";
                result.ok = false;
                // }
            } else if (/^[\s]|[ ]$/gi.test(value)) {
                result.msg = "首尾不能含有空格";
                result.ok = false;
            }
            return result;
        },

        phone(value) {
            let result = {
                msg: "",
                ok: true
            };
            if (!/^1[0-9]{10}$/.test(value)) {
                result.ok = false;
                result.msg = "输入手机号错误";
            }
            return result;
        },

        email(value) {
            const reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/g;
            let result = {
                msg: "",
                ok: true
            };
            if (!reg.test(value)) {
                result.ok = false;
                result.msg = "输入邮箱错误";
            }
            return result;
        },

        chinese(value) {
            let result = {
                msg: "",
                ok: true
            };
            if (/[^\u4e00-\u9fa5\uFF00-\uFFFF\u00B7]/g.test(value)) {
                result.ok = false;
                result.msg = "请输入中文或”·“符号";
            }
            return result;
        },
        //要验证的字符串是否含有用户名
        isContainUserName(value, username) {
            if (value) {
                return (value.toString()).indexOf(username);
            }
        }
    },

    //需要调用接口的方法
    api: {
        checkPasswordTimeout() {
            return new Promise((resolve, reject) => {
                util.request(global.API_PREFIX + '/menu/remindPassExpired'
                    , {}
                ).then((res) => {
                    resolve(res);
                }).catch((e) => {
                    util.handleError(e);
                    reject(e);
                });
            });
        },

        sendVerifyCode(phone) {
            let defer = Q.defer();
            util.request(global.API_PREFIX + '/activeAccount/SendVaildNum'
                , { phone: phone }
            ).then((res) => {
                defer.resolve(res);
            }).catch((e) => {
                util.handleError(e);
                defer.reject(e);
            });
            return defer.promise;
        },

        checkVerifyCode(phone, verify) {
            let defer = Q.defer();
            util.request(global.API_PREFIX + '/activeAccount/ValidateAccountPhone'
                , { phone: phone, VerifCode: verify }
            ).then((res) => {
                defer.resolve(res);
            }).catch((e) => {
                util.handleError(e);
                defer.reject(e);
            });
            return defer.promise;
        },

        uploadFile(file) {
            let defer = Q.defer();
            util.request(global.API_PREFIX + '/activeAccount/uploadHead'
                , { file: file }
            ).then((res) => {
                defer.resolve(res);
            }).catch((e) => {
                util.handleError(e);
                defer.reject(e);
            });
            return defer.promise;
        },
        //退出页面
        logout(that) {
            //获取用户名
            let account = util.locals.get("account");
            util.request(global.API_PREFIX + "/logout/" + account).then(
                res => {
                    if (res.data.success) {
                        // util.locals.clearLocalStorage();
                        window.localStorage.clear();
                        // window.location.href = "/#/login";
                        window.setTimeout(function () {
                            // location.href = "#/login"; 
                            that.$router.push("/login");
                            if (that) {
                                that.$router.push("/login");
                            } else {
                                location.href = "#/login";
                            }
                        }, 10);
                    }
                }
            ).catch(
                err => {
                    util.handleError(err);
                }
            );
        },

    },

    handleError(error) {
        if (window.custLog) {
            window.custLog(error);
        }
    },

    isMatchUrl(urlList, url) {
        for (const index in urlList) {
            const tmpUrl = urlList[index];
            if (tmpUrl === url) {
                return true;
            } else if (new RegExp(tmpUrl).test(url)) {
                return true;
            }
        }
        return false;
    }

};

export default util;
