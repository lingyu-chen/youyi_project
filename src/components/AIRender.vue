<template>
  <div class="AIRende-contaniner">
    <el-menu
          :default-active="activeIndex2"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          text-color="#535353"
          active-text-color="#000">
          <el-menu-item index="1"><img :src="key!=1?AllProjects:AllProjectsSelected" alt="" class="item-img">All Projects</el-menu-item>
          <el-menu-item index="2"><img :src="key!=2?Generation:GenerationSelected" alt="" class="item-img">2D Generation</el-menu-item>
          <el-menu-item index="3"><img :src="key!=3?AIRender:AIRenderSelected" alt="" class="item-img">AI Render</el-menu-item>
          <el-menu-item index="4"><img :src="key!=4?twoDtothreeD:twoDtothreeDSelected" alt="" class="item-img">2D to 3D</el-menu-item>
          <!-- <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item> -->
        </el-menu>
        <ListMain></ListMain>
        <!-- 悬停渐变 -->
        <div class="hover-gradient">
          <div class="footer-navigation" @select="handleSelectFooter">
            <span @click="handleSelectFooter(1)" class="span-item1" :style="{'color':select!=1?'#535353':'#fff'}"><img :src="select!=1?Checkbox:CheckboxSelected" alt="">2D Generation</span>
            <span @click="handleSelectFooter(2)" class="span-item2" :style="{'color':select!=2?'#535353':'#fff'}"><img :src="select!=2?Checkbox:CheckboxSelected" alt="">AI Render</span>
            <span @click="handleSelectFooter(3)" class="span-item3" :style="{'color':select!=3?'#535353':'#fff'}"><img :src="select!=3?Checkbox:CheckboxSelected" alt="">2D to 3D</span>
            <span class="span-item4"><img src="../assets/add.png" alt="">创建项目</span>
          </div>
        </div>
  </div>
</template>

<script>

import ListMain from './ListMain.vue';

import AllProjects from '../assets/AllProjects.png';
import Generation from '../assets/2DGeneration.png';
import AIRender from '../assets/AIRender.png';
import twoDtothreeD from '../assets/2Dto3D.png';

import AllProjectsSelected from '../assets/AllProjectsSelected.png';
import GenerationSelected from '../assets/2DGenerationSelected.png';
import AIRenderSelected from '../assets/AIRenderSelected.png';
import twoDtothreeDSelected from '../assets/2Dto3DSelected.png';

import Checkbox from '../assets/Checkbox.png';
import CheckboxSelected from '../assets/CheckboxSelected.png';
export default {
    name: 'AIRender',
    components:{
        // HelloWorld
        ListMain
    },
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '3',
        AllProjects,//未选中时的图片路径
        Generation,
        AIRender,
        twoDtothreeD,
        AllProjectsSelected,//选中时的图片路径
        GenerationSelected,
        AIRenderSelected,
        twoDtothreeDSelected,
        Checkbox,//底部选择项
        CheckboxSelected,
        key:3,//用于存放选中时的key
        select:3,//用于存放选中时的第几个选项（底部）
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        this.key = key;
        // if(key == 1)
        //   console.log("true");
        console.log(key, keyPath);
      },
      handleSelectFooter(select) {
        this.select = select;
        // console.log(select);
      }
    }
}
</script>

<style lang="scss" scoped>
.AIRender-container{
    padding: 24px 20px;
}
.el-menu-demo{
    width: 573px;
    height: 48px;
    border-bottom: 0;
    border-radius: 46px;
    padding: 0px 31px;/*13.5px*/
    color: #535353;
    background-color:#212123;
    font-family: AliMedium;
    font-size: 18px;
    margin-left: 12px;
    .el-menu-item{
      padding: 0 17.5px;
      height: 48px;
      line-height: 48px;
      border-radius: 24px;
      border-bottom: 0;
      // z-index: 999;
      .item-img{
        width: 24px;
        height: 24px;
        margin-right: 8px;
      }
    }
    .is-active{
      background-color: #fff;
      border-radius: 24px;
    }
    .el-menu-item:hover{
      background-color: #fff;
      border-radius: 24px;
      border-bottom: 0;
    }
  }
  .hover-gradient{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 328px;
    background: linear-gradient(to bottom, transparent 31%, #000);
    color: #535353;
    padding: 10px 0;
    // text-align: center;
    .footer-navigation{
      width: 579px;
      height: 64px;
      line-height: 64px;
      background-color: #212123;
      border-radius: 32px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 33px;
      padding: 0 8px 0 23px;
      font-family: AliMedium;
      font-size: 18px;
      .span-item1{
        margin-right: 24px;
        img{
          margin-right: 8px;
        }
      }
      .span-item2{
        margin-right: 24px;
        img{
          margin-right: 8px;
        }
      }
      .span-item3{
        margin-right: 28px;
        img{
          margin-right: 8px;
        }
      }
      .span-item4{
        // display: inline-block;
        width: 111px;
        height: 28px;
        line-height: 48px;
        font-size: 20px;
        color: #fff;
        padding: 10px 18px;
        margin-top: 8px;
        margin-bottom: 8px;
        background-color: #2400ff;
        border-radius: 24px;
        // display: flex;
        // align-items: center; /* 垂直居中 */
        img{
          margin-right: 4px;
          vertical-align: middle 
        }
      }
    }
  }
</style>