<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <!-- <el-container>
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
        <AIRender></AIRender>
        <TwoDToThreeD></TwoDToThreeD> 
      </el-main>     
    </el-container> -->
    <router-view>
      <!-- <Home></Home> -->
    </router-view>
    
  </div>
</template>

<script>
import Home from './components/Home.vue'
// import HelloWorld from './components/HelloWorld.vue'
import Index from './components/Index.vue';
import TwoDGeneration from './components/TwoDGeneration.vue';

import axios from 'axios'

export default {
  name: 'App',
  components: {
    // HelloWorld
    Index,
    TwoDGeneration,
    Home
  },
  data() {
      return {

      };
    },
    methods: {

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


/* 隐藏浏览器自带的滚动条 */
::-webkit-scrollbar {
  width: 0 !important;
}
::-webkit-scrollbar {
  width: 0 !important;height: 0;
}

// .el-header {
//   position: relative;
//   top: 0;
//   background-color: #151517;
//   color: #333;
//   line-height: 84px;
//   border-bottom: 1px solid #3D3D3D;
//   .username{
//     width: 173px;
//     height: 32px;
//     position: absolute;
//     right: 32px;
//     top: 26px;
//     bottom: 26px;
//     color:#fff;
//     font-family: AliMedium;
//     // display: flex;
//     img{
//       width: 24px;
//       height: 24px;
//       position: absolute;
//       left: 0;
//       top: 50%;
//       transform: translateY(-50%);
//       margin-right: 10px;
//     }
//     .username-container{
//       display: inline-block;
//       width: 139px;
//       height: 32px;
//       font-size: 12px;
//       position: absolute;
//       left: 34px;
//       top: 0;
//       .username-text{
//         height: 16px;
//         line-height: 16px;
//       }
//       .mail-text{
//         height: 16px;
//         line-height: 16px;
//         color: #535353;
//       }
//     }
    
//   }
// }
// .el-main {
//   background-color: #151517;
//   color: #333;
//   // text-align: center;
//   // line-height: 160px;
//   position: absolute;
//   top: 84px;
//   bottom: 0;
//   width: 100%;
//   padding: 0;
// }

// body > .el-container {
//   /* margin-bottom: 40px; */
//   position: relative;
//   height: 100vh;
//   display: flex;
//   flex-direction: column;
// }

// .el-container:nth-child(5) .el-aside,
// .el-container:nth-child(6) .el-aside {
//   line-height: 260px;
// }

// .el-container:nth-child(7) .el-aside {
//   line-height: 320px;
// }

// .logo {
//   position: absolute;
//   left: 30px;
//   top: 11px;
// }
@font-face {
  font-family:AliMedium;
  src:url('./assets/font/AlibabaPuHuiTi-2-65-Medium.ttf')
}
@font-face {
  font-family:AliRegular;
  src:url('./assets/font/AlibabaPuHuiTi-2-55-Regular.ttf')
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
