<template>
  <div class="row">
    <div v-for="(item,index) in projectList" :key="index" class="project-list">
      <div class="list" v-if="item.status == 'RUNNING'" @click="jumpPage(item.type,item.id)">
        <div class="status-running">
          <el-progress type="circle" :percentage="80" :stroke-width="8" color="#fff"></el-progress> 
          <div class="project-name">{{item.name}}</div>
          <div class="time-remaining">模型生成中，剩余时间大约还有  {{dayjs.duration(getLeftTime(item.tasks), 'seconds').format('HH:mm:ss')}}</div>         
        </div>  
        <div class="text-container">
          <div class="text-content cancel-content">
            <span class="cancel-btn text-common project-name"><i class="el-icon-close"></i> 取消</span>
          </div>
        </div>
      </div>
      <div class="list" v-else @click="jumpPage(item.type,item.id)">
        <img :src="item.previewLink" alt="" class="list-image">  
        <div class="text-container">
          <div class="text-content">
            <span class="text-common project-name">{{item.name}}{{ item.type }}</span>
            <span class="text-common edit-time">编辑于 {{modifyTime(item.modifyTime)}}以前</span>
          </div>
          <div class="icon-more">
            <i class="el-icon-more" style="transform: rotate(90deg);"></i>
          </div>          
        </div>
      </div>
    </div>
    
    <div class="project-list" @click="jumpPage('picgen')">
      <div class="list" v-if="1 == 1">
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
      <div class="list" v-else></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

import {getProjectLists} from '../api/index'

export default {
  props:['typeValue'],
  data() {
    return {
      projectList:[],
      dayjs,
    }
  },
  methods: {
    getLeftTime(tasks)//获取RUNNING状态下的leftTime
    {
      for(var i=0;i<tasks.length;i++)
      {
        if(tasks[i].status == 'RUNNING')
        {
          return tasks[i].leftTime;
        }   
      }
    },
    jumpPage(type,id)
    {
      if(type == "picgen")
      {
        this.$router.push({ name: 'Generation', params: { type: type,id: id } });
      }
    },
    modifyTime(time)
    {
      var seconds = Math.floor((Date.now()-time)/1000);
      if(seconds<60)
        return seconds+"秒";
      else if(seconds<60*60) 
        return Math.floor(seconds/60)+"分钟";
      else if(seconds<60*60*24)
        return Math.floor(seconds/60/60)+"小时";
      else if(seconds<60*60*24*30)
        return Math.floor(seconds/60/60/24)+"天";
      else
        return Math.floor(seconds/60/60/24/30)+"月";
    }
  },
  mounted() {//http://localhost:8080/api/aigid/v1/project/list
    console.log("列表页面");
    getProjectLists("").then(
        response => {
          console.log('请求成功了!',response.data);
          this.projectList = response.data.items;
          //console.log('请求成功了this.projectList!',this.projectList);
      },
        error => {
          console.log('请求失败了!',error);
        }
      )
  },
  watch:{
     typeValue(newValue)
     {
       //console.log("typeValue:",newValue);
       getProjectLists(newValue).then(
         response => {
           console.log('请求成功了!',response.data);
           this.projectList = response.data.items;
           //console.log('请求成功了this.projectList!',this.projectList);
       },
         error => {
           console.log('请求失败了!',error);
         }
       )
    }
  },
  computed:{
    
  }
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
.project-list{
  display: inline-block;
  background-color: #242425;
  width: 446px;
  height: 256px;
  border-radius: 16px;
  margin: 24px 12px 0 12px;
  border:0px;
    .list{
      display: inline-block;
      // background-color: #242425;
      width: 446px;
      height: 256px;
      // border-radius: 16px;
      // margin: 24px 12px 0 12px;
      // border:0px;
      // margin-top: 24px;
      .status-running{
        display: flex;
        // justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 446px;
        height: 200px;
        /deep/.el-progress{
          margin-top: 28px;
          width: 96px !important;
          height: 96px !important;
          
          .el-progress-circle{
            width: 96px !important;
            height: 96px !important;
            transform: rotateY(180deg);
          }
          svg{
            width: 96px;
            height: 96px;
          }
          path:first-child { // 修改进度条背景色
            stroke: #535353;
          }
          .el-progress__text{
            font-family: AliMedium;
            font-size: 24px;
            color: #fff !important;
          }
        }
        .project-name{
          display: block;
          color: #fff;
          margin-top: 16px;
          font-size: 16px;
          font-family: AliMedium;
          height: 22px;
          line-height: 22px;
        }
        .time-remaining{
          margin-top: 8px;
          font-size: 12px;
          font-family: AliRegular;
          color: #535353;
        }
      }
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
          display: block;
          font-size: 12px;
          font-family: AliMedium;
          color: #535353;
          height: 16px;
          line-height: 16px;
        }
      }
      .cancel-content{
        display: flex;
        justify-content: center;
        width: 100%;
        margin-left: 0px;
        //取消按钮
        .cancel-btn{
          display: inline-block;
          margin-top: 2px;
          width: 70px;
          height: 30px;
          line-height: 30px;
          background-color: #2400ff;
          text-align: center;
          border-radius: 15px;
          font-size: 14px;
          font-family: AliMeidium;
        }
      }
      .icon-more{
        color: #fff;
        font-size: 24px;
        text-align: center;
      }
    }
  }
}

</style>