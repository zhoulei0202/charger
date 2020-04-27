<template>
  <div class="main">
    <div class="app">
      <div class="payTitle">费用详细</div>
      <div class="payMain">
        <div class="payBox">
          <div>充电量</div>
          <div>
            <span class="black">{{payInfo.chargePowerAmountStr}}</span>
          </div>
        </div>
        <div class="payBox">
          <div>充电费用</div>
          <div>
            <span class="black">{{payInfo.eneryCharge||"0.00"}}</span>元
          </div>
        </div>
        <div class="payBox">
          <div>服务费</div>
          <div>
            <span class="black">{{payInfo.serviceCharge||"0.00"}}</span>元
          </div>
        </div>
        <div class="payBox">
          <div>充电时长</div>
          <div>
            <span class="black">{{payInfo.chargTime}}</span>
          </div>
        </div>
      </div>
      <div class="tatal">
        <div class="payBox">
          <div>合计</div>
          <div>
            <span class="orange">{{payInfo.consumeTotalMoney}}</span>元
          </div>
        </div>
      </div>
    </div>

    <!-- 支付方式选择 -->

    <div class="app app1">
      <div class="payTitle">支付方式</div>
      <div class="tatal">
        <div class="payBox">
          <div class="payFont">
            <span class="aliPay"></span>支付宝
          </div>
          <div @click="checked(1)" class="outer">
            <span v-bind:class="checkType==1 ? 'inner' : 'innerOff'"></span>
          </div>
        </div>
        <div class="payBox">
          <div class="payFont">
            <span class="weiXin"></span>微信
          </div>
          <div @click="checked(2)" class="outer">
            <span v-bind:class="checkType==2 ? 'inner' : 'innerOff'"></span>
          </div>
        </div>
      </div>
    </div>
    <!-- 按钮 -->
    <div class="button" @click="pay">确认支付</div>
  </div>
</template>

<script>
import util from "../../libs/util.js";

export default {
  data() {
    return {
      checkType: 1,
      payInfo: {},
      remainingTimeElectricity: "",
      orderRecordNum: "",
      totalFee: "",
      form: {},
      isStop: -1
    };
  },

  mounted() {
    this.getItme();
  },
  methods: {
    getItme() {
      document.title = "支付";
      let _this = this;
      // debugger;
      if (
        //正常点结束
        _this.$route.query.virtualId &&
        _this.$route.query.gunCode &&
        _this.$route.query.isStop == undefined &&
        _this.$route.query.payStatus == undefined
      ) {
        let virtualId = _this.$route.query.virtualId;
        let gunCode = _this.$route.query.gunCode;
        let params = {
          virtualId: virtualId,
          gunCode: gunCode
        };

        util
          .request(
            global.API_PREFIX + "/api/v1/charging/queryChargingState",
            params
          )
          .then(res => {
            console.log("res:", res);
            _this.isStop = res.data.data.isStop;
            if (res.data.code == 0 && res.data.data.isStop * 1 == 1) {
              // _this.serviceFee = res.data.data.serviceFee;
              // _this.money = res.data.data.money;
              // _this.remainingTimeElectricity =
              //   res.data.data.remainingTimeElectricity;
              // _this.totalFee = res.data.data.consumeTotalMoney;
              // _this.orderRecordNum = res.data.data.orderRecordNum;
              // debugger;
              let _payInfo = {};
              // _this.payInfo.chargePowerAmountStr = res.data.data.kwh;
              // _this._payInfo.eneryCharge = res.data.data.money;
              // _this._payInfo.serviceCharge = res.data.data.serviceFee;
              // _this._payInfo.chargTime = res.data.data.alreadyTime;
              // _this._payInfo.consumeTotalMoney =
              //   (res.data.data.money * 1000 + res.data.data.serviceFee * 1000) /
              //   1000;
              _this.$set(
                _this.payInfo,
                "orderNum",
                res.data.data.orderRecordNum
              );
              _this.$set(
                _this.payInfo,
                "chargePowerAmountStr",
                res.data.data.kwh
              );
              _this.$set(
                _this.payInfo,
                "serviceCharge",
                res.data.data.serviceFee
              );
              _this.$set(_this.payInfo, "chargTime", res.data.data.alreadyTime);
              _this.$set(
                _this.payInfo,
                "consumeTotalMoney",
                (res.data.data.money * 1000 + res.data.data.serviceFee * 1000) /
                  1000
              );
            } else {
              setTimeout(() => {
                _this.getItme();
              }, 3000);
            }
          })
          .catch(err => {
            util.handleError(err);
          });
      } else if (_this.$route.query.isStop == "1") {
        _this.isStop = 1;
        let _payInfo = {};

        _this.$set(
          _this.payInfo,
          "orderNum",
          _this.$route.query.orderRecordNum
        );
        _this.$set(
          _this.payInfo,
          "chargePowerAmountStr",
          _this.$route.query.kwh
        );
        _this.$set(
          _this.payInfo,
          "serviceCharge",
          _this.$route.query.serviceFee
        );
        _this.$set(_this.payInfo, "chargTime", _this.$route.query.alreadyTime);
        _this.$set(
          _this.payInfo,
          "consumeTotalMoney",
          (_this.$route.query.money * 1000 +
            _this.$route.query.serviceFee * 1000) /
            1000
        );
      } else if (_this.$route.query.orderNum) {
        _this.isStop = 1;
        _this.payInfo = this.$route.query;
      }
      // this.payInfo = this.$route.query;
    },

    checked(type) {
      this.checkType = type;
    },
    pay() {
      let _this = this;
      if (_this.isStop != 1) {
        _this.$alert("订单结算中,请稍后");
        return false;
      }
      // {
      //  "orderRecordNum":"123456789",
      //  "totalFee":22.00,
      //  "payType":3
      // }

      let params = {
        orderRecordNum: _this.payInfo.orderNum,
        totalFee: _this.payInfo.consumeTotalMoney,
        payType: _this.checkType
      };
      // console.log(params);
      // let params = {
      //   orderRecordNum: "1586357155702002",
      //   totalFee: "72.04",
      //   payType: 2
      // };
      _this.$loading.show();

      util
        .request(global.API_PREFIX + "/api/v1/orderPay/charge", params)
        .then(function(res) {
          // debugger;
          _this.$loading.hide();

          if (res.data.code == 0) {
            let options = {
              title: "提示",
              content: "支付成功",
              yesText: "添加评论",
              noText: "返回首页"
            };
            _this
              .$confirm(options)
              .then(() => {
                _this.$router.push({
                  path: "AddEvaluation",
                  query: _this.payInfo
                });
              })
              .catch(() => {
                _this.$router.push({
                  path: "weHome"
                });
              });
          }
        })
        .catch(err => {
          _this.$loading.hide();

          console.log(err);
        });
    },
    pays(type) {
      let _this = this;
      console.log("form:", _this.form);
      if (type == 1) {
      } else if (type == 2) {
        util
          .request(
            global.API_PREFIX + "/fusioncharge/payCallBack/wxNotify",
            _this.form
          )
          .then(function(res) {
            // debugger;
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
};
</script>
<style scoped>
.main {
  background: #f6f5f8;
  padding-top: 0.41rem;
  height: 100vh;
}
.app {
  margin: 0rem 0.28rem 0 0.28rem;
  background: #fefdff;
  border-radius: 0.14rem;
}
.app1 {
  margin-top: 0.41rem;
}
.payTitle {
  font-size: 0.28rem;
  font-weight: 500;
  color: #404040;
  margin: 0 0.21rem;
  padding: 0.28rem;
  border-bottom: 0.01rem solid rgba(128, 128, 128, 0.5);
}
.payMain {
  margin: 0 0.21rem;
  padding: 0.28rem;
  border-bottom: 0.01rem solid rgba(128, 128, 128, 0.5);
}
.payBox {
  display: flex;
  justify-content: space-between;
  padding: 0 0.15rem;
  height: 0.55rem;
  line-height: 0.55rem;
  font-size: 0.25rem;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  align-items: center;
}
.tatal {
  margin: 0 0.21rem;
  padding: 0.28rem;
}
.orange {
  color: #ff6e2e;
}
.black {
  color: #595959;
}
.question {
  display: inline-block;
  height: 0.22rem;
  width: 0.22rem;
  margin-left: 0.08rem;
  background: url(./images/question.png) center;
  background-size: 100%;
  position: relative;
  top: 0.02rem;
}
.aliPay {
  display: inline-block;
  height: 0.43rem;
  width: 0.43rem;
  margin-right: 0.22rem;
  background: url(./images/alipay.png) center;
  background-size: 100%;
  position: relative;
  top: 0.1rem;
}
.weiXin {
  display: inline-block;
  height: 0.43rem;
  width: 0.43rem;
  margin-right: 0.22rem;
  background: url(./images/weixin.png) center;
  background-size: 100%;
  position: relative;
  top: 0.1rem;
}
.outer {
  width: 0.36rem;
  height: 0.36rem;
  border: 0.01rem solid rgba(71, 132, 249, 1);
  border-radius: 50%;
  text-align: center;
  margin: auto 0;
}
.inner {
  display: block;
  width: 0.24rem;
  height: 0.24rem;
  background: rgba(71, 132, 249, 1);
  border-radius: 50%;
  position: relative;
  left: 15%;
  top: 15%;
}
.innerOff {
  display: block;
  width: 0.24rem;
  height: 0.24rem;
  background: #fefdff;
  border-radius: 50%;
  position: relative;
  left: 15%;
  top: 15%;
}
.payFont {
  color: #404040;
  font-size: 0.2rem;
  font-weight: 400;
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
  margin-bottom: 0.85rem;
}
</style>
