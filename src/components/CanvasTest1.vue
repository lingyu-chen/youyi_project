<template>
  <div class="cdie" id="cdie">
    <canvas id="c" ref="canvas"></canvas>
    <el-select v-model="value" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>
 
<script>
import { fabric } from "fabric";

import hotkeys from 'hotkeys-js';
window.fabric = fabric
let f = null
// let canvas = ref();
let drawType;
export default {
  data() {
    return {
      canvas:this.$refs.canvas,
      options: [{
          value: 'r',
          label: '矩形'
        }, {
          value: 'c',
          label: '圆'
        }, {
          value: 'l',
          label: '直线'
        }],
        value: 'r',
        count:0,
        isDrawingCircle :false,//是否点击shift画圆
        shiftKey:false,//判断是否点击了shift
        shape:fabric.Object | null,
        startPoint:fabric.IPoint
    }
  },
  methods: {
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
        // let shape = this.shape;
        // let startPoint = this.startPoint;
      // let shape=fabric.Object | null;
      // let startPoint=fabric.IPoint; // 记录初始坐标
      canvas.on('mouse:down', (e) => {
        console.log("drawType e:",e.e.shiftKey);
        if (e.target || !drawType) {
          // 如果绘画点击在图片上，则不进行绘画
          return;
        }
        console.log("点击次数：",this.count++);
        if (!this.shape) {
          f.selection = false;
          this.startPoint = e.absolutePointer
          switch (drawType) {
            case 'r':
              this.shape = new fabric.Rect({ //创建对应图形类型
                left: this.startPoint.x,
                top: this.startPoint.y,
                width: 0,
                height: 0,
                fill: undefined,
                stroke: 'red'
              });
              break;
            case 'c':
              {
                if (this.isDrawingCircle) {
                      this.shape = new fabric.Circle({
                      left: this.startPoint.x,
                      top: this.startPoint.y,
                      fill: '',
                      stroke: 'red'
                    });
                  }
                  else{
                    this.shape = new fabric.Ellipse({
                    left: this.startPoint.x,
                    top: this.startPoint.y,
                    rx: 0,
                    ry: 0,
                    fill: undefined,
                    stroke: 'red'
                    });
                  }
              }
              
              break;
            case 'l':
              this.shape = new fabric.Line([this.startPoint.x, this.startPoint.y, this.startPoint.x, this.startPoint.y], {
                fill: undefined,
                stroke: 'red'
              });
              break;
            default:
              break;
          }
          if (this.shape) {
            // this.this.shape = this.shape;
            // this.this.startPoint = this.startPoint;
            f.add(this.shape); //添加图形
            f.requestRenderAll(); //刷新画布
          }
        }
        window.selected = e?.target // 当点击选择到有可选图形时，会获得图形的数据。
      }).on('mouse:move', (e) => {
        console.log("move this.isDrawingCircle:",this.isDrawingCircle)
        if (drawType && this.shape) {
          const p = f.getPointer(e.e) || {
            x: 0,
            y: 0,
          };
          const minX = Math.min(p.x, this.startPoint.x);
          const minY = Math.min(p.y, this.startPoint.y);
          let w = Math.abs(p.x - this.startPoint.x);
          let h = Math.abs(p.y - this.startPoint.y);
          switch (drawType) {
            case 'r':
              this.shape.set({
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
                    this.shape.set({
                    left: minX,
                    top: minY,
                    radius: radius,
                  });
                  }
                else{
                    this.shape.set({
                    left: minX,
                    top: minY,
                    rx: w / 2,
                    ry: h / 2,
                  });
                };
              }
              break;
            case 'l':
              let x1 = this.startPoint.x;
              let y1 = this.startPoint.y;
              let x2 = p.x;
              let y2 = p.y;
              console.log(this.startPoint, p);
    
              this.shape.set({
                x1,
                y1,
                x2,
                y2,
              });
              break;
            default:
              break;
          }
          f.requestRenderAll();
        }
      }).on('mouse:up', (e) => {
        if (drawType && this.shape) {
          this.shape.setCoords(); // 更新图像坐标；
          // drawType = null
          f.selection = true;
          this.shape = null;
          f.requestRenderAll();  
        }
      })
    }
  },
  mounted() {
    this.canvas = f = new fabric.Canvas("c", {
    backgroundColor: "grey",
    width: 1000,
    height: 500,
  });
  drawType = 'r',
  this.initHotkey() // 声明图形绘画的启用快捷键
  this.initDrawEvent(f) // 创建图形绘画相关事件；
  },
  watch:{
    value(newVal,oldVal)
    {
      drawType = newVal;
    },
    shiftKey(newVal,oldVal)
    {
      console.log("this.shiftKey:newVal",newVal)
      this.isDrawingCircle = newVal;
      if(this.isDrawingCircle)
      {
        this.shape = new fabric.Circle({
            left: this.startPoint.x,
            top: this.startPoint.y,
            fill: '',
            stroke: 'red'
          });
      }
      else{
        this.shape = new fabric.Ellipse({
            left:this.startPoint.x,
            top: this.startPoint.y,
            rx: 0,
            ry: 0,
            fill: undefined,
            stroke: 'red'
            });
      }
    }
  }
}

 
</script>
 
<style scoped lang="scss">
.cdie {
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
}
</style>
<!-- <template>
  <div class="home">
    <div class="btnwrap">
      <div @click="changeBrushColor()" class="brushColor" ref="brushColor">
        
      </div>
      <div class="brushWidth">
         <label >画笔线条粗细:</label>
        <input type="range" name="vol" min="1" max="50" v-model="width">
      </div>
      <button @click="clear()" class="clearBtn">清除</button>
    </div>
    <canvas id="c" width="1440" height="600"></canvas>
  </div>
</template>
<script>
export default {
  name: 'Home',
  components: {
    // 'chrome-picker': Chrome,
  },
  data () {
    return {
      colors:'#000000',
      width:10,
      showColorPicker:false,
      canvas:null
    }
  },
  watch: {
    width: function (val) {
      console.log(val);
      this.canvas.freeDrawingBrush.width = parseInt(this.width, 10);
    },
  },
  methods:{
    initBrushColor(){
      this.$refs.brushColor.style.backgroundColor = this.colors;
    },
    updateValue(val){
      console.log(val);
      this.colors = val.hex;
      this.initBrushColor();
      this.canvas.freeDrawingBrush.color = this.colors;
    },
    changeBrushColor(){
      this.showColorPicker = !this.showColorPicker;
    },
    freeDraw(){
      if(this.canvas == null){
        this.canvas = new fabric.Canvas("c");
        this.canvas.backgroundColor = '#efefef';
        this.canvas.isDrawingMode= 1;
      }
      this.canvas.freeDrawingBrush.color = this.colors;
      this.canvas.freeDrawingBrush.width = this.width;
      this.canvas.renderAll();
    },
    clear(){
      this.canvas.clear();
      this.canvas.backgroundColor = '#efefef';
    }
  },
  mounted(){
    this.initBrushColor();
    this.freeDraw();
  }

}
  
</script> -->
<!-- <template>
  <canvas ref="canvas" width="500" height="500" style="border: 1px solid #000;"></canvas>
</template>
 
<script>
import { fabric } from 'fabric';
 
export default {
  name: 'FreeDrawingApp',
  data() {
    return {
      canvas: null,
      isDrawing: false,
      startX: 0,
      startY: 0
    };
  },
  methods: {
    setupCanvas() {
      this.canvas = new fabric.Canvas('canvas');
      this.canvas.isDrawingMode = true;
      this.canvas.freeDrawingBrush.color = 'red';
      this.canvas.freeDrawingBrush.width = 5;
    },
    startDrawing(e) {
      this.isDrawing = true;
      const pointer = this.canvas.getPointer(e);
      this.startX = pointer.x;
      this.startY = pointer.y;
    },
    stopDrawing() {
      this.isDrawing = false;
    },
    doDrawing(e) {
      if (this.isDrawing) {
        const pointer = this.canvas.getPointer(e);
        this.canvas.drawArc({
          left: this.startX,
          top: this.startY,
          x: pointer.x,
          y: pointer.y,
          stroke: 'red',
          strokeWidth: 5,
          fill: null
        });
        this.startX = pointer.x;
        this.startY = pointer.y;
      }
    }
  },
  mounted() {
    this.setupCanvas();
    this.$refs.canvas.addEventListener('mousedown', this.startDrawing);
    this.$refs.canvas.addEventListener('mouseup', this.stopDrawing);
    this.$refs.canvas.addEventListener('mousemove', this.doDrawing);
  },
  beforeDestroy() {
    this.$refs.canvas.removeEventListener('mousedown', this.startDrawing);
    this.$refs.canvas.removeEventListener('mouseup', this.stopDrawing);
    this.$refs.canvas.removeEventListener('mousemove', this.doDrawing);
  }
};
</script> -->
<!-- <template>
  <div>
    <canvas
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      id="c"
      ref="canvas"
      :width="width"
      :height="height"
      style="border: 1px solid #000;">
    </canvas>
    <input type="color" id="color-box" v-model="colorvalue">
    <label for="color-box">选择画笔颜色</label>
    <img src="../assets/2Dto3DSelected.png" alt="" @click="startPaint()"/>
    <img src="../assets/2DGenerationSelected.png" alt="" @click="startErasing()"/>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      isDrawing: false,
      mainDrawing:false,
      lastX: 0,
      lastY: 0,
      context: null,
      width: 400,
      height: 400,
      colorvalue:"",
      canvasFabric:null,//橡皮擦功能
    };
  },
  methods: {
    startPaint(){
      this.mainDrawing = !this.mainDrawing;
    },
    startDrawing(e) {
      this.isDrawing = !this.isDrawing;
      const canvas = this.$refs.canvas;
      this.context = canvas.getContext('2d');
      this.context.beginPath();
      this.lastX = e.offsetX;
      this.lastY = e.offsetY;
    },
    draw(e) {
      console.log("true or false ",(!this.isDrawing) || (!this.mainDrawing))
      if ((!this.isDrawing) || (!this.mainDrawing)) return;
      console.log("true or false return ",(!this.isDrawing) && (!this.mainDrawing))
      const canvas = this.$refs.canvas;
      const ctx = this.context;
      const x = e.offsetX;
      const y = e.offsetY;
      ctx.moveTo(this.lastX, this.lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      [this.lastX, this.lastY] = [x, y];
    },
    stopDrawing() {
      this.isDrawing = false;
    },
    //橡皮擦功能
    startErasing(){
      const canvas = this.canvasFabric = new fabric.Canvas(this.$refs.canvas);
      canvas.isDrawingMode = true // 进入绘画模式
      canvas.freeDrawingBrush = new fabric.EraserBrush(canvas) // 使用橡皮擦画笔
      canvas.freeDrawingBrush.width = 10 // 设置画笔粗细为 10
    }
  },
  watch:{
    colorvalue(newVal,oldVal)
    {
      console.log("newVal oldVal:",newVal,oldVal);
      this.context.strokeStyle = newVal;
      
    }
  }
};
</script> -->