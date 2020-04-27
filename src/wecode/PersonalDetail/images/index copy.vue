<template>
  <div class="app">
    <div>
      <div class="lineStyle">
        <span class="title">头像</span>
        <img :src="photoUrl?photoUrl:defaultImg" class="imgStyle" />
      </div>
      <div class="lineStyle">
        <span class="title">姓名</span>
        <span class="textAlign">{{ name }}</span>
      </div>
      <div class="lineStyle">
        <span class="title">车型</span>
        <span class="textAlign1" v-if="showContent">{{input}}</span>
        <div style="float: right; width: 60%;" v-else>
          <el-input
            size="mini"
            v-model="input"
            maxlength="32"
            placeholder="请输入品牌"
            style="width: 50%"
          ></el-input>-
          <el-input
            size="mini"
            v-model="inputType"
            maxlength="32"
            placeholder="请输入车型"
            style="width: 44%"
          ></el-input>
        </div>
      </div>
      <div class="lineStyle">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item prop="input1">
            <span class="title">汽车VIN</span>
            <span class="textAlign1" v-if="showContent">{{ruleForm.input1}}</span>
            <el-input
              size="mini"
              prop="input1"
              v-model="ruleForm.input1"
              maxlength="17"
              placeholder="请输入内容"
              style="width: 50%;float: right;"
              v-else
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-button class="btnStyle" v-if="showContent" @click="showContentFn">
        <p style="color:rgba(255,255,255,1)">编 辑</p>
      </el-button>
      <el-button class="btnStyle" v-else @click="showContentFn1('ruleForm')">
        <p style="color:rgba(255,255,255,1)">完成编辑</p>
      </el-button>
    </div>
  </div>
</template>

<script>
import "../../../libs/flexible.js";
import util from "../../../libs/util";
export default {
  data() {
    var VINPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入汽车VIN"));
      } else {
        var pattern = /[^A-HJ-NPR-Z\d]/g;
        if (pattern.test(value)) {
          return callback("请输入正确的汽车VIN");
        } else if (value.length !== 17) {
          return callback("请输入正确的汽车VIN");
        } else {
          callback();
        }
      }
    };
    return {
      name: "",
      input: "捷豹",
      ruleForm: {
        input1: ""
      },
      inputType: "XEL",
      showContent: true,
      photoUrl: "",
      defaultImg: require("./images/person.png"),
      rules: {
        input1: [{ validator: VINPass, trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.getItem();
  },
  methods: {
    getItem() {
      document.title = "个人信息";
      let _this = this;
      util
        .requestget(global.API_PREFIX + "/api/v1/user/getUserInfo")
        .then(function(res) {
          _this.name = res.data.data.name;
          _this.photoUrl = res.data.data.photoUrl;
          _this.ruleForm.input1 = res.data.data.vinCode;
        }).catch(err => {
          console.log(err);
        });
    },
    dealParam() {
      let params = {};
      params.carType = this.input + "-" + this.inputType;
      params.appUserId = window.localStorage["appUserId"];
      params.vinCode = this.ruleForm.input1;
      return params;
    },
    showContentFn() {
      this.showContent = false;
    },
    showContentFn1(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.showContent = true;
          let _this = this;
          let param = this.dealParam();
          util
            .request(
              global.API_PREFIX + "/api/v1/user/modifyUserInfo",
              param
            )
            .then(function(res) {
              if (res.data.code === 0) {
                _this.$message.success("修改成功！");
              } else {
                _this.$message.error("修改失败！");
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.app {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
}
.textShow {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 4.76rem;
}
.imgStyle {
  width: 0.92rem;
  height: 0.92rem;
  border-radius: 50%;
  float: right;
  margin-right: 0.5rem;
  margin-top: 0.25rem;
}
.btnStyle {
  width: 6.67rem !important;
  height: 0.78rem;
  background: linear-gradient(
    -90deg,
    rgba(54, 105, 248, 1),
    rgba(77, 142, 250, 1)
  );
  border-radius: 0.39rem;
  margin-top: 14px;
}
.textAlign {
  float: right;
  margin-right: 0.5rem;
  color: #4784f9;
  opacity: 0.5;
  font-size: 0.32rem;
}
.textAlign1 {
  float: right;
  margin-right: 0.5rem;
  color: #4784f9;
  font-size: 0.32rem;
}
.lineStyle {
  width: 7.5rem;
  height: 1.35rem;
  background: rgba(254, 254, 254, 1);
  line-height: 1.35rem;
}
.title {
  font-size: 0.35rem;
  color: rgba(102, 102, 102, 1);
  margin-left: 0.5rem;
}
.btnStyle {
  width: 6.67rem !important;
  height: 0.78rem;
  background: linear-gradient(
    -90deg,
    rgba(54, 105, 248, 1),
    rgba(77, 142, 250, 1)
  );
  border-radius: 0.39rem;
  margin-top: 14px;
  margin-left: 0.5rem;
}
</style>