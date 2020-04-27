<template>
  <div class="app">
    <div class="header">
      <div class="headerH1" @click="navigaetTo('/PersonalDetail')">
        <img :src="photoUrl?photoUrl:defaultImg" />
      </div>
      <div class="headerH2" @click="navigaetTo('/PersonalDetail')">
        <p style="fontSize: 0.36rem; color: #FCFCFC">{{ name }}</p>
        <p style="fontSize: 0.28rem; color: #FCFCFC; opacity: 0.6">ID号：{{ idsnum }}</p>
      </div>
      <div class="headerH3">
        <img
          src="./images/jifenicon.png"
          style="width: .33rem; height: .28rem; margin: .2rem;float: left;"
        />
        <p
          style="fontSize: 0.25rem; color: #FCFCFC; margin-top: .2rem; float: left; margin-right: .07rem"
        >积分 {{ score || 0 }}</p>
      </div>
    </div>
    <div style="background: #F5F5F5; height: 0.42rem"></div>
    <div class="bodyContent">
      <el-button
        style="width: 6.94rem ;height:1.21rem"
        type="default"
        @click="navigaetTo('/Order')"
      >
        <img src="./images/order.png" class="bodyIcon" />
        <p class="bodyFont">我的订单</p>
      </el-button>
      <el-button
        style="width: 6.94rem;margin-left: 0;;height:1.21rem"
        type="default"
        @click="navigaetTo('')"
      >
        <img src="./images/appointment.png" class="bodyIcon" />
        <p class="bodyFont">我的预约</p>
      </el-button>
      <el-button
        style="width: 6.94rem;margin-left: 0;;height:1.21rem"
        type="default"
        @click="navigaetTo('')"
      >
        <img src="./images/collection.png" class="bodyIcon" />
        <p class="bodyFont">我的收藏</p>
      </el-button>
      <el-button
        style="width: 6.94rem;margin-left: 0;;height:1.21rem"
        type="default"
        @click="navigaetTo('')"
      >
        <img src="./images/notice.png" class="bodyIcon" />
        <p class="bodyFont">公告列表</p>
      </el-button>
      <el-button
        style="width: 6.94rem;margin-left: 0;;height:1.21rem"
        type="default"
        @click="navigaetTo('')"
      >
        <img src="./images/help.png" class="bodyIcon" />
        <p class="bodyFont">使用帮助</p>
      </el-button>
      <el-button
        style="width: 6.94rem;margin-left: 0;;height:1.21rem"
        type="default"
        @click="navigaetTo('')"
      >
        <img src="./images/feedback.png" class="bodyIcon" />
        <p class="bodyFont">意见反馈</p>
      </el-button>
      <el-button
        style="width: 6.94rem;margin-left: 0;;height:1.21rem"
        type="default"
        @click="navigaetTo('')"
      >
        <img src="./images/about.png" class="bodyIcon" />
        <p class="bodyFont">关于我们</p>
      </el-button>
    </div>
  </div>
</template>

<script>
import util from "../../libs/util";
export default {
  data() {
    return {
      name: "",
      idsnum: "",
      score: "",
      photoUrl: "",
      defaultImg: require("./images/person.png")
    };
  },
  mounted() {
    this.getItem();
    this.init();
  },
  methods: {
    getItem() {
      document.title = "个人中心";
    },
    init() {
      let _this = this;
      util
        .requestget(global.API_PREFIX + "/api/v1/user/getUserInfo")
        .then(function(res) {
          _this.name = res.data.data.name;
          _this.idsnum = res.data.data.jobNumber;
          _this.photoUrl = res.data.data.photoUrl;
        })
        .catch(err => {
          console.log(err);
        });
      util
        .requestget(global.API_PREFIX + "/api/v1/user/getUserScore")
        .then(function(res) {
          _this.score = res.data.data.score;
        })
        .catch(err => {
          console.log(err);
        });
    },
    navigaetTo(name) {
      this.$router.push({ path: name });
    }
  }
};
</script>

<style  scoped>
.app {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
}
.header {
  height: 2.69rem;
  width: 7.5rem;
  background: url("./images/bg.png") no-repeat center;
  background-size: 100% 100%;
  margin-top: -0.1rem;
}
.headerH1,
.headerH2 {
  float: left;
}
.headerH1 {
  margin: 0.44rem;
  border: 0.03rem solid #fff;
  border-radius: 50%;
  width: 1.25rem;
  height: 1.25rem;
}
.headerH1 img {
  width: 1.19rem;
  height: 1.19rem;
  border-radius: 50%;
}
.headerH2 {
  margin-top: 0.6rem;
}
.headerH3 {
  position: absolute;
  right: 0;
  top: 0.4rem;
  width: 2.19rem;
  height: 0.68rem;
  background: rgba(48, 103, 204, 1);
  border: 1px solid rgba(230, 230, 230, 1);
  border-right: none;
  border-top-left-radius: 43px;
  border-bottom-left-radius: 43px;
}
.bodyContent {
  width: 6.94rem;
  background: rgba(254, 254, 254, 1);
  opacity: 0.6;
  border-radius: 14px;
  margin-left: 0.28rem;
}
.bodyFont {
  font-size: 0.35rem;
  color: rgba(51, 51, 51, 1);
  float: left;
  margin-top: 0.08rem;
  line-height: 0.85rem;
}
.bodyIcon {
  width: 0.39rem;
  height: 0.39rem;
  float: left;
  margin: 0.2rem;
}
</style>