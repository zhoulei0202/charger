<template>
  <div class="my-app">
    <div class="main">
      <el-row>
        <el-col :span="8" class="img">
          <img width="100%" src="./images/point.png" />
        </el-col>
        <el-col :span="16">
          <div class="fonts1">{{station.stationName?station.stationName:station.chargingPileName}}</div>
          <div class="fonts2">{{station.address}}</div>
          <div class="fonts3">交易时间：{{endTime}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="score" :span="18">
          <span class="fonts4">电桩评分</span>
          <el-rate class="star" v-model="evaluateScore"></el-rate>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="evaluateContent"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <div v-for="(item,index) in tabTip" :key="index" @click="checkedTip(index)">
          <el-col class="tab" :span="8" :class="index==checkTip?'checked':''">{{item}}</el-col>
        </div>
      </el-row>
    </div>
    <el-button @click="addEva" class="button" type="primary" round>发布</el-button>
  </div>
</template>

<script>
import util from "../../libs/util";

export default {
  data() {
    return {
      title: "评论",
      evaluateScore: null,
      evaluateContent: "",
      // tabTip: ["设备完整", "交通便利", "充电快速", "环境不错"],
      tabTip: [],
      img: "",
      checkTip: 4,
      orderRecordNum: "",
      station: {},
      endTime: ""
    };
  },
  mounted() {
    // this.addEva();
    this.init();
  },
  methods: {
    checkedTip(index) {
      // debugger;
      this.checkTip = index;
    },
    init() {
      document.title = this.title;
      // let data = this.$route.query;
      this.orderRecordNum = this.$route.query.orderNum;
      this.station = util.locals.getObject("scanData")
        ? util.locals.getObject("scanData")
        : util.locals.getObject("pileData");
      // debugger;
      this.endTime = util.dateformatter(new Date());
    },
    addEva() {
      let _this = this;
      // {"userId":"10018",
      // "pileId":"19",
      // "evaluateScore":"5",
      // "evaluateContent":"太好了。",
      // "orderRecordNum":"1533018382269001"
      // }
      // debugger;
      let appUserId = util.locals.get("appUserId");
      let chargingPileId = util.locals.get("chargingPileId");
      _this.$loading.show();

      let params = {
        userId: appUserId,
        pileId: chargingPileId,
        evaluateScore: _this.evaluateScore,
        evaluateContent: _this.evaluateContent,
        orderRecordNum: _this.orderRecordNum
      };
      util
        .request(
          global.API_PREFIX +
            "/api/v1/appChargingPileEvaluate/addAppChargingPileEvaluate",
          params
        )
        .then(res => {
          // debugger;
          console.log("res:", res);
          _this.$loading.hide();

          if (res.data.code == 0) {
            _this.$alert("评论成功").then(() => {
              _this.$router.push({
                path: "/weHome"
              });
            });
          } else {
            _this.$loading.hide();

            _this.$alert("评论失败");
          }
          // 发布成功进入首页
        })
        .catch(err => {
          _this.$loading.hide();

          util.handleError(err);
        });
    }
  }
};
</script>
<style scoped>
.my-app {
  overflow: hidden;
  padding: 15px 10px;
  width: 97%;
  box-sizing: border-box;
}
.button {
  width: 100%;
  margin-top: 30px;
}
.main {
  background: #fffdff;
  padding: 14px 10px 15px 10px;
  width: 95%;
  margin: 0 auto;
}
.img {
  width: 72px;
  height: 72px;
  margin-right: 15px;
}
.fonts1 {
  font-size: 18px;
  font-weight: 500;
  color: rgba(64, 64, 64, 1);
  height: 28px;
  line-height: 28px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.fonts2 {
  font-size: 14px;
  font-weight: 400;
  color: rgba(179, 179, 179, 1);
  height: 28px;
  line-height: 28px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.fonts3 {
  font-size: 16px;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  height: 28px;
  line-height: 28px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.fonts4 {
  font-size: 18px;
  font-weight: 500;
  color: rgba(64, 64, 64, 1);
  height: 40px;
  line-height: 55px;
  margin-right: 10px;
}
.star {
  display: inline-block;
}
.score {
  height: 50px;
  line-height: 50px;
}
.tab {
  width: 1.78rem;
  height: 0.44rem;
  line-height: 0.44rem;
  border: 0.01rem solid #b3b3b3;
  border-radius: 0.22rem;
  text-align: center;
  margin: 0.24rem 0.28rem 0 0;
  font-size: 0.22rem;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}
.checked {
  color: #4784f9;
  border: 0.01rem solid #4784f9;
}
</style>
