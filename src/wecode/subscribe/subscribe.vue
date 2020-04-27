<template>
    <div class="app">
        <!-- 预约充电 -->
        <div class="top_img"></div>
        
        <div class="btm">
          <div style="width:90%;margin:0 atuo;">
            <el-form ref="form" :model="form" label-width="40%" :rules="rules">
                <el-form-item label="选择预约时间段" prop="value">
                    <!-- <el-select v-model="form.value" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select> -->
                    <el-input v-model="form.value" @focus="inputFoucs"></el-input>
                </el-form-item>
            </el-form>
          </div>
            

            <el-dialog title="选择时间" :visible.sync="dialogFormVisible" width="4.32rem">
                <div>
                    <div v-for="(item, index) in options"
                    :key="index" class="opitem"
                    :class="{ checked: isActive==index }"
                    @click="timeChecked(index,item.value,item.label)">
                        <span>{{item.label}}</span>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false" size="medium">取 消</el-button>
                    <el-button type="primary" @click="submitTimeChecked" size="medium">确 定</el-button>
                </div>
            </el-dialog>

            <el-dialog
                title="预约成功"
                :visible.sync="centerDialogVisible"
                width="5rem"
                center>
                <div class="dialog_img"></div>
                
                <div class="dialog_success">预约成功</div>
                <div class="dialog_success_tip">请您在一小时内到达，若不能及时到达，<br/> 请您取消预约，否则将会被记为恶意预约。</div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="centerDialogVisible = false" size="medium">直接前往</el-button>
                    <el-button type="primary" @click="toHome" size="medium">开始导航</el-button>
                </span>
            </el-dialog>
        </div>
         
        <div class="button" @click="submit">
            完成预约
        </div>
    </div>
</template>

<script>
import util from "../../../libs/util";
import '../../../libs/flexible';
 export default {
    data() {
        return {
            value: '',
            dialogFormVisible: false,
            centerDialogVisible: false,
            isActive: 0,
            subscribeTime: '',
            reserveDuration: '',
            form: {
                value: ''
            },
            options: [
                {value: '15',label: '15分钟'},
                {value: '30',label: '30分钟'},
                {value: '45',label: '45分钟'},
                {value: '60',label: '60分钟'}
            ],
            rules:{
                name: [
                    { required: true, message: '请选择预约时间', trigger: 'change' }
                ],
            }
        };
    },
    mounted() {

    },
    methods: {
        timeChecked(index,value,label) {
            this.isActive = index;
            this.reserveDuration = value;
            this.subscribeTime = label;
        },
        inputFoucs() {
            this.dialogFormVisible = true;
            if (this.form.value) {
                // 如果有值的时候打开
                this.subscribeTime = this.form.value;
            } else {
                // 如果没有值的时候打开
                this.subscribeTime = '';
                this.reserveDuration = '';
            }
        },
        submitTimeChecked() {
            this.dialogFormVisible = false;
            if (this.subscribeTime=='') {
                this.form.value = this.options[this.isActive].label
            } else {
                this.form.value = this.subscribeTime;
            }
        },
        submit() {
            // 计算预约开始时间和预约结束时间
            var myDate = Date.parse(new Date()); // 当前时间时间戳
            // console.log(myDate);
            let reserveBeginTime = this.timeStamp(myDate); //当前时间
            console.log('预约开始时间',reserveBeginTime);
            let reserveEndTime = this.timeStamp(this.reserveDuration*60*1000+myDate); //预约结束时间
            console.log('预约结束时间',reserveEndTime);
            let params = {
                "appUserId": this.$route.query.appUserId,//APP用户ID
                "gunCode": this.$route.query.gunCode,//枪编号
                "chargingPileId": this.$route.query.chargingPileId,//充电桩ID
                "chargingPileName": this.$route.query.chargingPileName,//充电桩名称
                "reserveBeginTime": reserveBeginTime,//预约开始时间
                "reserveEndTime": reserveEndTime,//预约结束时间
                "reserveDuration": this.reserveDuration//预约时长
            };
            // 预约充电            
            util.request(
                global.API_PREFIX + "/api/v1/charging/reserve",
                params
            ).then(res=> {
                this.centerDialogVisible = true;
            }).catch(err => {
                this.$message.error(err);
            });
        },
        toHome() {
            // 直接导航去首页
            this.$router.push({
                path: '/weHome',
                query: {
                    id: this.$route.query.id,
                    latitude: this.$route.query.latitude,
                    longitude: this.$route.query.longitude
                }
            })
        },
        timeStamp(dateStamp){
            // 时间戳转换时间格式(2019-10-15 22:00:00)
            let date = new Date(dateStamp);
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
            let H = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            let Mi = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            let S = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
            let tempDate = Y + M + D + H + Mi + S;
            // console.log("时间戳转换", tempDate)
            return tempDate;
        }

    }
 };
</script>

<style lang="less" scoped>
.app {
  width: 100%;
  height: 100%;
  background-color: #E6E6E6;
}
.top_img{
  width: 100%;
  height: 3.69rem;
  background-image: url(./images/bg.png);
  background-repeat: no-repeat;
  background-size: cover;
}
.btm{
    width: 100%;
    margin-top: 1rem;
}
.select{
  width:6.7rem;
  margin: 0.5rem auto;
  background:rgba(252,252,252,1);
  box-shadow:0rem 0.06rem 0.11rem 0rem rgba(153,153,153,0.1);
  border-radius:0.14rem;
}
.button{
  width:6.67rem;
  height:0.78rem;
  background:linear-gradient(-90deg,rgba(54,105,248,1),rgba(77,142,250,1));
  border-radius:0.39rem;
  text-align: center;
  line-height: 0.78rem;
  color: #FFFFFF;
  margin: 0.5rem auto;
  font-size: 0.28rem;
}
.tip{
  font-size: 0.17rem !important;
  color: #5d5b5b;
  margin-top: 0.3rem;
  text-align: center;
}
.dialog_img{
  width: 1.63rem;
  height: 1.4rem;
  margin: 0 auto;
  background-image: url(./images/success.png);
  background-repeat: no-repeat;
  background-size: cover;
}
.dialog_success{
  font-size: 0.25rem;
  text-align: center;
  color: #4D4D4D;
}
.dialog_success_tip{
  font-size: 0.19rem;
  line-height: 0.28rem;
  text-align: center;
  color: #999999;
}
.opitem{
    display: block;
    height: 0.6rem;
    font-size: 0.25rem;
    line-height: 0.6rem;
    text-align: center;
}
.checked{
    color: #4784F9;
    font-size: 0.28rem;
    border-top: 0.015rem solid #dcdfe6;
    border-bottom: 0.015rem solid #dcdfe6;
}
</style>