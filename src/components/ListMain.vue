<template>
  <div class="row">
    <div class="list" v-for="index of 6" :key="index">
        <img src="../assets/图片11.png" alt="" class="list-image">  
        <div class="text-container">
          <div class="text-content">
            <span class="text-common project-name">项目名称 #1</span>
            <span class="text-common edit-time">编辑于 1分钟 以前</span>
          </div>
          <div class="icon-more">
            <i class="el-icon-more" style="transform: rotate(90deg);"></i>
          </div>          
          <!-- 三个点 -->
        </div>
    </div>
    <div class="list">
        <img src="../assets/图片11.png" alt="" class="list-image">  
        <div class="text-container">
          <div class="text-content">
            <span class="text-common project-name">项目名称 #1</span>
            <span class="text-common edit-time">编辑于 1分钟 以前</span>
          </div>
          <div class="icon-more">
            <i class="el-icon-more" style="transform: rotate(90deg);"></i>
          </div>          
          <!-- 三个点 -->
        </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
* {
  /* CSS Reset */
  margin: 0;
  padding: 0;
}

.row {
  
}
.list{
  display: inline-block;
  background-color: #242425;
  width: 446px;
  height: 256px;
  border-radius: 16px;
  margin: 24px 12px 12px 0;
  border:0px;
  // margin-top: 24px;
  .list-image{
    display: block;
    width: 446px;
    height: 200px;
    border-radius: 16px 16px 0 0 ;
  }
  .text-container{
    height: 56px;
    line-height: 56px;
    display: flex;
    .text-content{
      width: 384px;
      // height: 56px;
      margin-left: 16px;
      .text-common{
        display: block;
        text-align: left;
      }
      .project-name{
        height: 22px;
        line-height: 22px;
        font-size: 16px;
        font-family: AliMedium;
        color: #fff;
        margin-top: 6px;
      }
      .edit-time{
        height: 16px;
        line-height: 16px;
        font-size: 12px;
        font-family: AliMedium;
        color: #535353;
      }
    }
    .icon-more{
      color: #fff;
      font-size: 24px;
      text-align: center;
    }
  }
}
</style>