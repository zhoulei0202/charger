<template>
  <scroller class="app" :on-refresh="refresh" ref="my_scroller">
    <div style="height: 1px;"></div>
    <div @click="goto(item)" v-for="item in orderList" :key="item.id" class="content">
      <img src="./images/chongd.png" class="imgStyle" />
      <div class="content_p">
        <p class="p_1">{{item.chargingPileName}}</p>
        <p class="p_2">订单编号：{{item.orderNum}}</p>
        <p class="p_2">电桩编号：{{item.runCode}}</p>
        <p class="p_2">电枪编号：{{item.gunCode}}</p>
        <p class="p_2">
          <img src="./images/timeicon.png" class="imgStyle1" />
          {{item.chargeStartTime?item.chargeStartTime.substring(0, 16):''}}
        </p>
      </div>
      <div v-show="item.status==1" class="p_3">{{item.payStatus==1?"已支付":"未支付"}}</div>
      <div v-show="item.status==0" class="p_3">{{item.status==0?"充电中":""}}</div>
      <div style="clear: both;"></div>
      <div>
        <div class="charging">
          <p class="charging_p1">充电时长</p>
          <p class="charging_p2">{{item.chargTime}}</p>
        </div>
        <div class="charging">
          <p class="charging_p1">充电费用</p>
          <p class="charging_p2">{{item.eneryCharge}}元</p>
        </div>
        <div class="charging">
          <p class="charging_p1">服务费</p>
          <p class="charging_p2">{{item.serviceCharge}}元</p>
        </div>
        <div class="charging">
          <p class="charging_p1">总费用</p>
          <p class="charging_p2">{{item.consumeTotalMoney}}元</p>
        </div>
      </div>
    </div>
  </scroller>
</template>

<script>
import util from "../../libs/util";

export default {
  data() {
    return {
      orderList: [],
      address: "", //充电桩详细地址
      chargeStartTime: "", //充电开始时间
      runCode: "", //充电桩编码
      gunCode: "", //充电桩设备编码
      payStatus: "", //支付状态(0:未支付，1：已支付)
      chargingTime: "", //充电时长
      eneryCharge: "", //电费
      serviceCharge: "", //服务费
      page: 1
    };
  },
  mounted() {
    this.getItem();
  },
  methods: {
    getItem() {
      document.title = "我的订单";
      let _this = this;
      let appUserId = util.locals.get("appUserId");
      let params = {
        page: _this.page,
        rp: 10,
        condition: {
          appUserId: appUserId
        }
      };
      _this.$loading.show();
      util
        .request(global.API_PREFIX + "/api/v1/user/queryAllChargeOrder", params)
        .then(function(res) {
          _this.$loading.hide();

          if (res.data.code == 0 && res.data.rawRecords.length > 0) {
            _this.orderList = res.data.rawRecords;
          } else {
            _this.$alert("没有订单信息");
          }
          _this.$refs.my_scroller.finishPullToRefresh();
        })
        .catch(err => {
          console.log(err);
          _this.$loading.hide();
        });
    },
    refresh(done) {
      //这是向下滑动的时候请求最新的数据
      this.getItem();
    },
    infinite(done) {
      this.page++; //每当向上滑动的时候就让页数加1
      this.$refs.my_scroller.finishPullToRefresh();
      // this.$refs.my_scroller.noDataText = "";
      this.getItem();
    },
    goto(value) {
      // debugger;
      util.locals.setObject("pileData", value);
      if (value.payStatus != 1 && value.status == 1) {
        util.locals.set("chargingPileId", value.chargingPileId);
        this.$router.push({
          path: "/PaymentPage",
          query: value
        });
      } else if (value.status == 0) {
        util.locals.set("chargingPileId", value.chargingPileId);
        this.$router.push({
          path: "/ChargingProcess",
          query: {
            gunCode: value.gunCode,
            virtualId: value.virtualId,
            chargingPileName: value.chargingPileName,
            stationName: ""
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.app {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  overflow-y: scroll;
}
.content {
  width: 6.94rem;
  height: 4.3rem;
  background: rgba(254, 254, 254, 1);
  border-radius: 0.14rem;
  margin: 0.28rem;
}
.content_p {
  width: 60%;
  float: left;
  margin-top: 0.42rem;
}
.imgStyle {
  width: 0.9rem;
  height: 0.9rem;
  margin: 0.8rem 0.35rem;
  float: left;
}
.imgStyle1 {
  width: 0.24rem;
  height: 0.24rem;
  margin-right: 0.1rem;
}
.p_1 {
  font-size: 0.28rem;
  color: rgba(64, 64, 64, 1);
  margin-bottom: 0.21rem;
}
.p_2 {
  font-size: 0.24rem;
  color: rgba(153, 153, 153, 1);
  margin-bottom: 0.21rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.p_3 {
  font-size: 0.21rem;
  color: rgba(255, 110, 46, 1);
  float: right;
  margin: 0.22rem;
}
.charging {
  float: left;
  width: 25%;
  text-align: center;
}
.charging_p1 {
  font-size: 0.21rem;
  color: rgba(153, 153, 153, 1);
}
.charging_p2 {
  font-size: 0.24rem;
  color: rgba(89, 89, 89, 1);
}
</style>