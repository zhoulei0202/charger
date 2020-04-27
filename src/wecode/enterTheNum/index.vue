<template>
  <div class="app">
    <div class="main">
      <input
        autofocus="autofocus"
        v-model="inputValue"
        class="num"
        type="text"
        placeholder="请输入电枪编号"
      />
      <el-button @click="goto" class="button" type="primary" round>确定</el-button>
    </div>
  </div>
</template>

<script>
import util from "../../libs/util";

export default {
  data() {
    return {
      title: "输入电枪编号",
      inputValue: "",
      clientHeight: ""
    };
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      document.title = this.title;
      this.clientHeight = document.body.clientHeight;
    },
    checkGun(chargingPileId) {
      let _this = this;
      let params = {
        chargingPileId: chargingPileId
      };
      util
        .request(global.API_PREFIX + "/api/v1/charging/check", params)
        .then(res => {
          console.log("gunRes:", res);
          // debugger;

          if (res.data.code == 0) {
            _this.$router.push({
              path: "/ChargeInfo"
            });
          } else {
            if (res.data.msg) {
              _this.$alert(res.data.msg);
            }
          }
        })
        .catch(err => {
          _this.$alert(err.message);
          util.handleError(err);
        });
    },
    goto() {
      let _this = this;
      let params = {
        qrCode: _this.inputValue
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
            _this.checkGun(res.data.data.chargingPileId);
          } else {
            if (res.data.msg) {
              _this.$alert(res.data.msg);
            }
          }
        })
        .catch(err => {
          _this.$alert(err.message);
          util.handleError(err);
        });
    }
  }
};
</script>
<style scoped>
.app {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  background: url(./images/bg.png) no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
  filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='./images/bg.png',sizingMethod='scale');
}
.button {
  margin: 0 auto;
  margin-top: 0.5rem;
  width: 6.67rem;
  height: 0.78rem;
}

.num {
  width: 6.67rem;
  height: 0.78rem;
  padding-left: 0.3rem;
  border-radius: 0.39rem;
  margin: 0 auto;
  font-size: 0.28rem;
  border: 0.01rem solid #fff;
  outline: none;
  user-select: none;
  resize: none;
  box-sizing: border-box;
}
.main {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto;
}
</style>
