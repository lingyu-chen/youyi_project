<template>
  <div class="AIRender-container">
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      ref="menuHeight"
      mode="horizontal"
      @select="handleSelect"
      text-color="#535353"
      active-text-color="#000"
    >
      <el-menu-item index="1" @click="selectType('')"
        ><img
          :src="key != 1 ? AllProjects : AllProjectsSelected"
          alt=""
          class="item-img"
        />All Projects</el-menu-item
      >
      <el-menu-item
        index="2"
        @click="selectType('picgen')"
        v-show="isGeneration()"
        ><img
          :src="key != 2 ? Generation : GenerationSelected"
          alt=""
          class="item-img"
        />2D Generation</el-menu-item
      >
      <el-menu-item
        index="3"
        @click="selectType('airender')"
        v-show="isAIRender()"
        ><img
          :src="key != 3 ? AIRender : AIRenderSelected"
          alt=""
          class="item-img"
        />AI Render</el-menu-item
      >
      <el-menu-item index="4" @click="selectType('picto3d')" v-show="isTwo()"
        ><img
          :src="key != 4 ? twoDtothreeD : twoDtothreeDSelected"
          alt=""
          class="item-img"
        />2D to 3D</el-menu-item
      >
      <!-- <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item> -->
    </el-menu>
    <ListMain :typeValue="typeValue"></ListMain>
    <!-- 悬停渐变 -->
    <div class="hover-gradient-low" ref="hoverHeight"></div>
    <div class="hover-gradient">
      <div class="footer-navigation" @select="handleSelectFooter">
        <span
          @click="handleSelectFooter(1, 'picgen')"
          class="span-item1"
          :style="{ color: select != 1 ? '#535353' : '#fff' }"
          v-show="isGeneration()"
          ><img :src="select != 1 ? Checkbox : CheckboxSelected" alt="" />2D
          Generation</span
        >
        <span
          @click="handleSelectFooter(2, 'airender')"
          class="span-item2"
          :style="{ color: select != 2 ? '#535353' : '#fff' }"
          v-show="isAIRender()"
          ><img :src="select != 2 ? Checkbox : CheckboxSelected" alt="" />AI
          Render</span
        >
        <span
          @click="handleSelectFooter(3, 'picto3d')"
          class="span-item3"
          :style="{ color: select != 3 ? '#535353' : '#fff' }"
          v-show="isTwo()"
          ><img :src="select != 3 ? Checkbox : CheckboxSelected" alt="" />2D to
          3D</span
        >
        <span
          class="span-item4"
          @click="createProject()"
          v-if="isGeneration() || isAIRender() || isTwo()"
          ><img src="../assets/add.png" alt="" />创建项目</span
        >
        <span
          class="span-item4"
          v-else
          style="background: #969696; cursor: not-allowed"
          ><img src="../assets/add.png" alt="" />创建项目</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import ListMain from "./ListMain.vue";

import AllProjects from "../assets/AllProjects.png";
import Generation from "../assets/2DGeneration.png";
import AIRender from "../assets/AIRender.png";
import twoDtothreeD from "../assets/2Dto3D.png";

import AllProjectsSelected from "../assets/AllProjectsSelected.png";
import GenerationSelected from "../assets/2DGenerationSelected.png";
import AIRenderSelected from "../assets/AIRenderSelected.png";
import twoDtothreeDSelected from "../assets/2Dto3DSelected.png";

import Checkbox from "../assets/Checkbox.png";
import CheckboxSelected from "../assets/CheckboxSelected.png";

import { projectCreate, getFeatureLists } from "@/api/index";

export default {
  name: "AIRender",
  components: {
    // HelloWorld
    ListMain,
  },
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1", //导航栏选中时
      AllProjects, //未选中时的图片路径
      Generation,
      AIRender,
      twoDtothreeD,
      AllProjectsSelected, //选中时的图片路径
      GenerationSelected,
      AIRenderSelected,
      twoDtothreeDSelected,
      Checkbox, //底部选择项
      CheckboxSelected,
      key: 1, //用于存放选中时的key
      select: 1, //用于存放选中时的第几个选项（底部）
      typeValue: "", //顶部导航栏选中时的type类型
      typeVal: "picgen", //创建项目时选中的类型
      features: [], //功能列表
      randomId: 1,
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      this.key = key;
      // if(key == 1)
      //   console.log("true");
      console.log(key, keyPath);
    },
    handleSelectFooter(select, type) {
      this.select = select;
      this.typeVal = type;
      console.log(select, type);
    },
    selectType(type) {
      console.log("type:", type);
      this.typeValue = type;
    },
    createProject() {
      console.log("createProject type:", this.typeVal);
      const data = {
        type: this.typeVal,
        name: "newtestproject" + this.randomId++,
      };
      projectCreate(data).then(
        async (response) => {
          console.log("请求成功了!", response);
          const dataRes = await response.data;
          await this.$router.push({
            path: "/home/generation",
            query: { type: data.type, id: dataRes.projectId, name: data.name },
          });
          //console.log('请求成功了this.projectList!',this.projectList);
        },
        (error) => {
          console.log("请求失败了!", error);
        }
      );
      console.log("select:", this.select);
    },
    isGeneration() {
      console.log(
        "picgen",
        this.features.some((item) => item.id === "picgen")
      );
      return this.features.some((item) => item.id === "picgen");
      // return false;
    },
    isAIRender() {
      console.log(
        "airender",
        this.features.some((item) => item.id === "airender")
      );
      return this.features.some((item) => item.id === "airender");
      // return false;
    },
    isTwo() {
      console.log(
        "picto3d",
        this.features.some((item) => item.id === "picto3d")
      );
      return this.features.some((item) => item.id === "picto3d");
      // return false;
    },
  },
  mounted() {
    //获取功能列表
    setTimeout(() => {}, 8000); //等待6秒钟，在首页获得最新的（在详情页有修改，并在返回时保存）项目名称
    getFeatureLists().then(
      (response) => {
        this.features = response.data.features;
        console.log("请求成功了!", response);
      },
      (error) => {
        console.log("请求失败了!", error);
      }
    );
    this.$store.commit(
      "GETMENUHEIGHT",
      this.$refs.menuHeight.$el.offsetHeight +
        this.$refs.menuHeight.$el.offsetTop
    );
    console.log(
      "menu高度:",
      this.$refs.menuHeight.$el.offsetHeight,
      this.$refs.menuHeight.$el.offsetTop
    );
  },
};
</script>

<style lang="scss" scoped>
.AIRender-container {
  padding: 0px 20px;
}
.el-menu-demo {
  display: inline-block;
  margin-top: 24px;
  // width: 573px;
  height: 48px;
  border-bottom: 0;
  border-radius: 46px;
  padding: 0px 31px; /*13.5px*/
  color: #535353;
  background-color: #212123;
  font-family: AliMedium;
  font-size: 18px;
  margin-left: 12px;
  .el-menu-item {
    padding: 0 17.5px;
    height: 48px;
    line-height: 48px;
    border-radius: 24px;
    border-bottom: 0;
    // z-index: 999;
    .item-img {
      width: 24px;
      height: 24px;
      margin-right: 8px;
    }
  }
  .is-active {
    background-color: #fff;
    border-radius: 24px;
  }
  .el-menu-item:hover {
    background-color: #fff;
    border-radius: 24px;
    border-bottom: 0;
  }
}
.hover-gradient-low {
  //蒙版区域
  pointer-events: none; //点击不到，点击会穿透触发到下层的元素
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 328px;
  background: linear-gradient(to bottom, transparent 31%, #000);
  color: #535353;
  padding: 10px 0;
}
.hover-gradient {
  display: flex;
  justify-content: center;
  // pointer-events: none;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  // height: 328px;
  // background: linear-gradient(to bottom, transparent 31%, #000);
  // color: #535353;
  padding: 10px 0;
  // text-align: center;
  .footer-navigation {
    display: inline-block;
    // width: 579px;
    height: 64px;
    line-height: 64px;
    background-color: #212123;
    border-radius: 32px;
    position: absolute;
    // left: 50%;
    // transform: translateX(-50%);
    bottom: 33px;
    padding: 0 8px 0 23px;
    font-family: AliMedium;
    font-size: 18px;
    .span-item1 {
      margin-right: 24px;
      img {
        margin-right: 8px;
      }
    }
    .span-item2 {
      margin-right: 24px;
      img {
        margin-right: 8px;
      }
    }
    .span-item3 {
      margin-right: 28px;
      img {
        margin-right: 8px;
      }
    }
    .span-item4 {
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
      cursor: pointer;
      // display: flex;
      // align-items: center; /* 垂直居中 */
      img {
        margin-right: 4px;
        vertical-align: middle;
      }
    }
  }
}
@media screen and (max-width: 683px) {
  .el-menu-demo {
    padding: 0px 16px; /*13.5px*/
    .el-menu-item {
      padding: 0 16px;
      .item-img {
        width: 24px;
        height: 24px;
        margin-right: 1.5px;
      }
    }
  }
}
</style>