<template>
  <div class="app">
    <div class="block">
      <el-carousel>
        <el-carousel-item v-for="item in imagesbox" :key="item.id">
          <img :src="item.idView" class="image" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick" class="tabsStyle">
      <el-tab-pane label="基本信息" name="first">
        <div class="btm">
          <div class="btm_top">
            <div class="btm_t_r">
              <p class="btm_title">{{ name }}</p>
              <el-rate v-model="value1" disabled style="display: inline-block;"></el-rate>
              <p class="btm_xing">{{value1}}分</p>
            </div>
            <div class="btm_daohang" @click="navigaetTo('/weHome')"></div>
          </div>
          <div class="btm_buttom">
            <p class="btm_adress">
              {{ address }}
              <span class="btm_adress_r">{{distance}}km</span>
            </p>
            <p class="btm_btm">
              <span class="btm_icon"></span>对外开放
            </p>
            <p style="margin-left: 0.28rem;">
              <span class="three_item">
                <span class="dian"></span>电桩:
                <span class="color_blur">{{ pileNum || 0 }}</span>
              </span>
              <span class="three_item">
                <span class="dian"></span>充电枪:
                <span class="color_blur">{{ gunNum || 0 }}</span>
              </span>
              <span class="three_item">
                <span class="dian2"></span>空闲:
                <span class="color_blur">{{ freeNum || 0 }}</span>
              </span>
            </p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="桩位" name="second">
        <div class="tab2_btm" v-for="item in pilebox" :key="item.chargingPileId">
          <div class="tab2_top">
            <div class="tab2_t_l">
              <div :class="[item.status==1?'dianzhuang_img_h':'dianzhuang_img_h1']"></div>
              <p class="img_text">{{item.status==1?"在线":"离线"}}</p>
            </div>
            <div class="tab2_t_r">
              <div class="tab2_tit">
                <span class="tab2_title">{{ item.name }}</span>
                <!-- <span class="tab2_shoucang"></span> -->
              </div>
              <p class="tab2_title1">
                <span>电桩编号：</span>
                {{ item.runCode }}
              </p>
              <!-- <p class="tab2_title1">
                <span>220kw</span>
                <span>120A</span>
                <span>112V</span>
              </p>-->
              <p>
                <span style="font-size:0.24rem;color:rgba(102,102,102,1);">
                  充电费：
                  <span style="color: #FF6E2E">{{ multiFee || 0 }}</span>元/度
                </span>
                <!-- <span class="wenhao"></span> -->
              </p>
              <p>
                <span style="font-size:0.24rem;color:rgba(102,102,102,1);">
                  服务费：
                  <span style="color: #FF6E2E">{{ serviceFee || 0 }}</span>元/度
                </span>
              </p>
            </div>
          </div>
          <div class="tab2_buttom">
            <div v-for="(item2,index2) in item.gunList" :key="index2">
              <p v-if="item2.gunType==1">
                <span :class="[item2.gunStatus==1||2||3||4?'dian':'dian2']"></span>
                <span title="1234564">交流充电枪：</span>
                {{ item2.gunNumber }} ({{chargeStatus(item2.gunStatus)}})
                <!-- <el-button class="yuyue" @click="toSubscribe(item)">
                  <span>预约</span>
                </el-button>-->
              </p>
              <p style="margin-top: 0.65rem" v-else>
                <span :class="[item2.gunStatus==1||2||3||4?'dian3':'dian2']"></span>
                <span>直流充电枪：</span>
                {{ item2.gunNumber }} ({{chargeStatus(item2.gunStatus)}})
                <!-- <el-button class="yuyue" disabled @click="toSubscribe(item)">
                  <span>预约</span>
                </el-button>-->
              </p>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="评价" name="third">
        <div class="tab3_card" v-for="(item,index) in evaData" :key="index">
          <div class="tab3_l">
            <img src="./images/person.png" alt="头像" />
          </div>
          <div class="tab3_r">
            <p class="tab3_t">
              {{item.userName}}
              <span class="tab3_date">{{item.createTime.substring(0, 10)}}</span>
            </p>
            <el-rate v-model="value2" style=" visibility: hidden;"></el-rate>
            <!-- <p class="tab3_m">5.0分</p> -->
            <p class="tab3_b">{{item.evaluateContent}}</p>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import util from "../../libs/util";
import { lazyAMapApiLoaderInstance } from "vue-amap";
// const loadPromise = lazyAMapApiLoaderInstance.load();
export default {
  data() {
    return {
      activeName: "first",
      value1: 0,
      value2: 5,
      address: "",
      name: "",
      freeNum: "", // 空闲数
      pileNum: "", // 充电桩
      gunNum: "", // 充电枪
      chargingPileId: "",
      multiFee: "", // 充电费
      serviceFee: "", // 服务费
      gunStatus: "", // 离线或在线
      latCur: "", // 当前纬度
      lngCur: "", //  当前经度
      lat: "", // 纬度
      lng: "", // 经度
      id: "",
      distance: "", // 距离
      pjList: [
        {
          name: "设备完整 12"
        },
        {
          name: "设备完整 13"
        },
        {
          name: "设备完整 14"
        },
        {
          name: "设备完整 15"
        }
      ],
      imagesbox: [{ id: 0, idView: require("./images/1.jpg") }],
      pilebox: [],
      evaData: []
    };
  },
  mounted() {
    this.getItem();
    this.getEva();
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    dealParam() {
      let params = {};
      params.id = this.$route.query.id;
      params.type = "station";
      return params;
    },
    getItem() {
      document.title = "充电站详情";
      let _this = this;
      lazyAMapApiLoaderInstance.load().then(() => {
        AMap.service(["AMap.CitySearch"], function() {
          //实例化城市查询类
          var citysearch = new AMap.CitySearch();
          //自动获取用户IP，返回当前城市
          citysearch.getLocalCity(function(status, result) {
            // console.log(999, result);
            if (status === "complete" && result.info === "OK") {
              if (result && result.city && result.bounds) {
                _this.city = result.city;
              }
            } else {
              console.log("您当前所在城市：" + result.info + "");
            }
          });
        });

        let map = new AMap.Map("", {
          resizeEnable: true,
          zoom: 14
        });
        new AMap.plugin("AMap.Geolocation", function() {
          let geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 5000 //超过5秒后停止定位，默认：无穷大
          });
          map.addControl(geolocation);
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, "complete", data => {
            //解析定位结果
            console.log("纬度：" + data.position.getLat());
            console.log("经度：" + data.position.getLng());
            _this.latCur = data.position.getLat();
            _this.lngCur = data.position.getLng();
            // 调用 return的距离单位为km
            if (_this.lat && _this.lng && _this.latCur && _this.lngCur) {
              _this.GetDistance(
                _this.lat,
                _this.lng,
                _this.latCur,
                _this.lngCur
              );
            }
          });
        });
      });

      let param = this.dealParam();
      util
        .request(global.API_PREFIX + "/api/v1/appMap/info", param)
        .then(function(res) {
          // debugger;
          _this.value1 = res.data.data.averageScore;
          _this.address = res.data.data.address;
          _this.name = res.data.data.name;
          _this.pilebox = res.data.data.pileList;
          _this.lat = res.data.data.latitude;
          _this.lng = res.data.data.longitude;
          _this.id = res.data.data.id;
          _this.pileNum = res.data.data.pileList
            ? res.data.data.pileList.length
            : 0; //
          _this.gunNum = _this.getGunNum(res.data.data.pileList);

          _this.freeNum = _this.getfreeNum(res.data.data.pileList);
        })
        .catch(err => {
          console.log(err);
        });
    },
    GetDistance(lat1, lng1, lat2, lng2) {
      var radLat1 = (lat1 * Math.PI) / 180.0;
      var radLat2 = (lat2 * Math.PI) / 180.0;
      var a = radLat1 - radLat2;
      var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
      var s =
        2 *
        Math.asin(
          Math.sqrt(
            Math.pow(Math.sin(a / 2), 2) +
              Math.cos(radLat1) *
                Math.cos(radLat2) *
                Math.pow(Math.sin(b / 2), 2)
          )
        );
      s = s * 6378.137; // EARTH_RADIUS;
      s = Math.round(s * 10000) / 10000;
      this.distance = s.toFixed(2);
    },
    navigaetTo(name) {
      this.$router.push({
        path: name,
        query: {
          id: this.id,
          latitude: this.lat,
          longitude: this.lng
        }
      });
    },
    // 判断充电枪状态
    chargeStatus(gunStatus) {
      switch (gunStatus) {
        case 1:
          status = "空闲";
          break;
        case 2:
          status = "使用中(插枪未充电)";
          break;
        case 3:
          status = "使用中(充电中)";
          break;
        case 4:
          status = "预约中";
          break;
        case 5:
          status = "停止服务";
          break;
        case 6:
          status = "故障";
          break;
      }
      return status;
    },
    // 预约充电
    toSubscribe(item) {
      // 需要传的参数4个
      // "appUserId":"1",//APP用户ID
      // "gunCode":"1",//枪编号
      // "chargingPileId":"1",//充电桩ID
      // "chargingPileName":"awda",//充电桩名称
      this.$route.push({
        path: "Subscribe",
        query: {
          appUserId: item.appUserId,
          gunCode: item.gunCode,
          chargingPileId: item.chargingPileId,
          chargingPileName: item.chargingPileName,
          id: this.id,
          latitude: this.lat,
          longitude: this.lng
        }
      });
    },
    getEva() {
      //获取评价信息
      let _this = this;
      let param = {};

      param.stationId = _this.$route.query.id;

      util
        .request(
          global.API_PREFIX +
            "/api/v1/appChargingPileEvaluate/queryAppChargingPileEvaluateByStation",
          param
        )
        .then(function(res) {
          if (res.data.code == 0) {
            _this.evaData = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getGunNum(item) {
      // debugger;
      let gunNum = 0;
      if (item.length > 0) {
        for (let i = 0; i < item.length; i++) {
          if (item[i].gunList.length > 0) {
            gunNum += item[i].gunList.length;
          }
        }
        return gunNum;
      } else {
        return 0;
      }
    },
    getfreeNum(item) {
      // debugger;
      let freeNum = 0;
      if (item.length > 0) {
        for (let i = 0; i < item.length; i++) {
          if (item[i].gunList.length > 0) {
            let gunList = item[i].gunList;
            for (let j = 0; j < gunList.length; j++) {
              if (gunList[j].gunStatus == 1) {
                freeNum += 1;
              }
            }
          }
        }
        return freeNum;
      } else {
        return 0;
      }
    }
  }
};
</script>

<style  scoped>
.app {
  width: 100%;
  height: 100vh;
  background: #f5f5f5;
  overflow-y: scroll;
}
.el-carousel {
  margin: 0.21rem;
  height: 3.33rem;
  width: 7.08rem;
}
.el-carousel__container {
  width: 100%;
}
.image {
  width: 100%;
}
.carousel__item {
  height: 3.33rem;
  width: 7.08rem;
}
.btm {
  width: 6.94rem;
  height: 3.15rem;
  background: rgba(254, 254, 254, 1);
  border-radius: 0.14rem;
  margin-top: 0.3rem;
  position: relative;
}
.btm_top {
  height: 1.4rem;
  overflow: hidden;
}

.btm_t_r {
  display: block;
  margin-top: 0.3rem;
  margin-left: 0.2rem;
}
.btm_title {
  font-size: 0.32rem;
  font-family: Source Han Sans CN;
  font-weight: 500;
}
.btm_xing {
  font-size: 0.24rem;
  color: #ffce59;
  display: inline-block;
}
.btm_adress {
  font-size: 0.22rem;
  padding-left: 0.3rem;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: rgba(179, 179, 179, 1);
  margin-bottom: 0.1rem;
}
.btm_adress_r {
  float: right;
  margin-right: 0.5rem;
}
.btm_btm {
  font-size: 0.24rem;
  color: #4784f9;
  height: 0.3rem;
}
.btm_icon {
  display: inline-block;
  width: 0.3rem;
  height: 0.3rem;
  margin: -0.05rem 0.2rem;
  background-image: url(./images/open.png);
  background-repeat: no-repeat;
  background-size: cover;
}
.btm_daohang {
  display: inline-block;
  width: 1.06rem;
  height: 1.06rem;
  position: absolute;
  top: 0.15rem;
  right: 0.15rem;
  background-image: url(./images/daohang.png);
  background-repeat: no-repeat;
  background-size: cover;
}
.btm_buttom {
  width: 100%;
}
.three_item {
  width: 32%;
  line-height: 0.6rem;
  font-size: 0.24rem;
  float: left;
}
.three_item:nth-child(2) {
  text-align: center;
}
.three_item:nth-child(3) {
  text-align: right;
}
.dian {
  display: inline-block;
  width: 0.16rem;
  height: 0.16rem;
  border-radius: 0.08rem;
  background-color: #4784f9;
  margin-right: 0.15rem;
}
.dian2 {
  display: inline-block;
  width: 0.16rem;
  height: 0.16rem;
  border-radius: 0.08rem;
  background-color: #b3b3b3;
  margin-right: 0.15rem;
}
.dian3 {
  display: inline-block;
  width: 0.16rem;
  height: 0.16rem;
  border-radius: 0.08rem;
  background-color: #e15b27;
  margin-right: 0.15rem;
}

.color_orange {
  color: #ff6e2e;
}
.color_blur {
  color: #4784f9;
}
/* tab2 */
.tab2_btm {
  width: 6.94rem;
  height: 4.69rem;
  background: rgba(254, 254, 254, 1);
  border-radius: 0.14rem;
  margin-top: 0.3rem;
  position: relative;
  font-size: 0.24rem;
}
.tab2_top {
  height: 3rem;
}
.tab2_t_l {
  float: left;
}
.tab2_t_r {
  padding-top: 0.1rem;
}
.tab2_title {
  font-size: 0.28rem;
  color: rgba(64, 64, 64, 1);
}
.tab2_title1 {
  font-size: 0.24rem;
  color: rgba(153, 153, 153, 1);
}
.dianzhuang_img_h {
  width: 0.9rem;
  height: 0.9rem;
  margin: 0.72rem 0 0.2rem 0.42rem;
  background-image: url(./images/online.png);
  background-repeat: no-repeat;
  background-size: cover;
}
.dianzhuang_img_h1 {
  width: 0.9rem;
  height: 0.9rem;
  margin: 0.72rem 0 0.2rem 0.42rem;
  background-image: url(./images/offline.png);
  background-repeat: no-repeat;
  background-size: cover;
}
.img_text {
  width: 1.7rem;
  text-align: center;
}
.tab2_tit {
  margin-top: 0.36rem;
  font-size: 0.28rem;
  color: #404040;
}
.tab2_shoucang {
  display: inline-block;
  width: 0.35rem;
  height: 0.32rem;
  margin-left: 0.1rem;
  background-image: url(./images/collection.png);
  background-repeat: no-repeat;
  background-size: cover;
}
.wenhao {
  display: inline-block;
  width: 0.22rem;
  height: 0.22rem;
  margin-left: 0.1rem;
  background-image: url(./images/question.png);
  background-repeat: no-repeat;
  background-size: cover;
}
.tab2_buttom {
  padding-left: 0.4rem;
}

/* tab3 */
.tab3_tip {
  display: inline-block;
  margin: 0.05rem 0.2rem;
  font-size: 0.22rem;
  text-align: center;
  padding: 0.1rem 0.32rem;
  color: #999999;
  border: 0.012rem solid #999999;
  border-radius: 0.25rem;
}
.tab3_card {
  border-bottom: 0.01rem solid rgba(128, 128, 128, 0.7);
  padding: 0.1rem;
  margin: 0.2rem;
}
.tab3_l {
  float: left;
  width: 0.85rem;
  height: 0.85rem;
  margin: 0.1rem;
}
.tab3_l img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.tab3_r {
  margin-left: 1rem;
}
.tab3_t {
  font-size: 0.25rem;
}
.tab3_m {
  font-size: 0.22rem;
  color: #ffce59;
  display: inline-block;
}
.tab3_m img {
  display: inline-block;
  width: 0.23rem;
  height: 0.23rem;
  margin: 0.1rem;
}
.tab3_b {
  font-size: 0.24rem;
}
.tab3_date {
  float: right;
  font-size: 0.21rem;
  color: rgba(153, 153, 153, 1);
}
.yuyue {
  width: 0.97rem;
  height: 0.42rem;
  float: right;
  margin-right: 0.42rem;
  position: relative;
}
.yuyue span {
  position: absolute;
  top: 32%;
  left: 23%;
}
.pingjia {
  width: 1.78rem;
  height: 0.44rem;
  border: 1px solid rgba(179, 179, 179, 1);
  border-radius: 0.22rem;
  text-align: center;
  margin-bottom: 0.2rem;
  color: rgba(71, 132, 249, 1);
  float: left;
  margin-left: 0.28rem;
}
.tabsStyle {
  padding: 0.3rem;
  overflow-y: scroll;
}
</style>
<style>
.block .el-carousel__container {
  height: 100% !important;
}

.tabsStyle .el-tabs__item {
  width: 50%;
  text-align: center;
}
</style>