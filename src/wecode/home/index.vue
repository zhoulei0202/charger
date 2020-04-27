<template>
  <div class="app wmhome">
    <!-- home页面 -->
    <div id="container" style="width: 100%; height: 100vh;"></div>
    <!-- 导航路线 -->
    <div id="panel" v-show="daohangStatus"></div>
    <!-- 底部扫码等按钮 -->
    <div class="btns" v-if="pointsStatus">
      <span class="left">
        <span class="btn1" @click="navigaetTo('/PaleListInfo')">
          <span class="img1"></span>
          <p>附近桩点</p>
        </span>
        <span class="btn4" @click="openGongGao()">
          <span class="img4"></span>
        </span>
        <span class="btn5" @click="getLocation()">
          <span class="img5"></span>
        </span>
      </span>
      <span class="center" @scroll="scrollEvent">
        <span class="btn-box">
          <span class="btn2" @click="useCammera()">
            <i class="icon-nav icon-nav-scan" />扫码充电
          </span>
          <span class="btn2" @click="goCammera()">输入编码</span>
        </span>
      </span>
      <span class="right">
        <span class="btn3" @click="navigaetTo('/Personal')">
          <span class="img3"></span>
          <p>个人中心</p>
        </span>
        <span class="btn6" @click="navigaetTo('/SearchList')">
          <span class="img6"></span>
        </span>
        <span class="btn7" @click="navigaetTo('/PaleList')">
          <span class="img7"></span>
        </span>
      </span>
      <span class="center-text">左滑输入编码，右滑扫码充电</span>
    </div>

    <!-- 充电桩桩点信息 -->
    <div class="btm" v-else>
      <div class="btm_top">
        <div class="btm_t_l">
          <img :src="imgURL" />
        </div>
        <div @click="goTo('/ChargeDetail', chargeInfo.id)" class="btm_t_r">
          <p class="btm_title">{{chargeInfo.name}}</p>
          <p class="btm_mid">
            {{chargeInfo.address}}
            <span class="fr">{{juli}} km</span>
          </p>
          <p class="btm_btm">
            <span class="btm_icon"></span>对外开放
          </p>
        </div>
        <div class="btm_daohang" @click="daohang"></div>
      </div>
      <div class="btm_buttom">
        <p>
          <span class="three_item">
            <span class="dian"></span>电桩:
            <span class="color_blur">{{pileNum}}</span>
          </span>
          <span class="three_item">
            <span class="dian"></span>充电枪:
            <span class="color_blur">{{gunNum}}</span>
          </span>
          <span class="three_item">
            <span class="dian2"></span>空闲:
            <span class="color_blur">{{freeNum}}</span>
          </span>
        </p>
        <div class="b_b_btm">
          <p>
            <span class="feiyongitem">充电费：</span>
            <span class="color_orange">0.0001</span> 元/度
            <span class="wenhao" @click="handleshow"></span>
          </p>
          <p>
            <span class="feiyongitem">服务费：</span>
            <span class="color_orange">0.0001</span> 元/度
          </p>
        </div>
      </div>
    </div>

    <!-- 顶部公告栏 -->
    <div class="tips" v-show="dialogTip">
      <!-- 订单状态 -->
      <!-- <p class="tip">您有一笔未支付的交易订单，<span class="font_btn" @click="payMonery()">[去支付]</span></p> -->
      <p v-show="tips==1" class="tip">
        您有一个订单正在进行中，
        <span class="font_btn" @click="onClickpayMonery()">[查看]</span>
      </p>
      <!-- 公告  -->
      <!-- <p class="tip">即日起充电桩费用上涨，具体费用参考各桩点</p> -->
      <p v-show="tips==0" class="tip">苹果手机暂不支持扫码</p>
    </div>

    <!-- 遮罩层 -->
    <div class="dialog_zezhao" v-show="dialogZezhao">
      <div class="dialog_box">
        <div class="dialog_title">
          <h2 class="dialog_title_h">充电费用</h2>
        </div>
        <div class="dialog_body">
          <p class="dialog_item" v-for="(item,index) in feeList" :key="index">
            <span class="dialog_item_left">{{item.startTime}}~{{item.endTime}}</span>
            <span class="dialog_item_right">
              <span class="color_orange">{{item.multiFee}}</span> 元
            </span>
          </p>
          <p v-show="!feeList" class="dialog_item">
            <span class="dialog_item_left">00：00-24：00</span>
            <span class="dialog_item_right">
              <span class="color_orange">0.0001</span> 元
            </span>
          </p>
        </div>
        <p class="dialog_x">
          <span class="closed" @click="closedZezhao"></span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import util from "../../libs/util";
// import "../../libs/jsApi";
import { lazyAMapApiLoaderInstance } from "vue-amap";
import zhuangdian from "../paleListInfo/images/point.png";

export default {
  //注册

  data() {
    let that = this;
    return {
      map: {},
      dialogTip: true,
      pointsStatus: true,
      dialogZezhao: false,
      daohangStatus: false,
      imgURL: zhuangdian,
      center: {
        lng: 0,
        lat: 0
      },
      juli: "",
      chargePileId: "",
      chargeLat: "",
      chargeLng: "",
      chargeDatas: [],
      feeList: [
        {
          endTime: "06:00:00",
          multiFee: 1,
          multiName: "sharp",
          startTime: "00:00:00"
        },
        {
          endTime: "12:00:00",
          multiFee: 2,
          multiName: "peak",
          startTime: "06:00:00"
        },
        {
          endTime: "18:00:00",
          multiFee: 3,
          multiName: "flat ",
          startTime: "12:00:00"
        },
        {
          endTime: "00:00:00",
          multiFee: 4,
          multiName: "valley",
          startTime: "18:00:00"
        }
      ],
      chargeInfo: {},
      pileNum: 0,
      gunNum: 0,
      freeNum: 0,
      tips: 0,
      orderCharging: {},
      qrcode: ""
    };
  },
  mounted() {
    window.document.title = "华为充电桩";
    let _this = this;
    // _this.startRecognize();
    _this.getOrder();

    lazyAMapApiLoaderInstance.load().then(() => {
      // your code ...
      // debugger;
      _this.map = new AMap.Map("container", {
        resizeEnable: true,
        zoom: 14
      });

      AMap.plugin("AMap.Geolocation", function() {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 5000, //超过10秒后停止定位，默认：5s
          buttonPosition: "TR", //定位按钮的停靠位置
          buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true //定位成功后是否自动调整地图视野到定位点
        });
        _this.map.addControl(geolocation);
        geolocation.getCurrentPosition(function(status, result) {
          if (status == "complete") {
            // debugger;
            console.log("定位结果：" + result.position);
            _this.center.lng = result.position.getLng();
            _this.center.lat = result.position.getLat();
          } else {
            _this.$message.error("定位失败");
            // debugger;

            _this.center.lng = _this.map.getCenter().lng;
            _this.center.lat = _this.map.getCenter().lat;
          }
          _this.init();
          if (_this.$route.query.id) {
            _this.chargeLng = _this.$route.query.longitude;
            _this.chargeLat = _this.$route.query.latitude;
            _this.daohang();
          }
        });
      });
    });
  },
  methods: {
    init() {
      let _this = this;
      const params = {
        selectType: 3, // 1查询充电桩2查询充电站3查询充电桩和充电站
        pileType: 1, // 类型1交流2直流3交直流一体
        chargingMethod: 3, // 充电方式1快充2慢充3快慢充
        // "pileName":"",// 充电桩名称
        // "stationName":"",//充电站名称
        x1: "", //地址坐标范围
        x2: "",
        y1: "",
        y2: "",
        workStatus: 1 //工作状态 1空闲 2繁忙 3故障
      };
      if (
        _this.$route.query.distance !== null &&
        _this.$route.query.distance !== "" &&
        _this.$route.query.distance != undefined
      ) {
        params.pileType = _this.$route.query.pileType;
        params.workStatus = _this.$route.query.workStatus;
        params.x1 =
          Number(_this.center.lng) - _this.$route.query.distance * 0.009;
        params.x2 =
          Number(_this.center.lng) + _this.$route.query.distance * 0.009;
        params.y1 =
          Number(_this.center.lat) - _this.$route.query.distance * 0.009;
        params.y2 =
          Number(_this.center.lat) + _this.$route.query.distance * 0.009;
      } else {
        params.x1 = Number(_this.center.lng) - 1;
        params.x2 = Number(_this.center.lng) + 1;
        params.y1 = Number(_this.center.lat) - 1;
        params.y2 = Number(_this.center.lat) + 1;
      }
      util
        .request(global.API_PREFIX + "/api/v1/appMap/search", params)
        .then(function(res) {
          _this.chargeDatas = [];
          console.log(6665, res);
          // debugger;
          _this.chargeDatas = res.data.data;

          _this.watchMap(_this.chargeDatas, _this);
        });
      _this.watchMap(_this.chargeDatas, _this);
    },
    // 地图渲染，添加查询到的充电桩点
    watchMap(provinces, _this) {
      // var markers = []

      _this.chargeDatas.forEach((item, index) => {
        var marker;
        console.log("附近桩点定位" + index, item.longitude, item.latitude);

        marker = new AMap.Marker({
          position: [item.longitude, item.latitude],
          title: item.title,
          map: _this.map
        });
        // markers.push(marker);
        marker.setMap(_this.map);
        // 设置鼠标划过点标记显示的文字提示
        marker.setTitle(item.title);
        // 设置label标签
        // label默认蓝框白底左上角显示，样式className为：amap-marker-label
        // marker.setLabel({
        //     offset: new AMap.Pixel(20, 20),  //设置文本标注偏移量
        //     content: "<div class='info'>"+item.title+"</div>", //设置文本标注内容
        //     direction: 'right' //设置文本标注方位
        // });
        _this.map.on("click", e => {
          // console.log(e.lnglat.getLng() + ',' + e.lnglat.getLat());
          // console.log('点击了地图');
          _this.pointsStatus = true;
          if (_this.daohangStatus === true) {
            _this.daohangStatus = false;
          } else {
            // _this.daohangStatus = true;
          }
        });
        var clickListener = AMap.event.addListener(marker, "click", e => {
          // 1，直接在当前页面显示桩点详情信息
          _this.pointsStatus = false;
          _this.chargePileId = item.id;
          _this.chargeLat = item.latitude;
          _this.chargeLng = item.longitude; // 经度
          _this.getChargeInfo(item.id);
        });
      });
      _this.map.setCenter(null); //设置地图中心点的时候先清除，防止出现多个中心点
      _this.map.setCenter([_this.center.lng, _this.center.lat]); //设置地图中心点

      //_this.map.setFitView(); // 多個点时自适应页面
    },
    // 通过ID获取桩点信息
    getChargeInfo(id) {
      let _this = this;
      let params = {
        id: id,
        type: "station" //pile桩、station站
      };
      util
        .request(global.API_PREFIX + "/api/v1/appMap/info", params)
        .then(res => {
          console.log("check-res:", res);
          _this.chargeInfo = res.data.data;

          _this.pileNum = res.data.data.pileList
            ? res.data.data.pileList.length
            : 0; //
          _this.gunNum = _this.getGunNum(res.data.data.pileList);

          _this.freeNum = _this.getfreeNum(res.data.data.pileList);
          _this.juli = _this.getDistance(
            _this.center.lat,
            _this.center.lng,
            _this.chargeInfo.latitude,
            _this.chargeInfo.longitude
          );
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 计算两个经纬度的距离(千米)
    // @param lat1 第一点的纬度
    // @param lng1 第一点的经度
    // @param lat2 第二点的纬度
    // @param lng2 第二点的经度
    // @returns {Number}

    getDistance(lat1, lng1, lat2, lng2) {
      var f = this.getRad((lat1 + lat2) / 2);
      var g = this.getRad((lat1 - lat2) / 2);
      var l = this.getRad((lng1 - lng2) / 2);
      var sg = Math.sin(g);
      var sl = Math.sin(l);
      var sf = Math.sin(f);
      var s, c, w, r, d, h1, h2;
      var a = 6378137.0; //The Radius of eath in meter.
      var fl = 1 / 298.257;
      sg = sg * sg;
      sl = sl * sl;
      sf = sf * sf;
      s = sg * (1 - sl) + (1 - sf) * sl;
      c = (1 - sg) * (1 - sl) + sf * sl;
      w = Math.atan(Math.sqrt(s / c));
      r = Math.sqrt(s * c) / w;
      d = 2 * w * a;
      h1 = (3 * r - 1) / 2 / c;
      h2 = (3 * r + 1) / 2 / s;
      s = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
      s = s / 1000;
      s = s.toFixed(2); //指定小数点后的位数。
      return s;
    },
    getRad(d) {
      var PI = Math.PI;
      return (d * PI) / 180.0;
    },
    // 跳转
    navigaetTo(name, query) {
      this.$router.push({
        path: name,
        query: this.centers
      });
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

    // 扫码功能
    useCammera() {
      let _this = this;
      // alert(1);
      // _this.startScan();
      _this.$router.push({
        path: "/EnterTheNum1"
      });
      // HWH5.scanCode({ needResult: 1 })
      //   .then(data => {
      //     console.log("扫码成功", data);
      //     let qrcode = data.content;
      //     let params = {
      //       qrCode: qrcode
      //     };
      //     util
      //       .request(global.API_PREFIX + "/api/v1/charging/scan", params)
      //       .then(res => {
      //         console.log("gunRes:", res);
      //         // debugger;
      //         if (res.data.code == 0 && res.data.data) {
      //           // debugger;
      //           util.locals.set("qrcode", _this.inputValue);
      //           util.locals.setObject("scanData", res.data.data);
      //           _this.checkGun(res.data.data.chargingPileId);
      //         } else {
      //           if (res.data.msg) {
      //             _this.$alert(res.data.msg);
      //           }
      //         }
      //       })
      //       .catch(err => {
      //         _this.$alert(err.message);
      //         util.handleError(err);
      //       });
      //   })
      //   .catch(error => {
      //     console.log("扫码异常", error);
      //   });
    },
    // 跳转到输入编码页面
    goCammera() {
      this.$router.push({
        path: "/EnterTheNum"
      });
    },
    // 滑动扫码充电按钮的方法
    scrollEvent(eve) {
      // const that = this;
      setTimeout(() => {
        let scrollLeft = eve.srcElement.scrollLeft;
        let offsetWidth = eve.srcElement.scrollWidth;
        // console.log(scrollLeft,offsetWidth);
        // console.log('-----------------------');
        if (scrollLeft > offsetWidth / 4) {
          eve.srcElement.scrollLeft = offsetWidth;
        } else if (scrollLeft == 0) {
          // eve.srcElement.scrollLeft = 0;
        } else if (scrollLeft <= offsetWidth / 4) {
          eve.srcElement.scrollLeft = 0;
        }
      }, 500);
    },
    closedZezhao() {
      this.dialogZezhao = false;
    },
    handleshow() {
      let params = {
        chargePileId: this.chargePileId //充电桩ID
      };
      util
        .request(global.API_PREFIX + "/api/v1/appMap/queryFee", params)
        .then(res => {
          this.feeList = [];
          console.log("res:", res.data.data);
          this.dialogZezhao = true;
          this.feeList = res.data.data.feeList;
        })
        .catch(err => {
          console.log(err);
        });
    },

    daohang() {
      let _this = this;

      AMap.plugin("AMap.Driving", () => {
        //构造路线导航类
        let driving = new AMap.Driving({
          map: _this.map,
          panel: "panel"
        });
        // console.log('导航坐标',_this.center.lng, _this.center.lat,_this.chargeLng, _this.chargeLat);
        // 根据起终点经纬度规划驾车导航路线
        driving.search(
          new AMap.LngLat(_this.center.lng, _this.center.lat),
          new AMap.LngLat(_this.chargeLng, _this.chargeLat),
          // driving.search(new AMap.LngLat(114.3642730078125, 30.53798049942096),
          // new AMap.LngLat(114.4642730078125, 30.63798049942096),
          (status, result) => {
            // console.log(7778,status,result);
            if (status === "complete") {
              console.log("绘制驾车路线完成");
              _this.daohangStatus = true;
              _this.pointsStatus = true;
            } else {
              console.log("获取驾车数据失败：" + result);
            }
          }
        );
      });
    },
    openGongGao() {
      // this.$message.info('暂无公告');
      if (this.dialogTip === true) {
        this.dialogTip = false;
      } else {
        this.dialogTip = true;
      }
    },

    getLocation() {
      var that = this;
      var mapObj = new AMap.Map("map");
      mapObj.plugin("AMap.Geolocation", function() {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 5000, //超过10秒后停止定位，默认：5s
          buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
          buttonPosition: "TB", //定位按钮停靠位置，默认：'LB'，左下角 可删
          showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
          showCircle: false, //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true //定位成功后将定位到的位置作为地图中心点，默认：true
        });

        mapObj.addControl(geolocation);

        geolocation.getCurrentPosition((status, result) => {
          if (status == "complete") {
            console.log("定位结果：" + result.position);
            console.log("定位类别：" + result.location_type);
            console.log("纬度：" + result.position.getLng());
            console.log("经度：" + result.position.getLat());
            // debugger;
            that.center.lng = result.position.getLng();
            that.center.lat = result.position.getLat();
            // let ddd=that.map.getCenter();
          } else {
            that.$message.error("定位失败");
            that.center.lng = that.map.getCenter().lng;
            that.center.lat = that.map.getCenter().lat;
          }
        });
      });
    },
    getGunNum(item) {
      // debugger;
      let gunNum = 0;
      if (item.length > 0) {
        for (let i = 0; i < item.length; i++) {
          if (
            item[i].gunList != null &&
            item[i].gunList != "" &&
            item[i].gunList.length > 0
          ) {
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
          if (
            item[i].gunList != null &&
            item[i].gunList != "" &&
            item[i].gunList.length > 0
          ) {
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
    },
    getOrder() {
      let _this = this;
      let appUserId = util.locals.get("appUserId");
      const params = {
        appUserId: appUserId
      };
      util
        .request(
          global.API_PREFIX +
            "/api/v1/appChargeOrder/queryAppChargeOrderCharging",
          params
        )
        .then(function(res) {
          if (res.data.code == 0 && res.data.data) {
            _this.tips = 1;
            _this.dialogTip = true;
            _this.orderCharging = res.data.data;
          }
        });
    },
    onClickpayMonery() {
      //跳转充电详情页
      this.$router.push({
        path: "/ChargingProcess",
        query: {
          gunCode: this.orderCharging.chargeGunNum,
          virtualId: this.orderCharging.virtualId,
          chargingPileName: this.orderCharging.pileName,
          stationName: ""
        }
      });
    },
    goTo(name, id) {
      this.$router.push({
        path: name,
        query: {
          id: id
        }
      });
    }
  }
};
</script>

<style  scoped>
.app {
  width: 100%;
  height: 100%;
}
.map {
  width: 100%;
  height: 100%;
}
.btns {
  position: fixed;
  width: 100%;
  background-color: white;
  bottom: 0rem;
  height: 1rem;
  z-index: 1000;
}
.left,
.center,
.right {
  display: inline-block;
  margin-top: -0.5rem;
}
.left {
  width: 2.2rem;
  height: 1.5rem;
  float: left;
  text-align: center;
}
.center {
  display: inline-block;
  width: 3rem;
  height: 1.2rem;
  line-height: 1.2rem;
  color: white;
  margin: 0 auto;
  margin-top: -1rem;
  background-color: #427cf9;
  border-radius: 0.6rem;
  overflow-y: scroll;
}

::-webkit-scrollbar {
  display: none;
}
.btn-box {
  display: inline-block;
  width: 6.1rem;
  height: 1.2rem;
}
.right {
  width: 2.2rem;
  height: 1.5rem;
  float: right;
  text-align: center;
}
.btn1 {
  width: 1rem;
  margin: 0 auto;
  font-size: 0.22rem;
}
.btn2 {
  display: inline-block;
  width: 3rem;
  height: 1.2rem;
  line-height: 1.2rem;
  font-size: 0.33rem;
  text-align: center;
}
.center-text {
  position: absolute;
  left: 0;
  bottom: 0.2rem;
  width: 100%;
  font-size: 0.22rem;
  display: inline-block;
  text-align: center;
  color: #606266;
}
.btn3 {
  width: 1rem;
  margin: 0 auto;
  font-size: 0.22rem;
}
.btn4 {
  position: absolute;
  width: 0.8rem;
  height: 0.8rem;
  top: -2.6rem;
  left: 0.1rem;
}
.btn5 {
  position: absolute;
  width: 0.8rem;
  height: 0.8rem;
  top: -1.7rem;
  left: 0.1rem;
}
.btn6 {
  position: absolute;
  width: 0.8rem;
  height: 0.8rem;
  top: -2.6rem;
  right: 0.1rem;
}
.btn7 {
  position: absolute;
  width: 0.8rem;
  height: 0.8rem;
  top: -1.7rem;
  right: 0.1rem;
}
.img1 {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  margin-top: -0.1rem;
  background-image: url(./images/fujinzhuangdian.png);
  background-size: cover;
  background-repeat: no-repeat;
  padding-bottom: -0.2rem;
}
.img3 {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  margin-top: -0.1rem;
  background-image: url(./images/gerenzhongxin.png);
  background-size: cover;
  background-repeat: no-repeat;
  padding-bottom: -0.2rem;
}
.img4 {
  display: inline-block;
  width: 0.8rem;
  height: 0.8rem;
  margin-top: -0.1rem;
  background-image: url(./images/gonggao.png);
  background-size: cover;
  background-repeat: no-repeat;
}
.img5 {
  display: inline-block;
  width: 0.8rem;
  height: 0.8rem;
  background-image: url(./images/dingwei.png);
  background-size: cover;
  background-repeat: no-repeat;
}
.img6 {
  display: inline-block;
  width: 0.8rem;
  height: 0.8rem;
  background-image: url(./images/shaixuan.png);
  background-size: cover;
  background-repeat: no-repeat;
}
.img7 {
  display: inline-block;
  width: 0.8rem;
  height: 0.8rem;
  background-image: url(./images/search.png);
  background-size: cover;
  background-repeat: no-repeat;
}
.tips {
  width: 92%;
  /* height: 0.67rem; */
  /* line-height: 0.67rem; */
  margin: 0 auto;
  color: white;
  position: fixed;
  top: 0.3rem;
  left: 4%;
}
.tip {
  padding: 0 0.3rem;
  height: 0.67rem;
  line-height: 0.67rem;
  background: rgba(0, 0, 0, 1);
  opacity: 0.68;
  border-radius: 0.14rem;
  margin-bottom: 0.1rem;
}
.font_btn {
  color: #ff6e2e;
}

/* 底部详情 */
.btm {
  position: fixed;
  width: 100%;
  background-color: white;
  bottom: 0rem;
  height: 3.81rem;
  z-index: 1000;
}
.btm_top {
  height: 1.7rem;
  overflow: hidden;
}
.btm_t_l {
  margin-top: 0.45rem;
  margin-left: 0.28rem;
  display: block;
  float: left;
  width: 1.25rem;
  height: 1.2rem;
  /* border: 1px solid #4784F9; */
}
.btm_t_l img {
  width: 100%;
  height: 100%;
}
.btm_t_r {
  display: block;
  margin-top: 0.4rem;
  margin-left: 2rem;
  /* border: 1px solid #4784F9; */
}
.btm_title {
  font-size: 0.32rem;
  font-family: Source Han Sans CN;
  font-weight: 500;
}
.btm_mid {
  font-size: 0.22rem;
  color: #b3b3b3;
}
.fr {
  float: right;
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
  margin: 0 0.2rem;
  background-image: url(./images/duiwai.png);
  background-repeat: no-repeat;
  background-size: cover;
}
.btm_daohang {
  display: inline-block;
  width: 1.06rem;
  height: 1.06rem;
  position: absolute;
  top: -0.53rem;
  right: 0.1rem;
  background-image: url(./images/daohang.png);
  background-repeat: no-repeat;
  background-size: cover;
}
.btm_buttom {
  width: 100%;
}
.three_item {
  display: inline-block;
  width: 32%;
  line-height: 0.7rem;
  text-align: center;
  font-size: 0.24rem;
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
.wenhao {
  display: inline-block;
  width: 0.3rem;
  height: 0.3rem;
  margin-left: 0.3rem;
  background-image: url(./images/wenhao.png);
  background-repeat: no-repeat;
  background-size: cover;
}
.b_b_btm {
  line-height: 0.6rem;
}
.feiyongitem {
  margin-left: 0.5rem;
}

/* 遮罩和弹窗 */
.dialog_zezhao {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1001;
  background: rgba(10, 10, 10, 0.6);
  /* display: none; */
}
.dialog_box {
  width: 5.32rem;
  background: rgba(252, 252, 252, 1);
  border-radius: 0.14rem;
  z-index: 1005;
  box-sizing: border-box;
  margin: 3rem auto;
}
.dialog_title_h {
  text-align: left;
  padding: 0.25rem;
  font-size: 0.28rem;
  color: #4784f9;
}
.dialog_body {
  font-size: 0.26rem;
}
.dialog_item {
  height: 0.63rem;
  line-height: 0.63rem;
}
.dialog_item_left {
  width: 1.2rem;
  height: 0.19rem;
  padding-left: 0.57rem;
  text-align: left;
  font-size: 0.26rem;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
}
.dialog_item_right {
  display: inline-block;
  width: 2rem;
  height: 0.19rem;
  padding-right: 0.57rem;
  text-align: right;
  font-size: 0.26rem;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
}
.dialog_x {
  position: relative;
  top: 1rem;
  text-align: center;
}
.closed {
  display: inline-block;
  width: 0.64rem;
  height: 0.64rem;
  background-image: url(./images/closed.png);
  background-repeat: no-repeat;
  background-size: cover;
}
.color_orange {
  color: #ff6e2e;
}
.color_blur {
  color: #4784f9;
}

.amap-marker-label {
  border: 0;
  background-color: transparent;
}

.info {
  position: relative;
  top: 0;
  right: 0;
  min-width: 0;
}

/* // 导航的路线弹窗 */
#panel {
  position: fixed;
  background-color: white;
  max-height: 90%;
  overflow-y: auto;
  top: 10px;
  right: 10px;
  width: 250px;
}
#panel .amap-call {
  background-color: #009cf9;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
#panel .amap-lib-driving {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  overflow: hidden;
}
.qrbox {
  height: 100vh;
  border: red 1px solid;
}
</style>
<style >
.wmhome .amap-controls {
  display: none;
  opacity: 0;
}
.wmhome .amap-geo {
  display: none;
  opacity: 0;
}
</style>
