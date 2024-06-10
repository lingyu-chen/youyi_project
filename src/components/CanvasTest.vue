<template>
  <div class="home">
    <div class="btnwrap">
      <div @click="changeBrushColor()" class="brushColor" ref="brushColor">
        <!-- <chrome-picker class="colorPicker" :value="colors" @input="updateValue" v-if="showColorPicker"></chrome-picker> -->
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
  
</script>
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