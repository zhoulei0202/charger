<template>
  <div class="mainBody">
    <!-- 电桩信息 -->
    <div class="app">
      <div class="main">
        <div class="headBox">
          <div class="titleBg"></div>
          <div class="polingTitle">电桩信息</div>
        </div>
        <div>
          <div class="title">{{chargingPileName}}</div>
          <div class="title1">电桩编号：{{runCode}}</div>
          <div class="title2">
            充电费:
            <span class="title3">{{fee}}</span>
            元/度
            <!-- <span class="question"></span>  -->
          </div>
          <div class="title2">
            服务费:
            <span class="title3">{{serviceFee}}</span>元/度
          </div>
        </div>
      </div>
      <!-- 充电枪 循环生成 -->
      <div class="ChargingBox" v-for="(item,index) in gunData" :key="index">
        <div>
          <span class="ChargingIcon"></span>
          充电枪{{item.gunNumber}}
          <span
            :class="item.gunStatus==1?'idle':'idleErr'"
          >{{gunStatus(item.gunStatus)}}</span>
        </div>
        <div
          @click="checkGun(item.gunId,item.gunCode,item.chargingMode,item.gunStatus)"
          class="outer"
        >
          <span v-bind:class="item.gunId == gunId ? 'innerCheck' : 'inner'"></span>
        </div>
        <!-- </div>
        -->
        <!-- <div class="ChargingBox">
        <div>
          <span class="ChargingIcon"></span>充电枪A
          <span class="idle">空闲</span>
        </div>
        <div class="outer">
          <span class="innerCheck"></span>
        </div>
      </div>
      <div class="ChargingBox">
        <div>
          <span class="ChargingIconRes"></span>充电枪C
          <span class="idleRes">预约</span>
        </div>
        <div class="outerNull">
          <span class="inner"></span>
        </div>
      </div>
      <div class="ChargingBox">
        <div>
          <span class="ChargingIconErr"></span>充电枪D
          <span class="idleErr">故障</span>
        </div>
        <div class="outerNull">
          <span class="inner"></span>
        </div>-->
      </div>
    </div>
    <!-- 充电方式选择 -->
    <div class="SelectBox">
      <div class="selsectTitle">充电方式</div>
      <div class="selectMain">
        <div v-for="(items,value) in chargingMethod" :key="value" class="selectMainBox">
          <span
            @click="checked(items.value)"
            v-bind:class="checkValueMethod==items.value ?items.checkValue: items.value"
          ></span>
          {{items.name}}
        </div>
      </div>
    </div>
    <!-- 充电量选择 -->
    <div v-show="checkValueMethod!='full'" class="SelectBox">
      <div class="selsectTitle">{{chargingTitle}}</div>
      <input v-model="feeValue" class="input" />
      <span style="dispaly:inline">{{unit}}</span>
    </div>
    <!-- 开始按钮 -->
    <div @click="testPile" class="button">开始充电</div>
  </div>
</template>

<script>
import util from "../../libs/util.js";

export default {
  data() {
    return {
      title: "充电详情",
      checkValueMethod: "power",
      chargingTitle: "请输入充电度数",
      chargingMethod: [
        { name: "按电量", value: "power", checkValue: "powerHigh" },
        { name: "按金额", value: "amount", checkValue: "amountHigh" },
        { name: "按时间", value: "time", checkValue: "timeHigh" },
        { name: "充满", value: "full", checkValue: "fullHigh" }
      ],
      chargeData: {},
      gunData: [],
      gunId: "",
      serviceFee: "", //服务费用
      stationName: "", //充电桩名称
      address: "",
      chargingPileName: "",
      fee: "", //电费,
      runCode: "",
      chargingPileId: "",
      virtualId: "",
      gunCode: "",
      feeValue: "",
      controlInfo: "1",
      dHeight: "",
      unit: "kw·h"
    };
  },

  mounted() {
    this.init();
  },
  methods: {
    checked(value) {
      this.checkValueMethod = value;
      switch (value) {
        case "power":
          this.chargingTitle = "请输入充电度数";
          this.unit = "kw·h";
          this.controlInfo = 1;
          break;
        case "amount":
          this.chargingTitle = "请输入充电金额";
          this.unit = "元";

          this.controlInfo = 3;

          break;
        case "time":
          this.chargingTitle = "请输入充电时间";
          this.unit = "分钟";
          this.controlInfo = 2;

          break;
        case "full":
          this.chargingTitle = "";
          this.controlInfo = 4;

        default:
          return null;
      }
    },
    checkGun(gunId, gunCode, chargingMode, gunStatus) {
      if (gunStatus == 1 || gunStatus == 2) {
        this.gunId = gunId;
        this.gunCode = gunCode;
        this.chargingMode = chargingMode;
      }
    },
    init(value) {
      document.title = this.title;
      this.dHeight = document.body.clientHeight;
      // let chargeData = JSON.parse(this.$route.query.data);
      // debugger;
      let chargeData = util.locals.getObject("scanData");
      this.serviceFee = chargeData.serviceFee ? chargeData.serviceFee : "0.001";
      this.fee = chargeData.fee ? chargeData.fee : "0.001";
      this.chargingPileName = chargeData.chargingPileName;
      this.runCode = chargeData.runCode;
      this.chargingPileId = chargeData.chargingPileId;
      this.virtualId = chargeData.virtualId;
      this.gunData = chargeData.chargingGunReservePojos;
      this.stationName = chargeData.stationName;
    },
    isInteger(num) {
      if (!isNaN(num) && num % 1 === 0) {
        return true;
      } else {
        return false;
      }
    },
    start() {
      let _this = this;

      let appUserId = util.locals.get("appUserId");
      util.locals.set("chargingPileId", _this.chargingPileId);
      if (!_this.isInteger(_this.feeValue)) {
        _this.$alert("请输入整数");
        return false;
      }
      //        {
      //   "chargingPileId": 1,//充电桩ID
      //   "chargingPileName": "充电桩测试",//充电桩名称
      //   "virtualId": "000001",//虚拟ID
      //   "appUserId": 1,//APP用户ID appUserId
      //   "gunCode": "1",//枪编码
      //   "controlInfo": "1",//控制信息1:电量控制充电2:时间控制充电3:金额控制充电4:充满为止5:定时启动充电
      //   "controlData": "320",//控制数据 精度整数
      //  }
      // debugger;
      _this.$loading.show();
      let params = {
        chargingMode: this.chargingMode, //充电类型
        chargingPileId: this.chargingPileId,
        chargingPileName: this.chargingPileName,
        virtualId: this.virtualId,
        appUserId: appUserId,
        gunCode: this.gunCode,
        controlInfo: this.controlInfo,
        controlData: this.controlInfo != 4 ? this.feeValue : 0
      };
      util
        .request(global.API_PREFIX + "/api/v1/charging/start", params)
        .then(res => {
          // console.log("res:", res);
          _this.$loading.hide();
          if (res.data.code == 0) {
            _this.$router.push({
              path: "/ChargingProcess",
              query: {
                gunCode: _this.gunCode,
                virtualId: _this.virtualId,
                chargingPileName: _this.chargingPileName,
                stationName: _this.stationName
              }
            });
          } else {
            if (res.data.msg) {
              _this.$alert("请检查充电枪与车辆的连接");
            }
          }
        })
        .catch(err => {
          _this.$loading.hide();

          util.handleError(err);
        });
    },
    gunStatus(value) {
      switch (value) {
        case 1:
          return "空闲";
        case 2:
          return "使用中(插枪未充电)";
        case 3:
          return "使用中(已充电)";
        case 4:
          return "预约中";
        case 5:
          return "停止服务";
        case 6:
          return "故障";
        default:
          "故障";
      }
    },
    testPile() {
      let _this = this;
      let params = {
        chargingPileId: _this.chargingPileId
      };
      util
        .request(global.API_PREFIX + "/api/v1/charging/check", params)
        .then(res => {
          console.log("gunRes:", res);
          // debugger;
          if (res.data.code == 0) {
            _this.start();
          } else {
            if (res.data.msg) {
              // _this.$alert(res.data.msg);
              let options = {
                title: "提示",
                content: res.data.msg,
                yesText: "排队充电",
                noText: "取消"
              };
              _this.$confirm(options).then(() => {
                _this.handUp();
              });
            }
          }
        })
        .catch(err => {
          _this.$alert(err.message);
          util.handleError(err);
        });
    },
    handUp() {
      let _this = this;
      //       {
      //     "chargingPileId": 1000055,
      //     "chargingPileName": "桩5（交直流可用）",
      //     "virtualId": "0310e1",
      //     "appUserId": 16544,
      //     "gunCode": "1",
      //     "chargingMode": "1",
      //     "controlInfo": "1",
      //     "controlData": "320"
      // }
      let appUserId = util.locals.get("appUserId");
      let params = {
        chargingMode: this.chargingMode, //充电类型
        chargingPileId: this.chargingPileId,
        chargingPileName: this.chargingPileName,
        virtualId: this.virtualId,
        appUserId: appUserId,
        gunCode: this.gunCode,
        controlInfo: this.controlInfo,
        controlData: this.controlInfo != 4 ? this.feeValue : 0
      };
      util
        .request(global.API_PREFIX + "/api/v1/charging/handUp", params)
        .then(res => {
          console.log("gunRes:", res);
          // debugger;
          if (res.data.code == 0) {
            _this.$alert("挂起成功");
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
.mainBody {
  background: #eaeaea;
  padding: 0.35rem 0.28rem;
  overflow: auto;
  height: 100vh;
}
html {
  background: #f6f5f8;
}
.app {
  background: #fefdff;
  border-radius: 0.14rem;
}
.main {
  display: flex;
}
.headBox {
  width: 1.76rem;
}
.titleBg {
  width: 0.9rem;
  height: 0.9rem;
  background: url(./images/pile.png) center;
  background-size: 100%;
  margin: 0.4rem 0.42rem 0.13rem 0.42rem;
}
.polingTitle {
  font-size: 0.21rem;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  text-align: center;
}

.title {
  margin-top: 0.15rem;
  height: 0.5rem;
  line-height: 0.5rem;
  font-size: 0.28rem;
  font-family: Source Han Sans CN;
  font-weight: blod;
  color: #404040;
}
.title1 {
  font-weight: 400;
  height: 0.44rem;
  line-height: 0.44rem;
  font-size: 0.24rem;
  font-family: Source Han Sans CN;
  color: #999999;
}
.title2 {
  font-weight: 400;
  height: 0.44rem;
  line-height: 0.44rem;
  font-size: 0.24rem;
  font-family: Source Han Sans CN;
  color: #666666;
}
.title3 {
  font-weight: 400;
  padding: 0 0.08rem;
  line-height: 0.44rem;
  font-size: 0.24rem;
  color: #ff6e2e;
}
.ChargingBox {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid rgba(128, 128, 128, 0.2);
  margin: 0 0.21rem;
  height: 0.92rem;
  line-height: 0.92rem;
  padding: 0 0.42rem;
  font-size: 0.25rem;
  color: #404040;
  font-weight: 400;
}
.ChargingIcon {
  width: 0.11rem;
  height: 0.11rem;
  display: inline-block;
  background: rgba(71, 132, 249, 1);
  border-radius: 50%;
  margin-right: 0.19rem;
}
.ChargingIconRes {
  width: 0.11rem;
  height: 0.11rem;
  display: inline-block;
  background: #e15b27;
  border-radius: 50%;
  margin-right: 0.19rem;
}
.ChargingIconErr {
  width: 0.11rem;
  height: 0.11rem;
  display: inline-block;
  background: #ff1800;
  border-radius: 50%;
  margin-right: 0.19rem;
}
.idle {
  display: inline-block;
  font-size: 0.19rem;
  font-weight: 400;
  color: rgba(71, 132, 249, 1);
  height: 0.29rem;
  line-height: 0.29rem;
  border: 0.01rem solid rgba(71, 132, 249, 1);
  border-radius: 0.07rem;
  text-align: center;
  margin-left: 0.08rem;
}
.idleRes {
  display: inline-block;
  font-size: 0.19rem;
  font-weight: 400;
  color: #e15b27;
  height: 0.29rem;
  line-height: 0.29rem;
  border: 0.01rem solid #e15b27;
  border-radius: 0.07rem;
  text-align: center;
  margin-left: 0.08rem;
}
.idleErr {
  display: inline-block;
  font-size: 0.19rem;
  font-weight: 400;
  color: #ff1800;
  height: 0.29rem;
  line-height: 0.29rem;
  border: 0.01rem solid #ff1800;
  border-radius: 0.07rem;
  text-align: center;
  margin-left: 0.08rem;
}
.outer {
  width: 0.36rem;
  height: 0.36rem;
  border: 0.01rem solid rgba(71, 132, 249, 1);
  border-radius: 50%;
  text-align: center;
  margin: auto 0;
}
.outerNull {
  width: 0.36rem;
  height: 0.36rem;
  border: 0.01rem solid #ccc;
  border-radius: 50%;
  text-align: center;
  margin: auto 0;
}
.innerCheck {
  display: block;
  width: 0.24rem;
  height: 0.24rem;
  background: rgba(71, 132, 249, 1);
  border-radius: 50%;
  position: relative;
  left: 15%;
  top: 15%;
}
.inner {
  display: block;
  width: 0.24rem;
  height: 0.24rem;
  background: rgb(239, 241, 245);
  border-radius: 50%;
  position: relative;
  left: 15%;
  top: 15%;
}
.SelectBox {
  padding: 0.21rem;
  background: #fefdff;
  border-radius: 0.14rem;
  margin: 0.35rem 0rem;
  box-sizing: border-box;
}
.selsectTitle {
  font-size: 0.28rem;
  font-weight: 500;
  color: #404040;
  margin-left: 0.08rem;
  padding: 0.28rem;
  border-bottom: 0.01rem solid rgba(128, 128, 128, 0.5);
}
.selectMain {
  display: flex;
  justify-content: space-between;
  margin: 0.33rem 0.35rem;
}

.selectMainBox {
  display: flex;
  flex-direction: column;
  width: 20%;
  text-align: center;
  font-size: 0.24rem;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
}
.power {
  display: block;
  height: 0.56rem;
  width: 0.56rem;
  margin: 0.19rem auto;
  background: url(./images/power.png) center;
  background-size: 100%;
}
.powerHigh {
  display: block;
  height: 0.56rem;
  width: 0.56rem;
  margin: 0.19rem auto;
  background: url(./images/powerHigh.png) center;
  background-size: 100%;
}
.amount {
  display: block;
  height: 0.56rem;
  width: 0.56rem;
  margin: 0.19rem auto;
  background: url(./images/amount.png) center;
  background-size: 100%;
}
.amountHigh {
  display: block;
  height: 0.56rem;
  width: 0.56rem;
  margin: 0.19rem auto;
  background: url(./images/amountHigh.png) center;
  background-size: 100%;
}
.time {
  display: block;
  height: 0.56rem;
  width: 0.56rem;
  margin: 0.19rem auto;
  background: url(./images/time.png) center;
  background-size: 100%;
}
.timeHigh {
  display: block;
  height: 0.56rem;
  width: 0.56rem;
  margin: 0.19rem auto;
  background: url(./images/timeHigh.png) center;
  background-size: 100%;
}
.full {
  display: block;
  height: 0.56rem;
  width: 0.56rem;
  margin: 0.19rem auto;
  background: url(./images/full.png) center;
  background-size: 100%;
}
.fullHigh {
  display: block;
  height: 0.56rem;
  width: 0.56rem;
  margin: 0.19rem auto;
  background: url(./images/fullHigh.png) center;
  background-size: 100%;
}
.input {
  width: 2.1rem;
  display: inline-block;
  height: 0.5rem;
  border: 1px solid transparent;
  border-bottom-color: #808080;
  margin: 0.42rem 0 0.42rem 2rem;
  -webkit-user-select: text !important;
  -webkit-appearance: none;
}
.button {
  width: 6.67rem;
  height: 0.78rem;
  line-height: 0.78rem;
  background: linear-gradient(
    -90deg,
    rgba(54, 105, 248, 1),
    rgba(77, 142, 250, 1)
  );
  border-radius: 0.39rem;
  margin: 0.42rem auto;
  font-size: 0.28rem;
  color: #fff;
  text-align: center;
}
</style>
