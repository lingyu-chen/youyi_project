<template>
  <div class="twoDtothreeD-container">
    <div class="to-left">
      <canvas id="c" ref="tutorial" :width="width" :height="height" class="panel-white"></canvas>
      <div class="tool-navigation-container">
        <div class="tool-navigation">
          <div class="undo-redo">
            <img src="../assets/undo.png" @click="back()" alt="" style="marginRight: 16px;">
            <img src="../assets/redo.png" @click="restore()" alt="">
          </div>
          <div class="eraser-paint-graph">
            <el-popover
            placement="bottom"
            width="24px"
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
            <img src="../assets/paint.png" alt="" style="marginRight: 16px;" @click="startPaint()">
            <img src="../assets/eraser.png" alt="" style="marginRight: 16px;" @click="startEraser()">
            <img src="../assets/alpha.png" alt="">
            <img src="../assets/selectAlpha.png" alt="">
          </div>
          <div class="upload-download">
            <div style="display: inline-block;position: relative;">
              <img src="../assets/toolupload.png" alt="" style="marginRight: 16px;">
              <el-upload
                style="display: block; width: 24px;height: 24px; position: absolute;left: 0;top: 0; z-index: 999;"
                class="upload-demo"
                action="#"
                :before-upload="handleBeforeUpload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                multiple
                :limit="2"
                :on-exceed="handleExceed"
                :file-list="fileList">
                <el-button size="small" type="primary" style="display: block; width: 24px;height: 24px;padding: 0;margin: 0;opacity: 0;"></el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
            </div>
            
            <img src="../assets/tooldownload.png" alt="" @click="save()">
          </div>
          <div class="twoD-generation-container">
            <div class="twoD-generation"><img src="../assets/generationicon.png" alt="">2D to 3D</div>
          </div>
          
        </div>
        <el-select v-model="shapeValue" placeholder="请选择" style="position: absolute;">
            <el-option
              v-for="item in shapeLists"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
        v-model="detail.prompt">
       </el-input>
      </div>
      <div class="ai-rate">
        <div class="rate-content">
          <span class="rate-text">AI影响率</span>
          <span class="rate-value">{{showPercentage}}%</span>        
        </div>
        <div>
            <!-- <Progress v-on:rate="getRateValue" :RateValue = "percentage"></Progress> -->
            <Progress v-on:rate="getRateValue"></Progress>
        </div>
      </div>
      <div class="style-list">
          <div class="style-reference">风格参照</div>
          <el-select v-model="styleValue" placeholder="请选择" style="color: #ff0000;" :popper-append-to-body="false">
            <el-option
              v-for="item in styleLists"
              :key="item.sid"
              :label="item.name"
              :value="item.sid">
            </el-option>
          </el-select>
      </div>
      <div class="reference-image">
        <div class="image-text">参考图片</div>
        <el-upload
          class="upload-demo"
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple>
          <!-- <i class="el-icon-upload"></i> -->
          <img src="../assets/upload.png" alt="">
          <div class="el-upload__text">点击/拖拽 来上传图片 (jpeg, png)</div>
          <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
        </el-upload>
      </div>
      <div class="history-record">
        <div class="history-text">历史记录</div>
        <div class="history-images">
          <div class="img-hover" v-for="(item,index) in history" :key="index">
            <img :src="item.preLink" alt="" class="history-img">
            <div class="hover-gray-img">
              <div class="hover-gray"></div>
              <img src="../assets/Vector.png" alt="" class="vector-img">
            </div>
          </div>
        </div>
      </div>
      <div class="generation-scheme">
         <el-button>AI 生成方案</el-button>
      </div>
     
    </div>
  </div>
</template>

<script>
import Progress from './Progress.vue';
import {getStyleList,getProjectDetail,getHistoryList} from '@/api/index'
import { Sketch } from 'vue-color';
import {fabric} from 'fabric-with-erasing'
//形状绘图
import hotkeys from 'hotkeys-js';//判断热键值
window.fabric = fabric;
let f = null
// let canvas = ref();
let drawType;
export default {
  components:{
        // HelloWorld
        Progress,
        "sketch-picker": Sketch
    },
  data() {
    return {
      textarea: '',
      percentage:0,//AI影响率
       styleLists:[],//风格列表
       styleValue: '',
       type:this.$route.params.type,//项目类型
       id:this.$route.params.id,//项目id
       detail:{},//项目详情
       history:[],//历史记录图片
       //画布 画笔部分
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
        //画布 形状绘图部分
        canvas:this.$refs.canvas,
        shapeLists: [{
          value: 'r',
          label: '矩形'
        }, {
          value: 'c',
          label: '圆'
        }, {
          value: 'l',
          label: '直线'
        }],
        shapeValue: '',
        count:0,
        isDrawingCircle :false,//是否点击shift画圆
        shiftKey:false,//判断是否点击了shift
        delList : [], // 被删除的数据
    }
  },
  mounted() {
    console.log("type(TwoDGeneration)=",this.type);
    //获取风格列表
    getStyleList().then(response => {
        this.styleLists = response.data.styles;
        console.log('请求成功了!styleLists',this.styleLists);
      },
      error => {
        console.log('请求失败了!',error);
      }
      );
      //获取项目详情
      getProjectDetail(this.$route.params.id).then(
        response => {
          this.detail = response.data;
          this.percentage = this.detail.aiRate;
          console.log("this.detail.aiRate=",this.detail.aiRate);
          this.$bus.$emit('getInitialPercntage',this.percentage);
          console.log("获取详情请求成功了！",this.detail);
        },
        error => {
          console.log('获取详情请求失败了!',error);
        }
      );
      //获取历史记录图片
      getHistoryList(this.$route.params.id).then(
        response => {
          this.history = response.data.history;
          console.log("获取历史记录图片请求成功了！",this.history);
        },
        error => {
          console.log('获取详情请求失败了!',error);
        }
      );
      //画布 形状绘制
      this.canvas = f = new fabric.Canvas("c");
      drawType = '';
      this.initHotkey() // 声明图形绘画的启用快捷键
      this.initDrawEvent(f) // 创建图形绘画相关事件；
  },
  methods: {
    getRateValue(percentage){
      this.percentage = percentage;
    },
    //画布 自由绘画
    startPaint(){
      this.shapeValue = '';//关闭形状绘画
      this.freeDraw();
    },
    freeDraw(){
      console.log("自由绘画 this.drawType:",this.drawType);
      if(this.canvas == null)
      {
          this.canvas = new fabric.Canvas("c");
          // this.canvas.backgroundColor = '#efefef';
          // this.canvas.isDrawingMode= 1;
      }
      this.canvas.isDrawingMode= 1;
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
      this.canvas.freeDrawingBrush.color = this.colors;
    },
    //橡皮擦功能
    startEraser(){
      this.shapeValue = '';//关闭形状绘画
      console.log("startEraser this.drawType:",this.drawType);
      this.canvas.freeDrawingBrush = new fabric.EraserBrush(this.canvas);
      this.canvas.freeDrawingBrush.width = 10;
      this.canvas.isDrawingMode = true;
    },
        //画布 形状绘图部分
    initHotkey() {
      hotkeys('r', () => {
        // 矩形
        drawType = 'r' // 简单写个值，在业务里建议定义枚举类较好。
      });
      hotkeys('l', () => {
        // 直线
        drawType = 'l' // 简单写个值，在业务里建议定义枚举类较好。
      });
      hotkeys('c', () => {
        // 圆形
        drawType = 'c' // 简单写个值，在业务里建议定义枚举类较好。
      });
      hotkeys('*', { keyup: true }, (evn, handler) => {
        if(evn.type === 'keydown'&& hotkeys.shift) {
          this.shiftKey = true;
          console.log("点击了shift键:",this.shiftKey)
        }
        if(evn.type === 'keyup') {
          this.shiftKey = false;
          console.log("松开了shift键:",this.shiftKey)
        }
      });
  },
      initDrawEvent(canvas) {
      let shape=fabric.Object | null;
      let startPoint=fabric.IPoint; // 记录初始坐标
      canvas.on('mouse:down', (e) => {
        console.log("drawType e:",e.e.shiftKey);
        if (e.target || !drawType) {
          // 如果绘画点击在图片上，则不进行绘画
          return;
        }
        console.log("点击次数:drawType",this.count++,drawType);
        if (!shape) {
          f.selection = false;
          startPoint = e.absolutePointer
          switch (drawType) {
            case 'r':
              shape = new fabric.Rect({ //创建对应图形类型
                left: startPoint.x,
                top: startPoint.y,
                width: 0,
                height: 0,
                fill: undefined,
                stroke: 'red'
              });
              break;
            case 'c':
              {
                if (this.isDrawingCircle) {
                      shape = new fabric.Circle({
                      left: startPoint.x,
                      top: startPoint.y,
                      fill: '',
                      stroke: 'red'
                    });
                  }
                  else{
                    shape = new fabric.Ellipse({
                    left: startPoint.x,
                    top: startPoint.y,
                    rx: 0,
                    ry: 0,
                    fill: undefined,
                    stroke: 'red'
                    });
                  }
              }
              
              break;
            case 'l':
              shape = new fabric.Line([startPoint.x, startPoint.y, startPoint.x, startPoint.y], {
                fill: undefined,
                stroke: 'red'
              });
              break;
            default:
              break;
          }
          if (shape) {
            f.add(shape); //添加图形
            f.requestRenderAll(); //刷新画布
          }
        }
        window.selected = e?.target // 当点击选择到有可选图形时，会获得图形的数据。
      }).on('mouse:move', (e) => {
        console.log("move this.isDrawingCircle:",this.isDrawingCircle)
        if (drawType && shape) {
          const p = f.getPointer(e.e) || {
            x: 0,
            y: 0,
          };
          const minX = Math.min(p.x, startPoint.x);
          const minY = Math.min(p.y, startPoint.y);
          let w = Math.abs(p.x - startPoint.x);
          let h = Math.abs(p.y - startPoint.y);
          switch (drawType) {
            case 'r':
              shape.set({
                left: minX,
                top: minY,
                width: w,
                height: h,
              });
              break;
            case 'c':
              {
                if (this.isDrawingCircle) {
                    var radius = w/2;
                    shape.set({
                    left: minX,
                    top: minY,
                    radius: radius,
                  });
                  }
                else{
                    shape.set({
                    left: minX,
                    top: minY,
                    rx: w / 2,
                    ry: h / 2,
                  });
                };
              }
              break;
            case 'l':
              let x1 = startPoint.x;
              let y1 = startPoint.y;
              let x2 = p.x;
              let y2 = p.y;
              console.log(startPoint, p);
    
              shape.set({
                x1,
                y1,
                x2,
                y2,
              });
              break;
            default:
              break;
          }
          this.shape = shape;
          this.startPoint = startPoint;
          f.requestRenderAll();
        }
      }).on('mouse:up', (e) => {
        if (drawType && shape) {
          shape.setCoords(); // 更新图像坐标；
          // drawType = null
          f.selection = true;
          shape = null;
          f.requestRenderAll();  
        }
      })
    },// 撤销
    back() {
      if (this.canvas._objects.length > 0) {
        console.log("执行撤销操作")
        this.delList.push(this.canvas._objects.pop());
        this.canvas.renderAll();
      }
    },
    // 恢复
    restore() {
      console.log("执行恢复操作")
      if (this.delList.length > 0) {
        this.isRedoing = true;
        this.canvas.add(this.delList.pop());
        this.canvas.renderAll();
      }
    },
    //上传图片
    handleBeforeUpload(file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // 读取文件为Base64
      reader.onload = e => {
        console.log('图片的Base64编码：', e.target.result);
        // 这里可以执行其他逻辑，比如将Base64存储起来或者上传到服务器
        const imageUrl = e.target.result;
        fabric.Image.fromURL(imageUrl, (img) => {
        img.set({
          left: 100,
          top: 100,
          width: 300,
          height: 300,
        });
        this.canvas.add(img);
        this.canvas.centerObject(img);
        });
      };
      return false; // 阻止默认上传行为
    },
    handleRemove(file, fileList) {
        console.log("file:",file, "fileList",fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      // beforeRemove(file, fileList) {
      //   return this.$confirm(`确定移除 ${ file.name }？`);
      // },
      //保存画布
      save(){
        console.log("调用了下载画布方法")
        const dataUrl = this.canvas.toDataURL('png');
        this.downloadIamge(dataUrl,'newimg');
      },
      downloadIamge(imgsrc, name){
        var a = document.createElement("a");
        a.href = imgsrc;
        a.download = name;
        a.click();
      }
  },
  computed:{
    showPercentage(){
      if(this.percentage<1)
        return this.percentage*100;
      else
        return this.percentage;
    }
  },
  watch:{
    shapeValue(newVal,oldVal)
    {
      drawType = newVal;
      this.canvas.isDrawingMode= 0;//关闭自由绘画功能和橡皮擦功能
      console.log("关闭自由绘画功能和橡皮擦功能 this.canvas.isDrawingMode",this.canvas.isDrawingMode)
    },
    shiftKey(newVal,oldVal)
    {
      console.log("this.shiftKey:newVal",newVal)
      this.isDrawingCircle = newVal;
    }
  }
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

</style>