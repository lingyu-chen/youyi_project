<template>
  <div
    class="row-scroll"
    :style="{ height: 82 + 'vh' }"
    ref="scrollBox"
    @scroll="loadMore"
  >
    <div class="row">
      <div
        v-for="(item, index) in projectList"
        :key="index"
        class="project-list"
      >
        <div
          class="list"
          v-if="item.status == 'RUNNING'"
          @click="jumpPage(item.type, item.id, item.name)"
          style="cursor: pointer"
        >
          <div class="status-running">
            <el-progress
              type="circle"
              :percentage="getProgress(item.tasks)"
              :stroke-width="8"
              color="#fff"
            ></el-progress>
            <div class="project-name">{{ item.name }}</div>
            <div class="time-remaining">
              模型生成中，剩余时间大约还有
              {{
                dayjs
                  .duration(getLeftTime(item.tasks), "seconds")
                  .format("HH:mm:ss")
              }}
            </div>
          </div>
          <div class="text-container">
            <div
              class="text-content cancel-content"
              @click.stop="listCancel(item.tasks, index)"
            >
              <span class="cancel-btn text-common project-name"
                ><i class="el-icon-close"></i> 取消</span
              >
            </div>
          </div>
        </div>
        <div class="list" v-else>
          <img
            :src="item.previewLink"
            alt=""
            class="list-image"
            @click="jumpPage(item.type, item.id, item.name)"
            style="cursor: pointer"
          />
          <div class="text-container">
            <div class="text-content">
              <span class="text-common project-name"
                >{{ item.name }}&nbsp;&nbsp;--{{ item.type }}</span
              >
              <span class="text-common edit-time"
                >编辑于 {{ modifyTime(item.modifyTime) }}以前</span
              >
            </div>
            <div class="icon-more" style="cursor: pointer">
              <i class="el-icon-more" style="transform: rotate(90deg)"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

import { getProjectLists, cancelTask, findTaskStatus } from "../api/index";

export default {
  props: ["typeValue"],
  data() {
    return {
      projectList: [],
      dayjs,
      leftTime: 0, //RUNNING状态下的剩余时间
      currentPage: 1, //当前页面
      pagesize: 20, //页面大小
      lastPage: false, // 判断是否最后一页,如果最后一页就不再发送请求
      rowScrollHeight: 0, //
    };
  },
  methods: {
    loadMore() {
      let scrollDom = this.$refs.scrollBox;
      if (
        scrollDom.clientHeight + scrollDom.scrollTop + 1 >=
        scrollDom.scrollHeight
      ) {
        this.currentPage++; //页数加一
        this.getProjectData(); //发送请求获取数据
      }
    },
    getProjectData() {
      if (!this.lastPage) {
        //发送请求
        this.getProjectsList();
      }
    },
    getProjectsList() {
      getProjectLists({ type: "", pagenum: this.currentPage }).then(
        (response) => {
          console.log("请求成功了!", response.data);
          // this.projectList = response.data.items;
          this.projectList.push(...response.data.items);
          if (response.data.items.length < this.pagesize) {
            //一页总共36条数据，小于36条时，表示是最后一页了
            this.lastPage = true;
          }
          this.setTimer(); //定时器开启
          console.log("请求成功了this.projectList!", this.projectList);
        },
        (error) => {
          console.log("请求失败了!", error);
        }
      );
    },
    getLeftTime(
      tasks //获取RUNNING状态下的leftTime
    ) {
      console.log("getLeftTime:", tasks);
      for (var i = 0; i < tasks.length; i++) {
        if (
          tasks[i].status == "RUNNING" ||
          tasks[i].status == "READY" ||
          tasks[i].status == "UPLOADING"
        ) {
          this.leftTime = tasks[i].leftTime;
          // console.log("getLeftTime:",tasks[i].leftTime)
          return tasks[i].leftTime;
        }
      }
    },
    getProgress(tasks) {
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].status === "RUNNING" || "READY" || "UPLOADING") {
          // this.leftTime = tasks[i].leftTime;
          // console.log("getLeftTime:",tasks[i].leftTime)
          return Math.round(tasks[i].progress * 100);
        }
      }
    },
    jumpPage(type, id, name) {
      console.log("jumpPage name:", name);
      if (type === "picgen") {
        this.$router.push({
          path: "/home/generation",
          query: { type: type, id: id, name: name },
        });
      } else if (type === "airender") {
        this.$router.push({
          path: "/home/airender",
          query: {
            type: type,
            id: id,
            name: name,
          },
        });
      }
    },
    modifyTime(time) {
      var seconds = Math.floor((Date.now() - time) / 1000);
      if (seconds < 60) return seconds + "秒";
      else if (seconds < 60 * 60) return Math.floor(seconds / 60) + "分钟";
      else if (seconds < 60 * 60 * 24)
        return Math.floor(seconds / 60 / 60) + "小时";
      else if (seconds < 60 * 60 * 24 * 30)
        return Math.floor(seconds / 60 / 60 / 24) + "天";
      else return Math.floor(seconds / 60 / 60 / 24 / 30) + "月";
    },
    listCancel(tasks, index) {
      let tid;
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].status == "RUNNING" || "READY" || "UPLOADING") {
          tid = tasks[i].tid;
        }
      }
      console.log("cancelGenerate!", tid);
      cancelTask(tid).then(
        (response) => {
          console.log("取消任务 请求成功了!", response);
          findTaskStatus(tid);
          this.$set(this.projectList, index, this.projectList[index]);
          // this.getProjectsList();
        },
        (error) => {
          console.log("取消任务 请求失败了!", error);
        }
      );
    },
    findStatus(item, tid, index) {
      console.log("findStatus tid 2:", tid);
      findTaskStatus(tid).then(
        (response) => {
          item.tasks = response.data.results;
          this.$set(this.projectList, index, item);
          console.log("首页 response.data:", response.data);
          const finishTask = this.findTargetFinishedTask(item.tasks); //获得状态为FINISHED或CANCELLED的目标task
          console.log("taskGenerate finishTask:", finishTask);
          if (finishTask != null) {
            if (item.timerId) {
              //清除查询任务状态详情定时器
              item.status = finishTask.status;
              this.$set(this.projectList, index, item);
              clearInterval(item.timerId);
              console.log("列表页 已清除定时器");
            }
          } else console.log("task==null");
          console.log("列表页 查询任务状态详情 请求成功了!", response); //待定
        },
        (error) => {
          console.log("列表页 查询任务状态详情 请求失败了!", error);
        }
      );
    },
    findTargetFinishedTask(tasks) {
      //找到状态为FINISHED的目标task
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].status == "FINISHED" || tasks[i].status == "CANCELLED") {
          return tasks[i];
        } else {
          return null;
        }
      }
    },
    setTimer() {
      // console.log("定时器1",this.projectList)
      //   await this.getProjectsList();
      //   console.log("定时器2",this.projectList)
      this.projectList.forEach((item, index) => {
        console.log("定时器");
        if (item.status == "RUNNING") {
          // 设置定时器，使用了3秒钟后移除条件
          console.log("定时器:", item);
          let tid;
          const tasks = item.tasks;
          for (var i = 0; i < tasks.length; i++) {
            if (
              tasks[i].status == "RUNNING" ||
              tasks[i].status == "READY" ||
              tasks[i].status == "UPLOADING"
            ) {
              tid = tasks[i].tid;
            }
          }
          // item.timerId = setTimeout(() => {
          //   this.findStatus(item,tid);
          // }, 3000);
          item.timerId = setInterval(() => {
            //设置一个查询任务状态详情的定时器
            this.findStatus(item, tid, index);
          }, 1000); // 每隔3秒执行一次
        }
      });
    },
  },
  mounted() {
    //http://localhost:8080/api/aigid/v1/project/list
    console.log("列表页面");
    this.getProjectsList();
    this.rowScrollHeight =
      100 - (this.$store.state.menuHeight / this.$store.state.mainHeight) * 100;
    console.log(
      "滚动高度:",
      this.rowScrollHeight,
      this.$store.state.menuHeight,
      this.$store.state.mainHeight
    );
  },
  beforeDestroy() {
    // 清除定时器
    // this.projectList.forEach(item => {
    //   if (item.timerId) {
    //     clearTimeout(item.timerId);
    //   }
    // });
  },
  watch: {
    typeValue(newValue) {
      //console.log("typeValue:",newValue);
      this.currentPage = 1;
      getProjectLists({ type: newValue, pagenum: this.currentPage }).then(
        (response) => {
          console.log("请求成功了!", response.data);
          this.projectList = response.data.items;
          //console.log('请求成功了this.projectList!',this.projectList);
        },
        (error) => {
          console.log("请求失败了!", error);
        }
      );
    },
    leftTime(newVal, oldVal) {
      if (this.leftTime != 0) {
        getProjectLists({ type: "", pagenum: this.currentPage }).then(
          (response) => {
            console.log("请求成功了!", response.data);
            this.projectList = response.data.items;
            //console.log('请求成功了this.projectList!',this.projectList);
          },
          (error) => {
            console.log("请求失败了!", error);
          }
        );
      }
    },
  },
  computed: {
    // getLeftTime(tasks)//获取RUNNING状态下的leftTime
    // {
    //   for(var i=0;i<tasks.length;i++)
    //   {
    //     if(tasks[i].status == 'RUNNING')
    //     {
    //       console.log("getLeftTime:",tasks[i].leftTime)
    //       return tasks[i].leftTime;
    //     }
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
* {
  /* CSS Reset */
  margin: 0;
  padding: 0;
}

.row {
}
.row-scroll {
  /* height: (100-) vh; 视口高度 */
  overflow-y: auto;
}
/* 隐藏浏览器自带的滚动条 */
.row-scroll::-webkit-scrollbar {
  width: 0 !important;
}
.row-scroll::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}
.project-list {
  display: inline-block;
  background-color: #242425;
  // width: 446px;
  // height: 256px;
  width: 288px;
  height: 162px;
  border-radius: 16px;
  margin: 24px 12px 0 12px;
  border: 0px;

  .list {
    display: inline-block;
    // width: 446px;
    // height: 256px;
    width: 288px;
    height: 162px;
    .status-running {
      display: flex;
      // justify-content: center;
      align-items: center;
      flex-direction: column;
      // width: 446px;
      // height: 200px;
      width: 288px;
      height: 162px;

      ::v-deep .el-progress {
        margin-top: 28px;
        width: 96px !important;
        height: 96px !important;

        .el-progress-circle {
          width: 96px !important;
          height: 96px !important;
          transform: rotateY(180deg);
        }

        svg {
          width: 96px;
          height: 96px;
        }

        path:first-child {
          // 修改进度条背景色
          stroke: #535353;
        }

        .el-progress__text {
          font-family: AliMedium;
          font-size: 24px;
          color: #fff !important;
        }
      }

      .project-name {
        display: block;
        color: #fff;
        margin-top: 16px;
        font-size: 16px;
        font-family: AliMedium;
        height: 22px;
        line-height: 22px;
      }

      .time-remaining {
        margin-top: 8px;
        font-size: 12px;
        font-family: AliRegular;
        color: #535353;
      }
    }

    .list-image {
      display: block;
      // width: 446px;
      // height: 200px;
      width: 288px;
      height: 106px;
      border-radius: 16px 16px 0 0;
    }

    .text-container {
      height: 56px;
      line-height: 56px;
      display: flex;
      justify-content: space-between;

      .text-content {
        width: 384px;
        // height: 56px;
        margin-left: 16px;

        .text-common {
          display: block;
          text-align: left;
        }

        .project-name {
          height: 22px;
          line-height: 22px;
          font-size: 16px;
          font-family: AliMedium;
          color: #fff;
          margin-top: 6px;
        }

        .edit-time {
          display: block;
          font-size: 12px;
          font-family: AliMedium;
          color: #535353;
          height: 16px;
          line-height: 16px;
        }
      }

      .cancel-content {
        display: flex;
        justify-content: center;
        width: 100%;
        margin-left: 0px;
        cursor: pointer;
        //取消按钮
        .cancel-btn {
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

      .icon-more {
        display: flex;
        align-items: center;
        color: #fff;
        font-size: 24px;
        text-align: center;
      }
    }
  }
}
@media screen and (max-width: 1200px) {
  .project-list {
    width: 293px;
    height: 165px;
    .list {
      width: 293px;
      height: 165px;
      .status-running {
        width: 293px;
        height: 165px;
      }

      .list-image {
        width: 293px;
        height: 165px;
      }
    }
  }
}
@media screen and (max-width: 626px) {
  .project-list {
    width: 552px;
    height: 311px;
    .list {
      width: 552px;
      height: 311px;
      .status-running {
        width: 552px;
        height: 311px;
      }

      .list-image {
        width: 552px;
        height: 311px;
      }
    }
  }
}
</style>