<template>
  <div class="qr">
    <!-- <p class="error">{{ error }}</p> -->
    <!--错误信息-->

    <!-- <p class="decode-result">
      扫描结果:
      <b>{{ result }}</b>
    </p>-->
    <!--扫描结果-->

    <qrcode-stream @decode="onDecode" @init="onInit" />
    <!-- <qrcode-dropZone /> -->
    <!-- <qrcode-capture /> -->
  </div>
</template>

<script>
//下载插件
//cnpm install --save  vue-qrcode-reader
import util from "../../libs/util";

//引入
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from "vue-qrcode-reader";

export default {
  //注册
  components: { QrcodeStream, QrcodeDropZone, QrcodeCapture },

  data() {
    return {
      result: "", //扫码结果信息
      error: "" //错误信息
    };
  },
  // created() {
  //   var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
  //   alert(userAgent);
  // },
  methods: {
    onDecode(result) {
      // alert(result);
      let _this = this;
      // this.result = result;
      if (_this.error) {
        _this.$alert(_this.error).then(() => {
          _this.$router.push({
            path: "/weHome"
          });
        });
      }
      let qrcode = result;
      let params = {
        qrCode: qrcode
      };
      util
        .request(global.API_PREFIX + "/api/v1/charging/scan", params)
        .then(res => {
          console.log("gunRes:", res);
          // debugger;
          if (res.data.code == 0 && res.data.data) {
            // debugger;
            util.locals.set("qrcode", _this.inputValue);
            util.locals.setObject("scanData", res.data.data);
            // _this.checkGun(res.data.data.chargingPileId);
            _this.$router.push({
              path: "/ChargeInfo"
            });
          } else {
            if (res.data.msg) {
              _this.$alert(res.data.msg);
            }
          }
        });
    },

    async onInit(promise) {
      // debugger;
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.error = "ERROR: 您需要授予相机访问权限";
        } else if (error.name === "NotFoundError") {
          this.error = "ERROR: 这个设备上没有摄像头";
        } else if (error.name === "NotSupportedError") {
          this.error = "ERROR: 所需的安全上下文(HTTPS、本地主机)";
        } else if (error.name === "NotReadableError") {
          this.error = "ERROR: 相机被占用";
        } else if (error.name === "OverconstrainedError") {
          this.error = "ERROR: 安装摄像头不合适";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERROR: 此浏览器不支持流API";
        }
      }
    },
    // checkGun(chargingPileId) {
    //   let _this = this;
    //   let params = {
    //     chargingPileId: chargingPileId
    //   };
    //   util
    //     .request(global.API_PREFIX + "/api/v1/charging/check", params)
    //     .then(res => {
    //       console.log("gunRes:", res);
    //       // debugger;

    //       if (res.data.code == 0) {
    //         _this.$router.push({
    //           path: "/ChargeInfo"
    //         });
    //       } else {
    //         if (res.data.msg) {
    //           _this.$alert(res.data.msg);
    //         }
    //       }
    //     })
    //     .catch(err => {
    //       _this.$alert(err.message);
    //       util.handleError(err);
    //     });
    // }
  }
};
</script>

<style scoped>
.error {
  font-weight: bold;
  color: red;
}
.qr {
  height: 100vh;
}
</style>