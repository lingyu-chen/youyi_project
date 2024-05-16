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
        v-model="textarea">
       </el-input>
      </div>
      <div class="ai-rate">
        <div class="rate-content">
          <span class="rate-text">AI影响率</span>
          <span class="rate-value">90%</span>        
        </div>
        <div>
            <Progress v-on:rate="getRateValue" :getPercentage="percentage"></Progress>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Progress from './Progress.vue';
export default {
  components:{
        // HelloWorld
        Progress
    },
  data() {
    return {
      textarea: '',
      percentage:0,//AI影响率
    }
  },
  methods: {
    getRateValue(percentage){
      this.percentage = percentage;
    }
  },
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
    // .input-text{
    //   width: 336px;
    //   height: 131px;
    //   border-radius: 8px;
    // }
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
  }
}

</style>