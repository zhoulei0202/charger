<template>
  <div class="mainBody">
    <!-- 开始结束 -->
    <el-row>
      <el-col class="titleMain">{{stationName}}</el-col>
    </el-row>

    <div class="progress">
      <!-- <el-progress type="circle" :width="progressWidth" :show-text="false" :percentage="25"></el-progress> -->
      <div class="tip-info">
        <keep-alive>
          <div class="tip-time">{{text}}</div>
        </keep-alive>
        <div>
          <span class="tip-icon"></span>
          <span>充电时长(分)</span>
        </div>
      </div>
    </div>

    <div class="btn-box">
      <div class="outer">
        <div class="back" @click="goHome">返回</div>
      </div>
      <div class="outer1">
        <div @click="stop" class="end">结束</div>
      </div>
    </div>
    <!-- 终端信息 -->
    <div class="app">
      <div class="main">
        <div>
          <div class="titleBg"></div>
          <div class="polingTitle">终端信息</div>
        </div>
        <div>
          <div class="title2">{{chargingPileName}}</div>
          <div class="title1">电桩编号：{{qrcode}}</div>
          <div class="title1">功率：{{power}}KW</div>
          <div class="title1">电流A: {{aa?aa:"--"}}V &nbsp;&nbsp; 电压A：{{av?av:"--"}}A</div>
          <div class="title1">电流B: {{ba?ba:"--"}}V &nbsp;&nbsp; 电压B：{{bv?bv:"--"}}A</div>
          <div class="title1">电流C: {{ca?ca:"--"}}V &nbsp;&nbsp; 电压C：{{cv?cv:"--"}}A</div>
          <div class="title1">
            <span class="icon"></span>
            {{gunCode}}号{{gunType==1?"交流":"直流"}}充电枪
          </div>
          <!-- queryChargingState  power功率-->
        </div>
      </div>
    </div>
    <!-- 车型信息 -->
    <div class="app">
      <div class="main">
        <div>
          <div class="titleBg1"></div>
          <div class="polingTitle">车型信息</div>
        </div>
        <div>
          <div class="title2">暂无车型信息</div>
          <div class="title1">当前电量：{{soc?soc:"--"}}%</div>
          <div class="title1">已充电量：{{kwh}}kwh</div>
        </div>
      </div>
    </div>
    <!-- 支付信息 -->
    <div class="app">
      <div class="main">
        <div>
          <div class="titleBg2"></div>
          <div class="polingTitle">支付信息</div>
        </div>
        <div>
          <div class="title2">
            当前费用：
            <span class="orange">{{count}}</span>元
          </div>
          <div class="title1">
            充电费用：
            <span class="orange">{{money?money:"0.00"}}</span>元
          </div>
          <div class="title1">
            服务费用：
            <span class="orange">{{serviceFee?serviceFee:"0.00"}}</span>元
          </div>
        </div>
      </div>
    </div>
    <div id="hidden-box"></div>
  </div>
</template>

<script>
import util from "../../libs/util.js";

export default {
  data() {
    return {
      title: "充电详情",
      // progressWidth: 250,
      timerNum: 0,
      text: "00:00",
      timer: null,
      chargingPileName: "", //桩点名称
      stationName: "",
      virtualId: "",
      qrcode: "",
      gunCode: "",
      power: "",
      kwh: "", //已充电量
      aa: "",
      av: "",
      ba: "",
      bv: "",
      ca: "",
      cv: "",
      soc: "", //剩余电量
      serviceFee: "", //服务费
      money: "", //费用
      remainingTimeElectricity: "", //剩余充电量
      orderRecordNum: "", //订单编号
      chargingPileId: "",
      gunType: "" //2直流1交流
    };
  },
  computed: {
    count() {
      return (this.serviceFee * 1000 + this.money * 1000) / 1000;
    }
  },
  watch: {
    timerNum(newName, oldName) {
      if (newName == 2) {
        this.getChargingState();
      } else if (
        typeof (newName / 30) === "number" &&
        (newName / 30) % 1 === 0
      ) {
        this.getChargingState();
      }
    }
  },
  mounted() {
    this.init();
    this.getTime();
  },
  methods: {
    init() {
      document.title = this.title;
      // 获取充电信息
      this.gunCode = this.$route.query.gunCode;
      this.virtualId = this.$route.query.virtualId;
      this.chargingPileName = this.$route.query.chargingPileName;
      this.stationName = this.$route.query.stationName;
      this.qrcode = util.locals.get("qrcode");
    },
    getChargingState() {
      // debugger;
      let params = {
        virtualId: this.virtualId,
        gunCode: this.gunCode
      };
      let _this = this;
      util
        .request(
          global.API_PREFIX + "/api/v1/charging/queryChargingState",
          params
        )
        .then(res => {
          console.log("res:", res);

          if (res.data.code == 0) {
            // debugger;
            _this.text = res.data.data.alreadyTime
              ? res.data.data.alreadyTime.substring(0, 5)
              : "00:00";
            _this.kwh = res.data.data.kwh;
            _this.power = res.data.data.power;
            _this.aa = res.data.data.aa;
            _this.av = res.data.data.av;
            _this.ba = res.data.data.ba;
            _this.bv = res.data.data.bv;
            _this.ca = res.data.data.ca;
            _this.cv = res.data.data.cv;
            _this.soc = res.data.data.soc;
            _this.serviceFee = res.data.data.serviceFee;
            _this.money = res.data.data.money;
            _this.remainingTimeElectricity =
              res.data.data.remainingTimeElectricity;
            _this.orderRecordNum = res.data.data.orderRecordNum;
            _this.chargingPileId = res.data.data.chargingPileId;
            _this.gunType = res.data.data.gunType;
            if (res.data.data.isStop == 1) {
              _this.$alert("充电完成").then(() => {
                _this.$router.push({
                  path: "/PaymentPage",
                  query: res.data.data
                });
              });
            }
          }
        })
        .catch(err => {
          util.handleError(err);
        });
    },
    checked(value) {
      this.checkValueMethod = value;
    },
    // getProgressWidth() {
    //   this.progressWidth = document.getElementById("hidden-box").offsetWidth;
    // },
    stop() {
      let _this = this;
      clearInterval(_this.timer);
      _this.timer = null;
      //       {
      //   "chargingPileId": 1,//充电桩ID
      //   "chargingPileName": "充电桩测试",//充电桩名称
      //   "virtualId": "000001",//虚拟ID
      //   "appUserId": 1,//APP用户ID
      //   "gunCode": "1",//枪编号
      //   "stopReason": "1",//停止原因
      //   "orderRecordNum": "1101000166801960"//充电订单单号
      //  }
      let appUserId = util.locals.get("appUserId");
      let params = {
        chargingPileId: _this.chargingPileId
          ? _this.chargingPileId
          : util.locals.get("chargingPileId"),
        chargingPileName: _this.chargingPileName,
        virtualId: _this.virtualId,
        appUserId: appUserId,
        gunCode: _this.gunCode,
        stopReason: "1",
        orderRecordNum: _this.orderRecordNum
      };
      _this.$loading.show();
      util
        .request(global.API_PREFIX + "/api/v1/charging/stop", params)
        .then(res => {
          _this.$loading.hide();

          console.log("res:", res);
          if (res.data.code == 0) {
            _this.$router.push({
              path: "/PaymentPage",
              query: { virtualId: _this.virtualId, gunCode: _this.gunCode }
            });
          } else {
            //结束失败
          }
        })
        .catch(err => {
          _this.$loading.hide();
          util.handleError(err);
        });
    },

    getTime() {
      this.loading(); // 启动定时器
      this.timer = setInterval(() => {
        //创建定时器
        this.loading();
      }, 1000);
    },
    loading() {
      // 启动定时器
      // debugger;
      this.timerNum += 1;
    },
    clearTimer() {
      //清除定时器
      clearInterval(this.timer);
      this.timer = null;
    },
    /**
     * 将秒转换为 分:秒
     * s int 秒数
     */
    s_to_hs(value) {
      var secondTime = parseInt(value); // 秒
      var minuteTime = 0; // 分
      var hourTime = 0; // 小时
      if (secondTime > 60) {
        //如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
          //获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60);
          //获取小时后取佘的分，获取分钟除以60取佘的分
          minuteTime = parseInt(minuteTime % 60);
        }
      }
      var result = "" + parseInt(secondTime) + "秒";

      if (minuteTime > 0) {
        result = "" + parseInt(minuteTime) + "分" + result;
      }
      if (hourTime > 0) {
        result = "" + parseInt(hourTime) + "小时" + result;
      }
      return result;
    },
    hs_to_s(time) {
      debugger;
      let stime = 0;
      let timearr = time.split(":");
      if (timearr[0] > 0) {
        stime += timearr[0] * 3600;
      }
      if (timearr[1] > 0) {
        stime += timearr[1] * 60;
      }
      if (timearr[2] > 0) {
        stime += timearr[2];
      }
      return stime;
    },
    goHome() {
      this.$router.push({
        path: "/weHome"
      });
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  }
};
</script>
<style scoped>
.mainBody {
  background: #f6f5f8;
  overflow: auto;
}
.titleMain {
  font-size: 0.29rem;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  text-align: center;
  margin: 0.41rem auto;
}
.app {
  margin: 0.41rem 0.28rem 0 0.28rem;
  background: #fefdff;
  border-radius: 0.14rem;
}
html {
  background: #f6f5f8;
}
.title {
  font-size: 0.28rem;
  font-weight: 500;
  color: #404040;
  padding: 0.34rem 0.29rem;
}
.main {
  display: flex;
  padding: 0.35rem 0.18rem;
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
  font-weight: 400;
  color: #666666;
  text-align: center;
}

.title2 {
  font-size: 0.28rem;
  font-weight: blod;
  color: #404040;
}
.title1 {
  font-weight: 400;
  height: 0.44rem;
  line-height: 0.44rem;
  font-size: 0.24rem;
  color: #999999;
}
.icon {
  display: inline-block;
  height: 0.11rem;
  width: 0.11rem;
  background: #4784f9;
  border-radius: 50%;
  margin-right: 0.14rem;
}
.titleBg1 {
  width: 0.9rem;
  height: 0.9rem;
  background: url(./images/car.png) center;
  background-size: 100%;
  margin: 0 0.42rem 0.13rem 0.42rem;
}
.titleBg2 {
  width: 0.9rem;
  height: 0.9rem;
  background: url(./images/terminal.png) center;
  background-size: 100%;
  margin: 0 0.42rem 0.13rem 0.42rem;
}
.orange {
  color: #ff6e2e;
}

.btn-box {
  display: flex;
  justify-content: space-between;
  padding: 0 0.75rem;
}
.back {
  font-size: 0.25rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  width: 0.86rem;
  height: 0.86rem;
  line-height: 0.86rem;
  background: rgba(161, 172, 195, 1);
  border-radius: 50%;
  text-align: center;
  box-sizing: border-box;
}
.outer {
  width: 0.98rem;
  height: 0.98rem;
  border: 0.03rem solid #a1acc3;
  border-radius: 50%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
.end {
  font-size: 0.25rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  width: 0.86rem;
  height: 0.86rem;
  line-height: 0.86rem;
  background: rgba(71, 132, 249, 1);
  border-radius: 50%;
  text-align: center;
  box-sizing: border-box;
}
.outer1 {
  width: 0.98rem;
  height: 0.98rem;
  border: 0.03rem solid rgba(71, 132, 249, 1);
  border-radius: 50%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
.progress {
  display: flex;
  justify-content: center;
}
.tip-info {
  width: 5rem;
  height: 2.5rem;
  text-align: center;
}
.tip-time {
  font-size: 1.25rem;
  font-family: Roboto;
  font-weight: 300;
  color: rgba(71, 132, 249, 1);
}
.tip-text {
  font-size: 0.24rem;
  font-weight: 400;
  color: rgba(128, 128, 128, 1);
}
.tip-icon {
  display: inline-block;
  width: 0.29rem;
  height: 0.29rem;
  background: url(./images/timeicon.png) no-repeat center;
  background-size: 100%;
  position: relative;
  top: 0.07rem;
}
#hidden-box {
  width: 5rem;
  display: hidden;
}
</style>
