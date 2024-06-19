<template>
  <div>
    <el-container>
      <el-header height="84px">
        <div class="header-left">
          <img src="../assets/优艺LOGO+白色标准字 1.png" alt="" class="logo">
          <div class="project-name-btn" v-if="showbtn">
            <img src="../assets/gobackbtn.png" alt="" class="go-back-btn" @click="goback()">
            <span style="color: #3d3d3d; margin: 0 8px;">/</span>
            <span class="project-name">{{projectName}}</span>
          </div>
        </div>
        
        
        <div class="username">
          <img :src=userInfo.iconLink alt="">
          <div class="username-container">
            <div class="username-text">{{userInfo.username}}</div>
            <div class="mail-text">{{userInfo.email}} </div>
          </div>
          
        </div>
      </el-header>
      <div class="line"></div>
      <el-main>
        <router-view><Index></Index></router-view> 
        <!-- <TwoDToThreeD></TwoDToThreeD> -->
      </el-main>     
    </el-container>
  </div>
</template>
<script>
// import HelloWorld from './components/HelloWorld.vue'
import Index from './Index.vue';
import TwoDGeneration from './TwoDGeneration.vue';

import {getUserInfo} from '@/api/index'

export default {
  name: 'App',
  components: {
    // HelloWorld
    Index,
    TwoDGeneration
  },
  data() {
      return {
        userInfo:{},//用户信息
      };
    },
    methods: {
      goback(){
        this.$router.go(-1);
      }
    },
    mounted() {
      // console.log("Home页面")
      getUserInfo().then(response => {
        this.userInfo = response.data;
        console.log('请求成功了!用户信息：',response);
      },
      error => {
        console.log('请求失败了!',error);
      }
      );
    },
    computed:{
      projectName(){
        // console.log("Home this.$route.params.name:",this.$route.params.name)
        return this.$route.query.name;
      },
      showbtn(){
        console.log("Home this.$route.path.includes('/home/generation'):",this.$route.path.includes('/home/generation'))
        return this.$route.path.includes('/home/generation') 
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


/* 隐藏浏览器自带的滚动条 */
::-webkit-scrollbar {
  width: 0 !important;
}
::-webkit-scrollbar {
  width: 0 !important;height: 0;
}

.el-header {
  position: relative;
  top: 0;
  background-color: #151517;
  color: #333;
  line-height: 84px;
  border-bottom: 1px solid #3D3D3D;
  .project-name-btn{
    display: inline-block;
    padding: 13px 0 13px 19px;
    border-left: 1px solid #3d3d3d;
    height: 14.5px;
    line-height: 14.5px;
    margin-left: 23px;
    margin-top: 9px;
    // .go-back-btn{
    //   margin-right: 8px;
    // }
    .project-name{
      color: #fff;
      font-family: AliMedium;
      font-size: 20px;
    }
  }
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
  padding: 0;
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

.header-left {
  position: absolute;
  left: 30px;
  top: 11px;
  display: flex;
  align-items: center;
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