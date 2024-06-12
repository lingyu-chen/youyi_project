<!-- <template>
    <div class="twoDtothreeD-container">
      <div class="to-left">
        <canvas id="c" ref="tutorial" :width="width" :height="height" class="panel-white"></canvas>
        <el-popover
            placement="bottom"
            width="200"
            trigger="click"
            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
            <el-button slot="reference" class="color-box"
            :style="{ backgroundColor: colorPicker,padding: '0px' }">
            <div style="width: 100%;height:100%;border: 2px solid gainsboro">
            <i  style="font-size: 25px; font-weight: lighter;line-height: 34px; color: white" class="el-icon-arrow-down icon">
            </i>
            </div>
            </el-button>
            <sketch-picker v-model="colorPicker" @input="colorValueChange"/>
        </el-popover>

        <div :style="{ backgroundColor: colorPicker }">
        选中的颜色将应用到这个区域
        </div>
        <div class="tool-navigation-container">
          <div class="tool-navigation">
            <div class="undo-redo">
              <img src="../assets/undo.png" alt="" style="marginRight: 16px;">
              <img src="../assets/redo.png" alt="">
            </div>
            <div class="eraser-paint-graph">
              <img src="../assets/paint.png" alt="" style="marginRight: 16px;" @click="startPaint()">
              <img src="../assets/eraser.png" alt="" style="marginRight: 16px;" @click="startEraser">
              <img src="../assets/alpha.png" alt="">
              <img src="../assets/selectAlpha.png" alt="">
            </div>
            <div class="upload-download">
              <img src="../assets/toolupload.png" alt="" style="marginRight: 16px;">
              <img src="../assets/tooldownload.png" alt="">
            </div>
            <div class="twoD-generation-container">
              <div class="twoD-generation"><img src="../assets/generationicon.png" alt="">2D to 3D</div>
            </div>
            
          </div>
        </div>
         
      </div>
    </div>
  </template>
  
  <script>
  import Progress from './Progress.vue';
  import {getStyleList,getProjectDetail,getHistoryList} from '@/api/index'
  import { Sketch } from 'vue-color';
  import {fabric} from 'fabric-with-erasing'
  export default {
    components:{
          // HelloWorld
          Progress,
          "sketch-picker": Sketch,
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
         //画布
          isDrawing: false,//用来判断是否落笔
          mainDrawing:false,//用来控制是否点画笔
          lastX: 0,
          lastY: 0,
          context: null,
          width:1322,
          height:734,
          paintWidth:2,
          colors:'red',
          colorPicker:"#f00",
          canvas:null
  
      }
    },
    mounted() {
    //   console.log("type(TwoDGeneration)=",this.type);
    //   //获取风格列表
    //   getStyleList().then(response => {
    //       this.options = response.data.styles;
    //       console.log('请求成功了!options',this.options);
    //     },
    //     error => {
    //       console.log('请求失败了!',error);
    //     }
    //     );
    //     //获取项目详情
    //     getProjectDetail(this.$route.params.id).then(
    //       response => {
    //         this.detail = response.data;
    //         this.percentage = this.detail.aiRate;
    //         console.log("this.detail.aiRate=",this.detail.aiRate);
    //         this.$bus.$emit('getInitialPercntage',this.percentage);
    //         console.log("获取详情请求成功了！",this.detail);
    //       },
    //       error => {
    //         console.log('获取详情请求失败了!',error);
    //       }
    //     );
    //     //获取历史记录图片
    //     getHistoryList(this.$route.params.id).then(
    //       response => {
    //         this.history = response.data.history;
    //         console.log("获取历史记录图片请求成功了！",this.history);
    //       },
    //       error => {
    //         console.log('获取详情请求失败了!',error);
    //       }
    //     )
    },
    methods: {
    //   startPaint(){
    //     this.freeDraw();
    //   },
        startPaint(){
           if(this.canvas == null)
           {
               this.canvas = new fabric.Canvas("c");
               this.canvas.isDrawingMode= 1;
           }
              
           console.log("freeDraw");
           this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
           this.canvas.freeDrawingBrush.color = this.colors;
           this.canvas.freeDrawingBrush.width = this.paintWidth;
           this.canvas.renderAll();
       },
       // 颜色值改变事件处理
       colorValueChange(val) {
        // console.log(val)
        // 取颜色对象的十六进制值
        this.colorPicker = val.hex;
        this.colors = val.hex;
       },
       //橡皮擦功能
       startEraser(){
           console.log("startEraser");
           this.canvas.freeDrawingBrush = new fabric.EraserBrush(this.canvas);
           this.canvas.freeDrawingBrush.width = 10;
           this.canvas.isDrawingMode = true;
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
      position: relative;
      display: inline-block;
      width: 1552px;
      height: 996px;
      background-color: #d4d4d4;
      .panel-white{
        width: 1322px;
        height: 734px;
        background-color: #fff;
        margin: 75px 115px 0 115px;
        img{
          margin: 87px 509px 60px 438px;
        }
      }
      /deep/.canvas-container{
        width: 1322px;
        height: 734px;
        background-color: #fff;
        margin: 75px 115px 0 115px;
      }
      /deep/.lower-canvas{
        margin:0px;
      }
      .tool-navigation-container{
        width: 100%;
        display: flex;
        justify-content: center;
        .tool-navigation{
          position: relative;
          width: 544px;
          height: 64px;
          background-color: #212123;
          margin: 91px 504px 32px 504px;
          border-radius: 32px;
          .undo-redo{
            display: inline-block;
            padding: 8px 16px;
            margin: 12px 0 12px 14px;
            border-right: 1px solid #3d3d3d;
          }
          .eraser-paint-graph{
            display: inline-block;
            padding: 8px 16px;
            margin: 12px 0 ;
            border-right: 1px solid #3d3d3d;
          }
          .upload-download{
            display: inline-block;
            padding: 8px 16px;
            margin: 12px 0 12px 0;
            border-right: 1px solid #3d3d3d;
          }
          .twoD-generation-container{
            display: flex;
            align-items: center; /* 垂直居中 */
            width: 165px;
            position: absolute;
            top: 0px;
            right: 8px;
          }
          .twoD-generation{
            display: inline-block;
            padding: 0 24px 0 16px;
            color: #fff;
          // width: 111px;
            height: 48px;
            line-height: 48px;
            font-size: 20px;
            margin-top: 8px;
            margin-bottom: 8px;
            margin-left: 16px;
            background-color: #2400ff;
            border-radius: 24px;
            font-family: AliMedium;
            cursor: pointer;
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
            .hover-gray-img{
              display: none;
              position: absolute;
              width:152px;
              height: 154px;
              left: 0;
              top: 0;
              border-radius: 4px;
              .hover-gray{
                position: absolute;
                left: 0;
                top: 0;
                width:152px;
                height: 154px;
                background-color: #969696;
                z-index: 998;
                opacity: 0.41;
                border-radius: 4px;
                color: #fff;
              }
              .vector-img{
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%,-50%);
                  opacity: 100%;
                  z-index: 999;
                }
            }
            
            &:hover .hover-gray-img{
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
  
  </style>-->
<template>
    <div>
        <canvas id="c" ref="tutorial" :width="width" :height="height" class="panel-white" style="border: 1px solid #000;"></canvas>
        <img src="../assets/paint.png" alt="" style="backgroundColor: #000; margin: 20px;" @click="startPaint">
        <img src="../assets/eraser.png" alt="" style="backgroundColor: #000; margin: 20px" @click="startEraser">
        <el-popover
            placement="bottom"
            width="200"
            trigger="click"
            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
            <el-button slot="reference" class="color-box"
            :style="{ backgroundColor: colorPicker,padding: '0px' }">
            <div style="width: 100%;height:100%;border: 2px solid gainsboro">
            <i  style="font-size: 25px; font-weight: lighter;line-height: 34px; color: white" class="el-icon-arrow-down icon">
            </i>
            </div>
            </el-button>
            <sketch-picker v-model="colorPicker" @input="colorValueChange"/>
        </el-popover>

        <div :style="{ backgroundColor: colorPicker }">
        选中的颜色将应用到这个区域
        </div>
    </div>
  
</template>

<script>
import { Sketch } from 'vue-color';
import {fabric} from 'fabric-with-erasing'
export default {
    components: {"sketch-picker": Sketch},
    data() {
        return {
            //画布
            isDrawing: false,//用来判断是否落笔
            mainDrawing:false,//用来控制是否点画笔
            lastX: 0,
            lastY: 0,
            context: null,
            width:1322,
            height:734,
            paintWidth:2,
            colors:'red',
            mainDrawing:false,
            colorPicker:"#f00"
        }
    },
    methods: {
        startPaint(){
           this.freeDraw();
        },
        freeDraw(){
            if(this.canvas == null)
            {
                this.canvas = new fabric.Canvas("c");
                this.canvas.backgroundColor = '#efefef';
                this.canvas.isDrawingMode= 1;
            }
            
            console.log("freeDraw colors:",this.colors);
            this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
            this.canvas.freeDrawingBrush.color = this.colors;
            this.canvas.freeDrawingBrush.width = this.paintWidth;
            this.canvas.renderAll();
        },
        // 颜色值改变事件处理
        colorValueChange(val) {
        // console.log(val)
        // 取颜色对象的十六进制值
        this.colorPicker = val.hex;
        this.colors = val.hex;
        this.canvas.freeDrawingBrush.color = this.colors;
        },
        //橡皮擦功能
        startEraser(){
            console.log("startEraser");
            this.canvas.freeDrawingBrush = new fabric.EraserBrush(this.canvas);
            this.canvas.freeDrawingBrush.width = 10;
            this.canvas.isDrawingMode = true;
        }
    },
    mounted() {
        // this.freeDraw();
    },
}
</script>

<style>

</style>