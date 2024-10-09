<template>
  <div>
    <div class="cdie" id="cdie">
      <canvas id="c" ref="canvas"></canvas>
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-tooltip
        class="item"
        effect="dark"
        content="Top Center 提示文字"
        placement="top"
      >
        <el-button>上边</el-button>123
      </el-tooltip>
      <div class="alpha-selected" style="background: #5034ff; height: 48px">
        <img src="../assets/alpha.png" alt="" v-show="this.alphaValue == 'r'" />
        <img
          src="../assets/ellipse.png"
          alt=""
          v-show="this.alphaValue == 'c'"
        />
        <img src="../assets/line.png" alt="" v-show="this.alphaValue == 'l'" />
        <el-select
          :popper-append-to-body="false"
          :teleported="false"
          v-model="alphaValue"
          placeholder=""
          style="opacity: 1; width: 24px; height: 24px"
        >
          <el-option
            v-for="item in alphaOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <img
              :src="item.src"
              alt=""
              style="width: 16px; height: 16px; vertical-align: text-bottom"
            />
            {{ item.label }}
          </el-option>
        </el-select>
        <img src="../assets/selectAlpha.png" alt="" class="select-alpha-icon" />
      </div>
      <div>
        <img
          src="../assets/undo.png"
          @click="back()"
          alt=""
          style="margin: 16px; background: #000"
        />
        <img
          src="../assets/redo.png"
          @click="restore()"
          alt=""
          style="margin: 16px; background: #000"
        />
      </div>
      <el-upload
        class="upload-demo"
        action="#"
        :before-upload="handleBeforeUpload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="2"
        :on-exceed="handleExceed"
        :file-list="fileList"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
      <img
        src="../assets/tooldownload.png"
        alt=""
        style="margin: 16px; background: #000; height: 24px"
        @click="save()"
      />
      <!-- <span class="icon-icon-paint"></span> -->
      <img
        src="../assets/eraser.png"
        alt=""
        style="marginright: 16px; background: #000; height: 24px"
        @click="startEraser()"
      />

      <el-tooltip placement="top" style="height: 61px">
        <div slot="content">多行信息<br />第二行信息</div>
        <el-button>Top center</el-button>
      </el-tooltip>
      <img
        src="../assets/alpha.png"
        alt=""
        style="marginright: 16px; background: #000; height: 24px"
        @click="changeType()"
      />

      <div class="image-container">
        <img src="../assets/colorpicker.png" alt="示例图片" />
      </div>
    </div>
    <div style="display: block; margintop: -32px; marginleft: 210px">
      <div class="test-container">
        <div class="color-picker"><span></span></div>
      </div>
    </div>
  </div>
</template>
 
<script>
// import { fabric } from "fabric";
import { fabric } from "fabric-with-erasing";

import hotkeys from "hotkeys-js";

import RectangleAlpha from "../assets/alpha.png";
import EllipseAlpha from "../assets/ellipse.png";
import LineAlpha from "../assets/line.png";

window.fabric = fabric;
let f = null;
// let canvas = ref();
let drawType;
export default {
  data() {
    return {
      canvas: this.$refs.canvas,
      isFalse: false,
      options: [
        {
          value: "r1",
          label: "矩形",
        },
        {
          value: "c1",
          label: "圆",
        },
        {
          value: "l1",
          label: "直线",
        },
      ],
      value: "r1",
      alphaOptions: [
        {
          value: "r",
          label: "Rectangle",
          src: RectangleAlpha,
        },
        {
          value: "c",
          label: "Ellipse",
          src: EllipseAlpha,
        },
        {
          value: "l",
          label: "line",
          src: LineAlpha,
        },
      ],
      alphaValue: "r",
      alphaKey: "r",
      RectangleAlpha,
      EllipseAlpha,
      LineAlpha,
      count: 0,
      isDrawingCircle: false, //是否点击shift画圆
      shiftKey: false, //判断是否点击了shift
      delList: [], // 被删除的数据
      fileList: [
        {
          name: "food.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
      ],
      addStack: [], //画布添加操作
      undoStack: [], //画布 橡皮擦除操作
      redoStack: [], //画布 橡皮擦除撤销之后恢复操作
      isSelecting: true, //是否进行选择
    };
  },
  methods: {
    changeType() {
      drawType = "";
    },
    initHotkey() {
      hotkeys("r", () => {
        // 矩形
        drawType = "r"; // 简单写个值，在业务里建议定义枚举类较好。
      });
      hotkeys("l", () => {
        // 直线
        drawType = "l"; // 简单写个值，在业务里建议定义枚举类较好。
      });
      hotkeys("c", () => {
        // 圆形
        drawType = "c"; // 简单写个值，在业务里建议定义枚举类较好。
      });
      hotkeys("*", { keyup: true }, (evn, handler) => {
        if (evn.type === "keydown" && hotkeys.shift) {
          this.shiftKey = true;
          console.log("点击了shift键:", this.shiftKey);
        }
        if (evn.type === "keyup") {
          this.shiftKey = false;
          console.log("松开了shift键:", this.shiftKey);
        }
      });
    },
    initDrawEvent(canvas) {
      // let shape = this.shape;
      // let startPoint = this.startPoint;
      let shape = fabric.Object | null;
      let startPoint = fabric.IPoint; // 记录初始坐标
      canvas
        .on("mouse:down", (e) => {
          console.log("drawType e:", e.e.shiftKey);
          if (e.target || !drawType) {
            // 如果绘画点击在图片上，则不进行绘画
            return;
          }
          console.log("点击次数：", this.count++);
          if (!shape) {
            f.selection = false;
            startPoint = e.absolutePointer;
            switch (drawType) {
              case "r":
                shape = new fabric.Rect({
                  //创建对应图形类型
                  left: startPoint.x,
                  top: startPoint.y,
                  width: 0,
                  height: 0,
                  fill: undefined,
                  stroke: "red",
                });
                break;
              case "c":
                {
                  if (this.isDrawingCircle) {
                    shape = new fabric.Circle({
                      left: startPoint.x,
                      top: startPoint.y,
                      fill: "",
                      stroke: "red",
                    });
                  } else {
                    shape = new fabric.Ellipse({
                      left: startPoint.x,
                      top: startPoint.y,
                      rx: 0,
                      ry: 0,
                      fill: undefined,
                      stroke: "red",
                    });
                  }
                }

                break;
              case "l":
                shape = new fabric.Line(
                  [startPoint.x, startPoint.y, startPoint.x, startPoint.y],
                  {
                    fill: undefined,
                    stroke: "red",
                  }
                );
                break;
              default:
                break;
            }
            if (shape) {
              f.add(shape); //添加图形
              f.requestRenderAll(); //刷新画布
            }
          }
          window.selected = e?.target; // 当点击选择到有可选图形时，会获得图形的数据。
        })
        .on("mouse:move", (e) => {
          console.log("move this.isDrawingCircle:", this.isDrawingCircle);
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
              case "r":
                shape.set({
                  left: minX,
                  top: minY,
                  width: w,
                  height: h,
                  absolutePositioned: true, // 设置为绝对定位
                });
                break;
              case "c":
                {
                  if (this.isDrawingCircle) {
                    var radius = w / 2;
                    shape.set({
                      left: minX,
                      top: minY,
                      radius: radius,
                      absolutePositioned: true, // 设置为绝对定位
                    });
                  } else {
                    shape.set({
                      left: minX,
                      top: minY,
                      rx: w / 2,
                      ry: h / 2,
                      absolutePositioned: true, // 设置为绝对定位
                    });
                  }
                }
                break;
              case "l":
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
                  absolutePositioned: true, // 设置为绝对定位
                });
                break;
              default:
                break;
            }
            this.shape = shape;
            this.startPoint = startPoint;
            f.requestRenderAll();
          }
        })
        .on("mouse:up", (e) => {
          if (drawType && shape) {
            shape.setCoords(); // 更新图像坐标；
            // drawType = null
            f.selection = true;
            shape = null;
            f.requestRenderAll();
          }
        });
    },
    //添加画布对象事件
    initDrawAddEvent(canvas) {
      canvas.on("object:added", (options) => {
        this.addStack.push("other");
        console.log("object:added:", options);
      });
    },
    //撤销
    // back(){
    //   this.canvas = new fabric.Canvas("c");
    //   this.canvas.undo();
    // },
    // restore() {
    //   this.canvas.redo();
    // },
    // 撤销
    back() {
      const backPop = this.addStack.pop();
      console.log("执行撤销操作 backPop:", backPop);
      if (backPop == "eraser") {
        //当撤销的是橡皮擦除操作时
        console.log(
          "执行撤销操作this.undoStack.length:",
          this.undoStack.length
        );
        if (this.undoStack.length === 0) return;
        const obj = this.undoStack.pop();
        this.delList.push("eraser"); //记录橡皮擦除撤销之后恢复 索引位置
        this.redoStack.push(obj);
        // console.log("this.canvas.remove(obj)",this.canvas.remove(obj));
        canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
        canvas.freeDrawingBrush.width = 10;
        canvas.freeDrawingBrush.inverted = true;
        canvas.isDrawingMode = true;
        // this.canvas.remove(obj);
        // // this.canvas.add(obj);
        // // this.canvas.setActiveObject(obj);
        //   this.canvas.freeDrawingBrush.inverted = true // 恢复被擦拭的地方
        this.canvas.renderAll();
      } else {
        if (this.canvas._objects.length > 0) {
          console.log("执行撤销操作");
          this.delList.push(this.canvas._objects.pop());
          this.canvas.renderAll();
        }
      }
    },
    // 恢复
    restore() {
      console.log("执行恢复操作");
      if (this.delList.length > 0) {
        const popRedo = this.delList.pop();
        if (popRedo == "eraser") {
          if (this.redoStack.length === 0) return;
          const obj = this.redoStack.pop();
          this.undoStack.push(this.canvas.getActiveObject());
          this.canvas.remove(this.canvas.getActiveObject());
          this.canvas.add(obj);
          this.canvas.setActiveObject(obj);
          this.canvas.renderAll();
        } else {
          this.isRedoing = true;
          this.canvas.add(popRedo);
          this.canvas.renderAll();
        }
      }
    },
    //上传图片
    handleBeforeUpload(file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // 读取文件为Base64
      reader.onload = (e) => {
        console.log("图片的Base64编码：", e.target.result);
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
          img.hasControls = false; //只能移动不能（编辑）操作
          this.canvas.centerObject(img);
        });
      };
      return false; // 阻止默认上传行为
    },
    handleRemove(file, fileList) {
      console.log("file:", file, "fileList", fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    //橡皮擦功能
    startEraser() {
      this.canvas.on("path:created", (options) => {
        this.addStack.push("eraser"); //记录画布 添加元素动作及索引位置
        this.undoStack.push(options);
        console.log("橡皮擦擦除this.undoStack:", this.undoStack);
        // console.log("this.canvas._objects:",this.canvas._objects,"options:",options);
      });
      this.value = ""; //关闭形状绘画
      console.log("startEraser this.drawType:", this.drawType);
      this.canvas.freeDrawingBrush = new fabric.EraserBrush(this.canvas);
      this.canvas.freeDrawingBrush.width = 10;
      this.canvas.isDrawingMode = true;

      // this.$refs.iconPaint.style.color = '#fff';
    },
    //保存画布
    save() {
      console.log("调用了下载画布方法");
      const dataUrl = this.canvas.toDataURL("png");
      this.downloadIamge(dataUrl, "newimg");
    },
    downloadIamge(imgsrc, name) {
      var a = document.createElement("a");
      a.href = imgsrc;
      a.download = name;
      a.click();
    },
  },
  mounted() {
    this.canvas = f = new fabric.Canvas("c", {
      backgroundColor: "#ff0",
      width: 600,
      height: 600,
      selectionFullyContained: true,
      borderColor: "#ff0",
    });
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = "#2080f0";
    fabric.Object.prototype.cornerStyle = "circle";
    fabric.Object.prototype.cornerSize = 8;
    fabric.Object.prototype.borderColor = "#2080f0";

    var deleteIcon =
      "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

    var img = document.createElement("img");
    img.src = deleteIcon;

    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: 16,
      cursorStyle: "pointer",
      mouseUpHandler: deleteObject,
      render: renderIcon,
      cornerSize: 24,
    });
    function deleteObject(eventData, transform) {
      var target = transform.target;
      var canvas = target.canvas;
      canvas.remove(target);
      canvas.requestRenderAll();
    }

    function renderIcon(ctx, left, top, styleOverride, fabricObject) {
      var size = this.cornerSize;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      // ctx.drawImage(img, -size / 4, -size / 2, size / 2, size / 2);
      ctx.drawImage(img, -size / 4, -size / 2, size / 2, size / 2);
      ctx.restore();
    }

    drawType = "r";
    this.initHotkey(); // 声明图形绘画的启用快捷键
    this.initDrawEvent(f); // 创建图形绘画相关事件；
    this.initDrawAddEvent(f);
    const imageUrl = "";
    this.canvas.setBackgroundImage(
      imageUrl,
      this.canvas.renderAll.bind(this.canvas)
    );
    // this.canvas.selectionFullyContained = true;
    // // 拦截对象选中事件
    // this.canvas.on("before:selection:cleared", (options) => {
    //   let activeObject = options.target;
    //   if (!activeObject.selectable) {
    //     options.preventDefault = true;
    //   }
    // });

    // this.canvas.on("selection:created", () => {
    //   const activeObject = this.canvas.getActiveObject();
    //   if (activeObject && !activeObject.selectable) {
    //     this.canvas.discardActiveObject();
    //     this.canvas.requestRenderAll();
    //   }
    // });
  },
  watch: {
    value(newVal, oldVal) {
      drawType = newVal;
    },
    shiftKey(newVal, oldVal) {
      console.log("this.shiftKey:newVal", newVal);
      this.isDrawingCircle = newVal;
    },
    alphaValue(newVal, oldVal) {
      drawType = newVal;
    },
  },
};
</script>
 
<style scoped lang="scss">
::v-deep.el-select {
  right: 8px;
  bottom: 24px;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  .el-input {
    opacity: 0;
    width: 24px;
    height: 24px;
    .el-input__inner {
      display: none;
      width: 24px;
      height: 24px;
      padding: 0 !important;
      background-color: rgba(255, 255, 255, 0.2) !important;
    }
    .el-input__suffix {
      display: none;
    }
  }
}
::v-deep.el-select-dropdown {
  background: #59595a !important;
  .el-scrollbar {
    background: #59595a !important;
    border-radius: 4px;
    .el-select-dropdown__item {
      color: #959595; //color:#959595;
      font-size: 16px;
      font-family: AliRegular;
      display: flex;
      justify-content: left;
      align-items: center;
      img {
        margin-right: 5px;
      }
    }
    .el-select-dropdown__item.selected {
      color: #fff;
      font-weight: normal;
    }
    .el-select-dropdown__item.hover {
      background-color: #59595a;
    }
  }
  .popper__arrow {
    border-bottom: #fff;
    left: 43%;
  }
  .popper__arrow::after {
    border-bottom-color: #59595a;
  }
}
.alpha-selected {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 48px;
  line-height: 48px;
  margin: 60px;
  border-radius: 4px;
  .select-alpha-icon {
    // position: absolute;
  }
}
.color-picker {
  margin: 0;
  padding: 0;
  width: 18px;
  height: 18px;
  background-color: #fff;
  // margin: 0 auto;
  border: 2px solid #6c6c6c;
  /* box-shadow: inset 0px 0px 67px 37px #cccccc; */
  /* 实现蒙蔽效果 */
  position: relative;
  border-radius: 2px;
  z-index: 998;
  span:nth-child(1) {
    margin: 0;
    padding: 0;
    display: block;
    width: 8px;
    height: 8px;
    border-right: 2px solid #6c6c6c;
    border-bottom: 2px solid #6c6c6c;
    z-index: 999;
    position: absolute;
    right: -2px;
    bottom: -2px;
    box-sizing: content-box;
  }

  span:nth-child(1)::after {
    content: "";
    margin: 0;
    padding: 0;
    display: block;
    width: 8px;
    height: 8px;
    position: absolute;
    background-color: #fff;
    z-index: 999;
    border: 2px solid transparent;
    top: 4px;
    left: 4px;
    transform: rotate(45deg);
    border-left: 2px solid #6c6c6c;
    // box-shadow:inset 0px 0px 67px 37px #6C6C6C
  }
}
.cdie {
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
}
.icon-paint {
  width: 24px;
  height: 24px;
  color: blue;
  background-color: #f00;
}
::v-deep.icon-icon-paint {
  width: 24px;
  height: 24px;
  color: #d34da2;
}
.image-container {
  position: relative;
  display: inline-block;
  width: 24px; /* 或者你需要的宽度 */
  height: 24px; /* 或者你需要的高度 */
  overflow: hidden;
  // img{
  //   background-color: rgb(255, 0, 0); /* 半透明的红色背景 */
  //   // background-image: url('../assets/colorpicker.png');
  //   background-size: 50%; /* 根据需要调整背景图片大小 */
  //   background-repeat: no-repeat;
  //   background-position: center;
  // }
  //   img::before{
  //       content: '';
  //       display: block;
  //       position: absolute;
  //       top: 0;
  //       left: 0;
  //       width: 22px;
  //       height: 22px;
  //       background-color: rgba(255, 0, 0, 0.5); /* 半透明的红色背景 */
  //       // background-image: url('../assets/colorpicker.png');
  //       background-size: 50%; /* 根据需要调整背景图片大小 */
  //       background-repeat: no-repeat;
  //       background-position: center;
  //   }
}

// .image-container::before {
//   content: '';
//   display: block;
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background-color: rgba(255, 0, 0, 0.5); /* 半透明的红色背景 */
//   background-image: url('../assets/colorpicker.png');
//   background-size: 50%; /* 根据需要调整背景图片大小 */
//   background-repeat: no-repeat;
//   background-position: center;
// }
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