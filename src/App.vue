<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <el-container>
      <el-header height="84px">
        <img src="./assets/优艺LOGO+白色标准字 1.png" alt="" class="logo">
        <div class="username">
          <img src="./assets/username.png" alt="">
          <div class="username-container">
            <div class="username-text">UserName</div>
            <div class="mail-text">UserName@yongyi.com </div>
          </div>
          
        </div>
      </el-header>
      <div class="line"></div>
      <el-main>
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
            <span class="span-item4"><img src="./assets/add.png" alt="">创建项目</span>
          </div>
        </div>
      </el-main>     
    </el-container>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import ListMain from './components/ListMain.vue';

import AllProjects from './assets/AllProjects.png';
import Generation from './assets/2DGeneration.png';
import AIRender from './assets/AIRender.png';
import twoDtothreeD from './assets/2Dto3D.png';

import AllProjectsSelected from './assets/AllProjectsSelected.png';
import GenerationSelected from './assets/2DGenerationSelected.png';
import AIRenderSelected from './assets/AIRenderSelected.png';
import twoDtothreeDSelected from './assets/2Dto3DSelected.png';

import Checkbox from './assets/Checkbox.png';
import CheckboxSelected from './assets/CheckboxSelected.png';

export default {
  name: 'App',
  components: {
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

<style lang="scss">
* {
  /* CSS Reset */
  margin: 0;
  padding: 0;
}
.clear:after{content:'';display:block;clear:both;height:0;overflow:hidden;visibility:hidden;}
.clear{zoom:1;}

.el-header {
  position: relative;
  top: 0;
  background-color: #151517;
  color: #333;
  // text-align: center;
  line-height: 84px;
  border-bottom: 1px solid #3D3D3D;
  .username{
    width: 173px;
    height: 32px;
    position: absolute;
    right: 32px;
    top: 26px;
    bottom: 26px;
    color:#fff;
    font-family: AliMedium;
    // display: flex;
    img{
      width: 24px;
      height: 24px;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      margin-right: 10px;
    }
    .username-container{
      display: inline-block;
      width: 139px;
      height: 32px;
      font-size: 12px;
      position: absolute;
      left: 34px;
      top: 0;
      .username-text{
        height: 16px;
        line-height: 16px;
      }
      .mail-text{
        height: 16px;
        line-height: 16px;
        color: #535353;
      }
    }
    
  }
}
.el-main {
  background-color: #151517;
  color: #333;
  // text-align: center;
  // line-height: 160px;
  position: absolute;
  top: 84px;
  bottom: 0;
  width: 100%;
  padding: 24px 32px;
  /* height: 100%; */
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
}

body > .el-container {
  /* margin-bottom: 40px; */
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.logo {
  position: absolute;
  left: 30px;
  top: 11px;
}
@font-face {
  font-family:AliMedium;
  src:url('./assets/font/AlibabaPuHuiTi-2-65-Medium.ttf')
}

/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
