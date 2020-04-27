<template>
  <scroller class="my-app" :on-refresh="refresh" ref="my_scroller">
    <div style="height: 1px;"></div>
    <!-- 列表主体 -->
    <div class="main" v-for="item in data" :key="item.id">
      <!-- <div class="flex_box_row">
        <div class="imgs">
          <img width="100%" src="./images/point.png" />
        </div>
        <div class="flex_box_column">
          <div class="fonts1">镜湖区三号桩</div>
          <div class="fonts2">新时代商业街中山北路79号(近银湖南路)</div>
          <div class="fonts3">
            <span class="iconM"></span>对外开放
          </div>
        </div>
        <div class="fonts2">996m</div>
      </div>
      <div class="flex_box_row">
        <div class="mg_top">
          <span class="icon"></span>电桩：1
        </div>
        <div class="mg_top">
          <span class="icon"></span>充电枪：2
        </div>
        <div class="mg_top">
          <span class="icon1"></span>空闲：3
        </div>
      </div>-->
      <div class="flex_box_row" @click="navigaetTo('/ChargeDetail', item.id)">
        <div class="imgs">
          <img width="100%" src="./images/point.png" />
        </div>
        <div class="flex_box_column">
          <div class="fonts1">{{item.title}}</div>
          <div class="fonts2">{{item.address}}</div>
          <div class="fonts3">
            <span class="iconM"></span>对外开放
          </div>
        </div>
        <div class="fonts2">{{GetDistance(lat,lng,item.latitude,item.longitude)}}KM</div>
      </div>
      <div class="flex_box_row">
        <div class="mg_top">
          <span class="icon"></span>
          电桩：
          <span class="fonts3">{{item.pileNum}}</span>
        </div>
        <div class="mg_top">
          <span class="icon"></span>
          充电枪：
          <span class="fonts3">{{item.gunNum}}</span>
        </div>
        <div class="mg_top">
          <span :class="[item.freeNum>0 ? 'iconFree' : 'icon1',]"></span>
          空闲：
          <span :class="[item.freeNum>0 ? 'fonts4' : 'fonts2',]">{{item.freeNum}}</span>
        </div>
      </div>
    </div>
  </scroller>
</template>

<script>
import util from "../../libs/util.js";
import "../../libs/flexible.js";
import { lazyAMapApiLoaderInstance } from "vue-amap";
// const loadPromise = lazyAMapApiLoaderInstance.load();

export default {
  data() {
    return {
      title: "桩点列表",
      data: [],
      Lat: "", //纬度
      lng: ""
    };
  },
  mounted() {
    this.init();
    // this.getData();
  },
  created() {
    this.getLocation();
  },
  methods: {
    init() {
      Document.title = this.title;
    },
    getData() {
      // pileType: "",//类型1交流2直流3交直流一体
      // workStatus: ""//工作状态1空闲2繁忙3故障
      // "selectType":3,// 1查询充电桩 2查询充电站 3查询充电桩和充电站
      // "pileType":1,//类型 1交流 2直流 3交直流一体
      // "chargingMethod":1,//充电方式 1快充 2慢充 3快慢充
      // "pileName":"",//充电桩名称
      // "stationName":"",//充电站名称
      // "x1":100.00,//地址坐标范围
      // "x2":200.00,
      // "y1":100.00,
      // "y2":200.00,
      // "workStatus":1//工作状态 1空闲 2繁忙 3故障
      let _this = this;
      let distance = util.locals.get("distance");
      let pileType = util.locals.get("pileType");
      let workStatus = util.locals.get("workStatus");
      let params = {};
      if (distance !== null && distance !== "" && distance != undefined) {
        params.x1 =
          (Number(_this.lng) * 100000 - distance * 100000 * 0.009) / 100000;
        params.x2 =
          (Number(_this.lng) * 100000 + distance * 100000 * 0.009) / 100000;
        params.y1 =
          (Number(_this.lat) * 100000 - distance * 100000 * 0.009) / 100000;
        params.y2 =
          (Number(_this.lat) * 100000 + distance * 100000 * 0.009) / 100000;
      } else {
        params.x1 = _this.lng - 1;
        params.x2 = _this.lng + 1;
        params.y1 = _this.lat - 1;
        params.y2 = _this.lat + 1;
      }
      params.selectType = 3;
      params.pileType = pileType ? pileType : 3;
      params.chargingMethod = 3;
      params.workStatus = workStatus ? workStatus : 1;
      _this.$loading.show();
      util
        .request(global.API_PREFIX + "/api/v1/appMap/search", params)
        .then(res => {
          console.log("res:", res);
          _this.$loading.hide();
          if (res.data.code == 0 && res.data.data.length > 0) {
            _this.data = res.data.data;
            _this.$refs.my_scroller.finishPullToRefresh();
          } else {
            let options = {
              title: "提示",
              content: "您附近没有桩点",
              yesText: "返回首页"
            };

            _this
              .$confirm(options)
              .then(() => {
                _this.$router.push("weHome");
              })
              .catch(fail);
            _this.$refs.my_scroller.finishPullToRefresh();
          }
        })
        .catch(err => {
          _this.$loading.hide();

          util.handleError(err);
          _this.$refs.my_scroller.finishPullToRefresh();
        });
    },

    Rad(d) {
      return (d * Math.PI) / 180.0; //经纬度转换成三角函数中度分表形式。
    },
    GetDistance(lat1, lng1, lat2, lng2) {
      // debugger;
      if (
        lat1 != "" &&
        lng1 != "" &&
        lat1 != undefined &&
        lng1 != undefined &&
        lat2 != "" &&
        lng2 != ""
      ) {
        var radLat1 = this.$options.methods.Rad(lat1);
        var radLat2 = this.$options.methods.Rad(lat2);
        var a = radLat1 - radLat2;
        var b =
          this.$options.methods.Rad(lng1) - this.$options.methods.Rad(lng2);
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
        s = Math.round(s * 10000) / 10000; //输出为公里
        s = s.toFixed(2);
        return s;
      } else {
        return "-";
      }
    },
    getLocation() {
      let _this = this;
      _this.$loading.show();
      lazyAMapApiLoaderInstance.load().then(() => {
        AMap.plugin("AMap.Geolocation", function() {
          var geolocation = new AMap.Geolocation({
            // 是否使用高精度定位，默认：true
            enableHighAccuracy: false,
            // 设置定位超时时间，默认：无穷大
            timeout: 1000
          });
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, "complete", onComplete);
          AMap.event.addListener(geolocation, "error", onError);
          function onComplete(data) {
            // data是具体的定位信息
            // console.log("纬度：" + data.position.getLat());
            // console.log("经度：" + data.position.getLng());

            _this.lat = data.position.getLat();
            _this.lng = data.position.getLng();
            _this.$loading.hide();
            _this.getData();
          }

          function onError(data) {
            // 定位出错
            _this.$loading.hide();
            // debugger;
            _this.lat = _this.$route.query.lat;
            _this.lng = _this.$route.query.lng;
            _this.getData();
          }
        });
      });
    },
    refresh(done) {
      //这是向下滑动的时候请求最新的数据
      this.getData();
    },
    navigaetTo(name, id) {
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
<style scoped>
.my-app {
  width: 100%;
  height: 100vh;
  background: #f3f3f3;
}
.main {
  width: 6.94rem;
  height: 2.49rem;
  margin: 0 auto;
  margin-top: 0.3rem;
  background: #fefefe;
  padding: 0.28rem 0.21rem 0.32rem 0.21rem;
  box-sizing: border-box;
  border-radius: 0.1rem;
}

.flex_box_row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.flex_box_column {
  display: flex;
  flex-direction: column;
  width: 3.92rem;
  margin-left: 0.21rem;
}
.imgs {
  height: 1.25rem;
  width: 1.25rem;
}
.fonts1 {
  font-size: 0.32rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fonts2 {
  font-size: 0.22rem;
  color: #b3b3b3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fonts3 {
  font-size: 0.24rem;
  color: #4784f9;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fonts4 {
  font-size: 0.28rem;
  color: #00c762;
  font-weight: 400;
}
.mg_top {
  height: 0.74rem;
  line-height: 0.74rem;
  height: 100%;
}
.icon {
  display: inline-block;
  position: relative;
  bottom: -0.03rem;
  margin: 0 0.03rem;
  width: 11px;
  height: 11px;
  background: rgba(71, 132, 249, 1);
  border-radius: 50%;
  margin-right: 0.1rem;
}
.icon1 {
  display: inline-block;
  position: relative;
  bottom: -0.03rem;
  margin: 0 0.03rem;
  width: 11px;
  height: 11px;
  background: #b3b3b3;
  border-radius: 50%;
  margin-right: 0.1rem;
}
.iconFree {
  display: inline-block;
  position: relative;
  bottom: -0.03rem;
  margin: 0 0.03rem;
  width: 11px;
  height: 11px;
  background: #00c762;
  border-radius: 50%;
  margin-right: 0.1rem;
}

.iconM {
  padding: 0.15rem;
  margin-right: 0.1rem;
  background: url(./images/open.png) no-repeat center;
  background-size: 100%;
}
.SearchBg {
  display: flex;
  flex-direction: row;
  height: 1rem;
  line-height: 1rem;
  width: 100%;
  /* padding: 0.21rem; */
  padding: 0 0.21rem;
  background: linear-gradient(
    -90deg,
    rgba(54, 105, 248, 1),
    rgba(77, 142, 250, 1)
  );
}
.r_input {
  width: 100%;
  border: 0;
  outline: 0;
  -webkit-appearance: none;
  padding-left: 0.6rem;
  font-size: inherit;
  color: inherit;
  height: 0.56rem;
  width: 6.28rem;
  background: rgba(0, 0, 0, 1);
  opacity: 0.1;
  border-radius: 0.28rem;
  font-size: 0.25rem;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #fcfcfc;
  margin-right: 0.2rem;
}

.history_main {
  padding: 0.2rem;
}
.history_title {
  font-size: 0.28rem;
  font-family: Source Han Sans CN;
  font-weight: 500;
  color: #404040;
}
.history_box {
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.1rem;
  justify-content: flex-start;
}
.history_item {
  border-radius: 0.07rem;
  padding: 0.11rem 0.22rem;
  font-size: 0.24rem;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  background: rgba(230, 230, 230, 1);
  margin-right: 0.36rem;
  margin-bottom: 0.28rem;
  max-width: 2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.history_del {
  font-size: 0.22rem;
  text-align: center;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}

.del_icon {
  display: inline-block;
  width: 0.25rem;
  height: 0.25rem;
  background: url(./images/delIcon.png) no-repeat center;
  background-size: 100%;
  position: relative;
  top: 0.03rem;
}
</style>
