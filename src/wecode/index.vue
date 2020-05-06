<template>
  <div></div>
</template>
<script>
import util from "@/libs/util.js";
export default {
  created() {
    this.getItme();
  },
  methods: {
    //根据当前访问切换pc和mobile
    getItme() {
      let _this = this;
      _this.$loading.show();
      util.locals.clearLocalStorage();
      if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
        //移动端
        // debugger;
        // let urls = window.location.origin;
        global.SERVER_HEADER = {};
        global.SERVER_HEADER["X-HW-ID"] = "com.huawei.energy.fusioncharge.mqs";
        global.SERVER_HEADER["X-HW-APPKEY"] = "aGNuZHpid0QhN2pOaDNxMw==";
        let params = {};
        params.carrier = "phone";
        params.jobNumber = _this.$options.methods.getQureyUrl("jobNumber");
        params.phone = _this.$options.methods.getQureyUrl("phone");
        // params.jobNumber = "zhoulei@5b33c44d716";
        // params.phone = "18971569616";
        util
          .request(global.API_PREFIX + "/api/v1/user/weCodeLogin", params)
          .then(res => {
            // debugger;
            // console.log("res:", res);
            _this.$loading.hide();
            if (res.data.code == 0) {
              util.locals.clearLocalStorage();
              util.locals.set("token", res.data.data.token);
              global.SERVER_HEADER = {};
              global.SERVER_HEADER["AccessToken"] = util.locals.get("token");
              global.SERVER_HEADER["X-HW-ID"] =
                "com.huawei.energy.fusioncharge.mqs";
              global.SERVER_HEADER["X-HW-APPKEY"] = "aGNuZHpid0QhN2pOaDNxMw==";
              util.locals.set("isMobile", "mobile");
              util.locals.set("appUserId", res.data.data.appUserId);
              _this.$router.push("weHome");
            } else {
              let str = "";
              res.data.code == 999
                ? (str = "服务器内部失败")
                : (str = "登录失败请重试");
              _this.$alert(str);
            }
            return false;
          })
          .catch(err => {
            _this.$loading.hide();
            util.handleError(err);
            return false;
          });
      } else {
        // console.log("pc");
        _this.$loading.hide();
        util.locals.set("isMobile", "pc");
        // _this.$router.push("login");
      }
    },
    //获取url参数
    getQureyUrl(variable) {
      // debugger;
      var after = window.location.search;
      after =
        decodeURIComponent(after.substr(1)) ||
        decodeURIComponent(window.location.hash.split("?")[1]);
      var vars = after.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
          return pair[1];
        }
      }
      return false;
    }
  }
};
</script>
