<template>
  <div class="my-app">
    <!-- 搜索输入框 -->
    <div class="SearchBg">
      <div style="width:85%;margin-right:5px;">
        <el-input placeholder="请输入充电站名称搜索" v-model="inputValue">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <div @click="getDataInfo" class="fonts4">搜索</div>
    </div>

    <div>
      <scroller
        :style="{marginTop:'60px',  height: cheight + 'px' }"
        :noDataText="noDataText"
        :on-refresh="refresh"
        :on-infinite="infinite"
        ref="my_scroller"
      >
        <div style="height: 1px;"></div>
        <!-- 搜索历史 -->
        <div class="history_main" v-if="isHistory">
          <div class="history_title">搜索历史</div>
          <div class="history_box">
            <div v-for="(items ,index) in historyBox" :key="index" class="history_item">
              <span @click="pickHis(items)">{{items}}</span>
            </div>
          </div>
          <div @click="clearHistory" class="history_del">
            <i class="del_icon"></i>
            清除搜索历史
          </div>
        </div>
        <!-- 列表主体 -->

        <div v-if="!isHistory">
          <div class="main" v-for="item in searchData" :key="item.id">
            <div class="flex_box_row" @click="goTo('ChargeDetail',item.id)">
              <div class="flex_box_column">
                <div class="fonts1">{{item.title}}</div>
                <div class="fonts2">{{item.address}}</div>
              </div>
              <div>
                <i class="el-icon-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
      </scroller>
    </div>
  </div>
</template>

<script>
import util from "../../libs/util.js";
import "../../libs/flexible.js";

export default {
  data() {
    return {
      title: "搜索",
      inputValue: "",
      isHistory: true,
      count: 10,
      // loading: false,
      historyBox: [],
      searchData: [],
      page: 1,
      rp: 10,
      noDataText: "",
      cheight: 0
    };
  },

  // },
  mounted() {
    this.init();
    this.getHistory();
    this.$refs.my_scroller.finishInfinite(true);
    // this.$refs.my_scroller.noDataText = "";
  },
  methods: {
    init() {
      document.title = "搜索";
      this.cheight =
        document.body.clientHeight -
        document.getElementsByClassName("SearchBg")[0].offsetHeight;
    },
    getHistory() {
      this.historyBox = localStorage.historyItems
        ? localStorage.historyItems.split("|").slice(0, 12)
        : "";
    },
     getDataInfo() {
      // debugger;
      let _this = this;
      _this.isHistory = false;
      // _this.historyBox.push(_this.value);
      if (
        _this.inputValue != "" &&
        _this.inputValue != null &&
        _this.inputValue != undefined
      ) {
        _this.$options.methods.setHistoryItems(_this.inputValue);
      } else {
        _this.$alert("请输入关键字");
        return false;
      }
      // debugger;
      let params = {
        selectType: 2,
        x1: 0,
        x2: 90,
        y1: 0,
        y2: 180,
        chargingMethod: 3,
        pileType: 3,
        workStatus: 1,
        stationName: _this.inputValue
      };
      //遮罩
      _this.$loading.show();
      util
        .request(global.API_PREFIX + "/api/v1/appMap/search", params)
        .then(res => {
          // debugger;
          console.log("res:", res);
          if (res.data.code == 0 && res.data.data.length > 0) {
            _this.searchData = res.data.data;
            _this.$loading.hide();
            this.noDataText = "没有更多数据了";
          } else {
            _this.$alert("没有数据");
            _this.$loading.hide();
          }
        })
        .catch(err => {
          util.handleError(err);
          _this.$loading.hide();
        });
    },


    setHistoryItems(keyword) {
      keyword = keyword.trim();
      let { historyItems } = localStorage;
      if (historyItems === undefined) {
        localStorage.historyItems = keyword;
      } else {
        const onlyItem = historyItems.split("|").filter(e => e != keyword);
        if (onlyItem.length > 0)
          historyItems = keyword + "|" + onlyItem.join("|");
        localStorage.historyItems = historyItems;
      }
    },
    clearHistory() {
      // debugger;
      localStorage.removeItem("historyItems");
      this.$options.methods.getHistory();
      // vue.$set(this.historyBox, []);
      this.historyBox.splice(0, this.historyBox.length);
    },
    pickHis(value) {
      this.inputValue = value;
    },
    goTo(name, query) {
      // debugger;
      this.$router.push({
        path: name,
        query: { id: query }
      });
    },
    infinite(done) {
      this.page++; //每当向上滑动的时候就让页数加1
      this.$refs.my_scroller.finishPullToRefresh();
      // this.$refs.my_scroller.noDataText = "";
      this.getDataInfo();
    },
    refresh(done) {
      //这是向下滑动的时候请求最新的数据
      // this.$refs.my_scroller.noDataText = "";
      this.getDataInfo();
      this.$refs.my_scroller.finishPullToRefresh();
    }
  }
};
</script>
<style scoped>
.my-app {
  background: #f4f1f4;
  /* max-width: 7.5rem; */
  width: 100%;
  /* height: 750px; */
  height: 100vh;
}
.main {
  background: #fff;
}

.flex_box_row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.flex_box_column {
  display: flex;
  flex-direction: column;
  width: 90%;
  margin-left: 10px;
}

.fonts1 {
  font-size: 16px;
  height: 25px;
  line-height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.fonts2 {
  height: 25px;
  width: 100%;
  line-height: 25px;
  font-size: 12px;
  color: #b3b3b3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-bottom: 1px solid #ddd;
}

.fonts4 {
  font-size: 16px;
  color: rgba(252, 252, 252, 1);
  font-weight: 400;
}

.SearchBg {
  display: flex;
  flex-direction: row;
  height: 60px;
  line-height: 60px;
  width: 100%;
  padding: 0 10px;
  background: linear-gradient(
    -90deg,
    rgba(54, 105, 248, 1),
    rgba(77, 142, 250, 1)
  );
}

.el-input .el-input--prefix /deep/ .el-input__inner {
  background-color: #3467e0;
  border-radius: 25px;
}
.history_main {
  padding: 20px;
}
.history_title {
  font-size: 16px;
  font-weight: 500;
  color: #404040;
}
.history_box {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  justify-content: flex-start;
}
.history_item {
  border-radius: 3px;
  padding: 6px 8px;
  font-size: 16px;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  background: rgba(230, 230, 230, 1);
  margin-right: 20px;
  margin-bottom: 15px;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.history_del {
  font-size: 14px;
  text-align: center;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}

.del_icon {
  display: inline-block;
  width: 15px;
  height: 15px;
  background: url(./images/delIcon.png) no-repeat center;
  background-size: 100%;
  position: relative;
  top: 3px;
}
</style>
<style>
.SearchBg .el-input__inner {
  background-color: #3467e0;
  border-radius: 25px;
  border: 0;
  color: #fcfcfc;
}
</style>