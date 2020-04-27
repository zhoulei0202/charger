<template>
  <div class="my-app">
    <div class="app">
      <div class="app_title">当前定位：{{city}}</div>
    </div>

    <div class="app">
      <div class="app_title">距离（km）</div>

      <div class="flex_row">
        <div
          v-for="(items,index) in distance"
          :key="index"
          @click="changeDistance(items)"
          v-bind:class="distanceCheckValue==items ? 'checked': 'flex_items'"
        >{{items}}km</div>
      </div>
    </div>
    <div class="app">
      <div class="app_title">充电方式</div>
      <div class="flex_row">
        <div
          v-for="(items,index) in pileTypes"
          :key="index"
          @click="changePileType(items.value)"
          v-bind:class="pileType==items.value ? 'checked': 'flex_items'"
        >{{items.label}}</div>
      </div>
    </div>
    <div class="app">
      <div class="app_title">状态</div>
      <div class="flex_row">
        <div
          v-for="(items,index) in workStatusList"
          :key="index"
          @click="changeStatus(items.value)"
          v-bind:class="workStatus==items.value ? 'checked': 'flex_items'"
        >{{items.label}}</div>
      </div>
    </div>

    <div class="app">
      <div class="button" @click="backHome">确定</div>
    </div>
  </div>
</template>

<script>
import util from "../../libs/util.js";
import { lazyAMapApiLoaderInstance } from "vue-amap";
// const loadPromise = lazyAMapApiLoaderInstance.load();
export default {
  data() {
    return {
      city: "",
      distance: ["1", "2", "3", "5", "8", "10", "20", "50"],
      chargingMethods: [
        {
          label: "快充",
          value: 1
        },
        {
          label: "慢充",
          value: 2
          // },
          // {
          //     label: "快慢充",
          //     value: 3
        }
      ],
      pileTypes: [
        {
          label: "交流",
          value: 1
        },
        {
          label: "直流",
          value: 2
          // },
          // {
          //     label: "交直流一体",
          //     value: 3
        }
      ],
      workStatusList: [
        {
          label: "空闲",
          value: 1
        },
        {
          label: "繁忙",
          value: 2
          // },
          // {
          //     label: "故障",
          //     value: 3
        }
      ],
      distanceCheckValue: "",
      pileType: "", //类型1交流2直流3交直流一体
      workStatus: "" //工作状态1空闲2繁忙3故障

      // "selectType":3,// 1查询充电桩 2查询充电站 3查询充电桩和充电站
      // "pileType":1,//类型 1交流 2直流 3交直流一体
      // "chargingMethod":1,//充电方式 1快充 2慢充 3快慢充
      // "pileName":"",//充电桩名称
      // "stationName":"",//充电站名称
      // "x1":100.00,//地址坐标范围
      // "x2":200.00,
      // "y1":100.00,
      // "y2":200.00,
      // "workStatus":1//工作状态 1空闲 2繁忙 3故
    };
  },
  mounted() {
    this.getCity();
  },
  methods: {
    getCity() {
      let _this = this;

      lazyAMapApiLoaderInstance.load().then(() => {
        //加载城市查询插件
        AMap.service(["AMap.CitySearch"], function() {
          // //实例化城市查询类
          var citysearch = new AMap.CitySearch();
          //自动获取用户IP，返回当前城市
          citysearch.getLocalCity(function(status, result) {
            console.log(999, result);
            if (status === "complete" && result.info === "OK") {
              if (result && result.city && result.bounds) {
                _this.city = result.city;
              }
            } else {
              console.log("您当前所在城市：" + result.info + "");
            }
          });
        });
      });
    },
    changeDistance(items) {
      this.distanceCheckValue = items;
      util.locals.set("distance", this.distanceCheckValue);
    },
    changePileType(items) {
      //充电类型 1交流 2直流 3交直流一体
      this.pileType = items;
      util.locals.set("pileType", this.pileType);
    },
    changeStatus(items) {
      this.workStatus = items; // 工作状态 1空闲 2繁忙 3故障
      util.locals.set("workStatus", this.workStatus);
    },
    backHome() {
      if (
        this.distanceCheckValue !== "" &&
        this.pileType !== "" &&
        this.workStatus !== ""
      ) {
        this.$router.push({
          path: "/PaleListInfo",
          query: {
            distance: this.distanceCheckValue,
            pileType: this.pileType,
            workStatus: this.workStatus
          }
        });
      } else {
        this.$message.error("请先选择筛选条件");
      }
    }
  }
};
</script>
<style scoped>
.my-app {
  overflow: hidden;
  background: #f2f2f2;
  height: 100vh;
}
.app {
  padding: 0.35rem 0.27rem;
  margin: 0 0.1rem;
  border-bottom: 0.01rem #808080 solid;
}
.app_title {
  font-size: 0.25rem;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: rgba(64, 64, 64, 1);
}
.flex_row {
  display: flex;
  flex-wrap: wrap;
  /* justify-content: space-around; */
}
.flex_items {
  height: 0.44rem;
  line-height: 0.44rem;
  font-size: 0.22rem;
  width: 1.45rem;
  background: rgba(230, 230, 230, 1);
  border-radius: 0.07rem;
  text-align: center;
  margin: 0.2rem 0.1rem;
  box-sizing: border-box;
}
.checked {
  height: 0.44rem;
  line-height: 0.44rem;
  font-size: 0.22rem;
  width: 1.45rem;
  background: rgba(230, 230, 230, 1);
  border-radius: 0.07rem;
  text-align: center;
  margin: 0.2rem 0.1rem;
  box-sizing: border-box;
  color: #4784f9;
  background: rgba(71, 132, 249, 0.5);
  font-weight: 400;
}

.button {
  width: 6.67rem;
  height: 0.78rem;
  background: linear-gradient(
    -90deg,
    rgba(54, 105, 248, 1),
    rgba(77, 142, 250, 1)
  );
  border-radius: 0.39rem;
  text-align: center;
  line-height: 0.78rem;
  color: #ffffff;
  margin: 0.5rem auto;
  font-size: 0.28rem;
}
</style>
