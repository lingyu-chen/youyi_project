<template>
  <div class="twoDtothreeD-container">
    <div class="to-left">
      <div class="panel-white">
        <img src="../assets/image 4.png" alt="">
      </div>
    </div>
    <div class="to-right">
      <div class="prompt">
        <span>Prompt 提示词</span>
        <el-input
        class="input-text"
        type="textarea"
        :rows="4"
        placeholder="请输入您的提示词。"
        v-model="detail.prompt">
       </el-input>
      </div>
      <div class="ai-rate">
        <div class="rate-content">
          <span class="rate-text">AI影响率</span>
          <span class="rate-value">{{showPercentage}}%</span>        
        </div>
        <div>
            <!-- <Progress v-on:rate="getRateValue" :RateValue = "percentage"></Progress> -->
            <Progress v-on:rate="getRateValue"></Progress>
        </div>
      </div>
      <div class="style-list">
          <div class="style-reference">风格参照</div>
          <el-select v-model="value1" placeholder="请选择" style="color: #ff0000;" :popper-append-to-body="false">
            <el-option
              v-for="item in options"
              :key="item.sid"
              :label="item.name"
              :value="item.sid">
            </el-option>
          </el-select>
      </div>
      <div class="reference-image">
        <div class="image-text">参考图片</div>
        <el-upload
          class="upload-demo"
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple>
          <!-- <i class="el-icon-upload"></i> -->
          <img src="../assets/upload.png" alt="">
          <div class="el-upload__text">点击/拖拽 来上传图片 (jpeg, png)</div>
          <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
        </el-upload>
      </div>
      <div class="history-record">
        <div class="history-text">历史记录</div>
        <div class="history-images">
          <div class="img-hover" >
            <img src="../assets/HistoryImg.png" alt="" class="history-img">
            <div class="hover-gray">
              <img src="../assets/Vector.png" alt="" class="vector-img">
            </div>
          </div>
          <!-- <div class="img-hover">
            <img src="../assets/HistoryImg.png" alt="" class="history-img">
            
          </div>
          <div class="img-hover">
            <img src="../assets/HistoryImg.png" alt="" class="history-img">
          </div>
          <div class="img-hover">
            <img src="../assets/HistoryImg.png" alt="" class="history-img">
          </div> -->
        </div>
      </div>
      <div class="generation-scheme">
         <el-button>AI 生成方案</el-button>
      </div>
     
    </div>
  </div>
</template>

<script>
import Progress from './Progress.vue';
import {getStyleList,getProjectDetail,getHistoryList} from '@/api/index'
export default {
  components:{
        // HelloWorld
        Progress
    },
  data() {
    return {
      textarea: '',
      percentage:0,//AI影响率
       options:[],//风格列表
       value1: '',
       type:this.$route.params.type,//项目类型
       id:this.$route.params.id,//项目id
       detail:{},//项目详情
       history:[],//历史记录图片
    }
  },
  mounted() {
    console.log("type(TwoDGeneration)=",this.type);
    //获取风格列表
    getStyleList().then(response => {
        this.options = response.data.styles;
        console.log('请求成功了!options',this.options);
      },
      error => {
        console.log('请求失败了!',error);
      }
      );
      //获取项目详情
      getProjectDetail(this.$route.params.id).then(
        response => {
          this.detail = response.data;
          this.percentage = this.detail.aiRate;
          console.log("this.detail.aiRate=",this.detail.aiRate);
          this.$bus.$emit('getInitialPercntage',this.percentage);
          console.log("获取详情请求成功了！",this.detail);
        },
        error => {
          console.log('获取详情请求失败了!',error);
        }
      );
      //获取历史记录图片
      getHistoryList(this.$route.params.id).then(
        response => {
          this.history = response.data;
          console.log("获取历史记录图片请求成功了！",response);
        },
        error => {
          console.log('获取详情请求失败了!',error);
        }
      )
  },
  methods: {
    getRateValue(percentage){
      this.percentage = percentage;
    }
  },
  computed:{
    showPercentage(){
      if(this.percentage<1)
        return this.percentage*100;
      else
        return this.percentage;
    }
    
  }
}
</script>

<style lang="scss" scoped>

.twoDtothreeD-container{
  width: 100%;
  height: 100%;
  display: flex;
  color: #fff;
  font-family: AliMedium;
  .to-left{
    display: inline-block;
    width: 1552px;
    height: 996px;
    background-color: #d4d4d4;
    .panel-white{
      width: 1322px;
      height: 734px;
      background-color: #fff;
      margin: 75px 115px 187px 115px;
      img{
        margin: 87px 509px 60px 438px;
      }
    }
  }
  .to-right{
    display: inline-block;
    width: 368px;
    height: 996px;
    .prompt{
      height: 158px;
      border-bottom: 1px solid #3d3d3d;
      padding: 16px;
      font-size: 14px;
    }
    /deep/.el-textarea__inner{
      width: 336px;
      height: 131px;
      border-radius: 8px;
      background-color: #242425;
      border: 0px;
      padding: 10px 12px;
      margin-top: 8px;
      font-size: 12px;
      font-family: AliMedium;
      color: #b2b2b2;
    }
    /deep/.el-textarea__inner::placeholder {
      font-size: 12px;
      color: #b2b2b2; /* 修改为需要的颜色 */
    }
    .ai-rate{
      height: 51px;
      border-bottom: 1px solid #3d3d3d;
      padding: 16px;
      font-size: 14px;
      
      .rate-content{
        display: flex;
        justify-content: space-between;
      }
    }
    .style-list{
      height: 63px;
      border-bottom: 1px solid #3d3d3d;
      padding: 16px 16px 15px 16px;
      .style-reference{
        font-size: 14px;
      }
      .el-select{
        width: 336px;
        height: 36px;
        margin-top: 8px;
        /deep/.el-input__inner{
          background-color: #242425;
          border: 0px;
          border-radius: 8px;
          font-size: 12px;
          font-family: AliRegular;
        }
        /deep/.el-input__inner::placeholder{
          font-size: 12px;
          font-family: AliRegular;
          color: #fff;
        }
        //修改单个的选项的样式
        // /deep/ .el-select-dropdown__item{
        //   background-color: #242425;
        //   color:#fff;
        // }
      }
    }
    .reference-image{
      height: 91px;
      border-bottom: 1px solid #3d3d3d;
      padding: 16px;
      .image-text{
        font-size: 14px;
      }
      .upload-demo{
        color: #b2b2b2;
        font-size: 12px;
        font-family: AliRegular;
        /deep/.el-upload-dragger{
          display: flex;
          align-items: center; /* 垂直居中 */
          justify-content: center;
          width: 336px;
          height: 64px;
          background-color: #242425;
          border-radius: 8px;
          border: 0px;
          margin-top: 8px;
          .el-upload__text{
            margin-left: 4px;
            color: #b2b2b2;
            font-size: 12px;
            font-family: AliRegular;
          }
        }
      }
    }
    .history-record{
      padding: 16px 16px 24px 16px;
      .history-images{
        width: 320px;//336px-9px-7px
        height: 324px;//351px-8px-19px
        margin-top: 8px;
        border-radius: 8px;
        background-color: #242425;
        padding: 8px 7px 19px 9px;
        .img-hover{
          display: inline-block;
          position: relative;
          margin: 4px;
          .history-img{
            width:152px;
            height: 154px;
            border-radius: 4px;
            border: 0px;
          }
          .hover-gray{
            display: none;
            position: absolute;
            width:100%;
            height: 100%;
            left: 0;
            top: 0;
            background-color: #969696;
            z-index: 998;
            opacity: 0.41;
            .vector-img{
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%,-50%);
              opacity: 100%;
              z-index: 999;
            }
          }
          &:hover .hover-gray{
            display: block;
            cursor: pointer;
          }
        }
      }
    }
    .generation-scheme{
      display: flex;
      align-items: center; /* 垂直居中 */
      justify-content: center;
      .el-button{
        width: 336px;
        height: 48px;
        border-radius: 8px;
        background-color: #2400ff;
        border: 0px;
        color: #fff;
        font-size: 20px;
        font-family: AliMedium;
      }
    }
  }
}

</style>