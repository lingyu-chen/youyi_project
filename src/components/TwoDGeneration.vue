<template>
  <div class="twoDtothreeD-container">
    <div class="to-left">
      <canvas id="c" ref="tutorial" :width="width" :height="height" class="panel-white">
      </canvas>
      <div class="tool-navigation-container">
        <div class="tool-cancel-confirm" v-if="isConfirm">
          <div class="tool-cancel" @click="cancelGeneration()">
            <i class="el-icon-close" style="marginRight:8px"></i>
            <span>取消</span>
          </div>
          <div class="tool-confirm" @click="confirmGeneration()">确认</div>
        </div>
        <div class="tool-navigation" v-show="!isAmongGeneration" v-else>
          <div class="undo-redo">
            <img src="../assets/undo.png" @click="back()" alt="" style="marginRight: 16px;">
            <img src="../assets/redo.png" @click="restore()" alt="">
          </div>
          <div class="line-right"></div>
          <div class="default-selected">
            <div class="hover-selected">
              <img src="../assets/selected.png" alt="" class="mouse-selected">
            </div>
          </div>
          <div class="line-right"></div>
          <div class="eraser-paint-graph">
            <div class="color-selected">
              <!-- <div class="color-picker"><span></span></div> -->
              <div style="display: inline-block;position: relative; ">
                <el-popover
                    placement="bottom"
                    width="24px"
                    trigger="click"
                    content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                  <el-button slot="reference" class="color-box"
                             :style="{ backgroundColor: colorPicker,padding: '0px',position:'absolute',left:'0',top:'0',zIndex:999,opacity:'0',width:'24px',height:'24px' }">
                    <div style="width: 100%;height:100%;border: 2px solid gainsboro">
                      <!-- <i  style="font-size: 25px; font-weight: lighter;line-height: 34px; color: white" class="el-icon-arrow-down icon">
                      </i> -->
                    </div>
                  </el-button>
                  <sketch-picker v-model="colorPicker" @input="colorValueChange"/>
                </el-popover>
                <div class="color-picker" :style="{backgroundColor: colorPicker}"><span></span></div>
                <!-- <span class="icon-icon-paint" style="marginRight: 16px;" ref="iconPaint"></span> -->
              </div>
            </div>
            <div class="paint-selected">
              <img src="../assets/paint.png" alt="" @click="startPaint()">
            </div>
            <div class="paint-selected">
              <img src="../assets/eraser.png" alt="" @click="startEraser()">
            </div>
            <div class="alpha-selected">
              <img src="../assets/alpha.png" alt="">
              <img src="../assets/selectAlpha.png" alt="">
            </div>
          </div>
          <div class="line-right"></div>
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
                  multiple
                  :limit="2"
                  :on-exceed="handleExceed"
                  :file-list="fileList">
                <el-button size="small" type="primary"
                           style="display: block; width: 24px;height: 24px;padding: 0;margin: 0;opacity: 0;"></el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
            </div>

            <img src="../assets/tooldownload.png" alt="" @click="save()">
          </div>
          <div class="line-right"></div>
          <div class="twoD-generation-container">
            <div class="twoD-generation"><img src="../assets/generationicon.png" alt="">2D to 3D</div>
          </div>

        </div>
        <el-select v-model="shapeValue" placeholder="请选择" style="position: absolute;right:128px">
          <el-option
              v-for="item in shapeLists"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="loading-mask" v-if="isAmongGeneration">
      <div class="loading-icon">
        <i class="el-icon-loading"></i>
      </div>
      <div class="cancel-button" @click="cancelGenerate()"><i class="el-icon-close" style="marginRight:10px"></i>取消
      </div>
    </div>
    <div class="result-img-container" v-show="isConfirm">
      <div class="result-img" ref="resultImg"></div>
    </div>
    <div class="to-right">
      <div class="prompt">
        <span>Prompt 提示词</span>
        <el-input
            class="input-text"
            type="textarea"
            :rows="4"
            placeholder="请输入您的提示词。"
            v-model="promptStr">
        </el-input>
      </div>
      <div class="ai-rate">
        <div class="rate-content">
          <span class="rate-text">AI影响率</span>
          <span class="rate-value">{{ percentage }}%</span>
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
            <!-- <div class="history-img" :style="{ backgroundImage: 'url('+item.preLink+')' }"></div> -->
            <img :src="item.preLink" alt="" class="history-img">
            <div class="hover-gray-img">
              <div class="hover-gray"></div>
              <img src="../assets/Vector.png" alt="" class="vector-img">
            </div>
          </div>
          <!-- <div class="img-hover" v-for="(item,index) in history" :key="index">
            <img :src="item.preLink" alt="" class="history-img">
            <div class="hover-gray-img">
              <div class="hover-gray"></div>
              <img src="../assets/Vector.png" alt="" class="vector-img">
            </div>
          </div> -->
        </div>
      </div>
      <div class="generation-scheme">
        <el-button disabled v-if="isAmongGeneration">AI 方案生成中...</el-button>
        <el-button @click="generateScheme()" v-else>AI 生成方案</el-button>
      </div>

    </div>
  </div>
</template>

<script>
import Progress from './Progress.vue';
import {
  getStyleList,
  getProjectDetail,
  getHistoryList,
  projectSave,
  taskGenerate,
  uploadFile,
  fileFinish,
  cancelTask,
  findTaskStatus,
  fileOverwrite
} from '@/api/index'
import {Sketch} from 'vue-color';
import {fabric} from 'fabric-with-erasing'
//形状绘图
import hotkeys from 'hotkeys-js';//判断热键值
window.fabric = fabric;
let f = null
// let canvas = ref();
let drawType;
export default {
  components: {
    // HelloWorld
    Progress,
    "sketch-picker": Sketch
  },
  data() {
    return {
      textarea: '',
      percentage: 0,//AI影响率
      styleLists: [],//风格列表
      styleValue: '',
      type: this.$route.query.type,//项目类型
      id: this.$route.query.id,//项目id
      detail: {},//项目详情
      promptStr: '',//将prompt转为字符串
      history: [],//历史记录图片
      //画布 画笔部分
      isDrawing: false,//用来判断是否落笔
      mainDrawing: false,//用来控制是否点画笔
      lastX: 0,
      lastY: 0,
      context: null,
      width: 720,
      height: 720,
      paintWidth: 2,
      colors: 'red',
      colorPicker: "#f00",
      //画布 形状绘图部分
      canvas: this.$refs.canvas,
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
      count: 0,
      isDrawingCircle: false,//是否点击shift画圆
      shiftKey: false,//判断是否点击了shift
      delList: [], // 被删除的数据，
      fileList: [],
      saveProjectObj: {},//保存项目时传递的对象
      isGenerateScheme: true,//根据这个变量值来确认2D to 3D按钮是否置灰
      isDuringGeneration: false,//点击生成任务时置为 true 发起生成任务成功置为 false
      isAmongGeneration: false,//是否在任务生成中
      tasks: [],//用于查询任务状态赋值
      isConfirm: false,//是否是任务生成以后的确认状态 点击生成方案时置为 true,false
      tid: '',
      // operations:this.$refs.canvas._objects,//操作列表
    }
  },
  mounted() {
    //画布 形状绘制
    this.canvas = f = new fabric.Canvas("c");
    drawType = '';
    this.initHotkey() // 声明图形绘画的启用快捷键
    this.initDrawEvent(f) // 创建图形绘画相关事件；
    this.colorPicker = '#ff0000';//初始化画笔颜色
    console.log("type(TwoDGeneration)=", this.type);
    //获取风格列表
    getStyleList().then(response => {
          this.styleLists = response.data.styles;
          console.log('请求成功了!styleLists', this.styleLists);
        },
        error => {
          console.log('请求失败了!', error);
        }
    );
    //获取项目详情
    this.getProjectDetails();
    //获取历史记录图片
    getHistoryList(this.$route.query.id).then(
        response => {
          this.history = response.data.history;
          console.log("获取历史记录图片请求成功了！", this.history);
        },
        error => {
          console.log('获取详情请求失败了!', error);
        }
    );
    // this.$refs.iconPaint.style.color = '#fff';//初始化画笔颜色为白色
    // this.drawImageOnCanvas(this.detail.canvas.link);//将图片加载到画布上
  },
  beforeDestroy() {
    if (this.timerId) {//清除查询任务状态详情定时器
      console.log("cancelTask this.timerId:", this.timerId)
      clearInterval(this.timerId);
    }
  },
  methods: {
    getProjectDetails() {
      //获取项目详情
      getProjectDetail(this.$route.query.id).then(
          response => {
            this.detail = response.data;
            this.percentage = this.detail.aiRate * 100;

            this.promptStr = this.detail.prompt != null ? this.detail.prompt.join() : "";
            this.styleValue = this.detail.style;
            this.tasks = this.detail.tasks;
            if (this.detail.canvas != null)
              this.convertURLToBase64(this.detail.canvas.link)//将url图片转为base64,并在转换之后调用drawImageOnCanvas方法 将图片加载到画布上
            this.isAmongGeneration = this.getDuringGeneration();//初始判断是否还在RUNNING
            if (response.data.status == 'FINISHED') {
              this.isConfirm = true;
              const resultImg = this.$refs.resultImg;
              resultImg.style.backgroundImage = 'url(' + response.data.result.link + ')';
              resultImg.style.backgroundRepeat = 'no-repeat';
              resultImg.style.backgroundSize = 'cover';
              resultImg.style.backgroundPosition = 'cover';
            }
            if (response.data.status == 'RUNNING') {
              this.isDuringGeneration = true;
              const task = this.findTargetRunningTask(response.data.tasks)
              this.timerId = setInterval(() => {//设置一个查询任务状态详情的定时器
                this.findStatus(task.tid);
              }, 3000); // 每隔3秒执行一次
            }
            // this.drawImageOnCanvas(this.imageSrc);//将图片加载到画布上
            // console.log("this.detail.aiRate=",this.detail.aiRate);
            this.$bus.$emit('getInitialPercntage', this.percentage);
            console.log("获取详情请求成功了！", this.detail);
          },
          error => {
            console.log('获取详情请求失败了!', error);
          }
      );
    },
    drawImageOnCanvas(imageUrl) {
      // console.log("加载画布中...",this.imageSrc)
      // this.convertURLToBase64(imageUrl)
      // const imgUrl = this.imageSrc;//base64
      fabric.Image.fromURL(imageUrl, (img) => {
        img.set({
          // scaleX: this.canvas.width / img.width,
          // scaleY: this.canvas.height / img.height,
          left: 100,
          top: 100,
          width: img.width,
          height: img.height,
        });
        console.log("加载画布中...")
        this.canvas.add(img);
        this.canvas.centerObject(img);
      });

      return false; // 阻止默认上传行为
    },
    getRateValue(percentage) {
      this.percentage = percentage;
    },
    //画布 自由绘画
    startPaint() {
      console.log("开启自由绘画")
      this.shapeValue = '';//关闭形状绘画
      this.freeDraw();
    },
    freeDraw() {
      console.log("自由绘画 this.drawType:", this.drawType);
      if (this.canvas == null) {
        this.canvas = new fabric.Canvas("c");
        // this.canvas.backgroundColor = '#efefef';
        // this.canvas.isDrawingMode= 1;
      }
      this.canvas.isDrawingMode = 1;
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
      // this.$refs.iconPaint.style.color = this.colors;
    },
    //橡皮擦功能
    startEraser() {
      this.shapeValue = '';//关闭形状绘画
      console.log("startEraser this.drawType:", this.drawType);
      this.canvas.freeDrawingBrush = new fabric.EraserBrush(this.canvas);
      this.canvas.freeDrawingBrush.width = 10;
      this.canvas.isDrawingMode = true;
      // this.$refs.iconPaint.style.color = '#fff';
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
      hotkeys('*', {keyup: true}, (evn, handler) => {
        if (evn.type === 'keydown' && hotkeys.shift) {
          this.shiftKey = true;
          console.log("点击了shift键:", this.shiftKey)
        }
        if (evn.type === 'keyup') {
          this.shiftKey = false;
          console.log("松开了shift键:", this.shiftKey)
        }
      });
    },
    initDrawEvent(canvas) {
      let shape = fabric.Object | null;
      let startPoint = fabric.IPoint; // 记录初始坐标
      canvas.on('mouse:down', (e) => {
        // if (e.target || !drawType) {
        //   // 如果绘画点击在图片上，则不进行绘画
        //   return;
        // }
        console.log("点击次数:drawType", this.count++, drawType);
        if (!shape) {
          // this.$refs.iconPaint.style.color = '#fff';
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
            case 'c': {
              if (this.isDrawingCircle) {
                shape = new fabric.Circle({
                  left: startPoint.x,
                  top: startPoint.y,
                  fill: '',
                  stroke: 'red'
                });
              } else {
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
        console.log("move this.isDrawingCircle:", this.isDrawingCircle)
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
            case 'c': {
              if (this.isDrawingCircle) {
                var radius = w / 2;
                shape.set({
                  left: minX,
                  top: minY,
                  radius: radius,
                });
              } else {
                shape.set({
                  left: minX,
                  top: minY,
                  rx: w / 2,
                  ry: h / 2,
                });
              }
              ;
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
        console.log("执行撤销操作:", this.canvas._objects)
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
            // width: 300,
            // height: 300,
          });
          this.canvas.add(img);
          this.canvas.centerObject(img);
        });
      };
      return false; // 阻止默认上传行为
    },
    convertURLToBase64(url) {//url图片转base64
      console.log("convertURLToBase64执行")
      fetch(url)
          .then(response => response.blob())
          .then(blob => {
            // 创建一个FileReader实例
            const reader = new FileReader();
            reader.onload = e => {
              this.imageSrc = e.target.result;
              this.drawImageOnCanvas(this.imageSrc);//将图片加载到画布上
              // console.log('this.imageSrc:',this.imageSrc);
            };
            reader.readAsDataURL(blob);
          });
      return this.imageSrc
    },
    handleRemove(file, fileList) {
      console.log("file:", file, "fileList", fileList);
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
    save() {
      console.log("调用了下载画布方法")
      const dataUrl = this.canvas.toDataURL('png');
      this.downloadIamge(dataUrl, 'newimg');
    },
    downloadIamge(imgsrc, name) {
      var a = document.createElement("a");
      a.href = imgsrc;
      a.download = name;
      a.click();
    },
    generateScheme() {
      this.isDuringGeneration = true;//方案生成中将其置为true
      this.saveProjectObj.id = this.detail.id;
      this.saveProjectObj.name = this.detail.name;
      this.saveProjectObj.aiRate = this.percentage / 100;
      this.saveProjectObj.style = this.detail.style;
      this.saveProjectObj.style = this.styleValue;
      // if(Array.isArray(this.detail.prompt))
      //   this.saveProjectObj.prompt = this.detail.prompt;
      // else
      this.saveProjectObj.prompt = this.promptStr.split(",");
      if (this.canvas._objects.length == 0)
        this.saveProjectObj.modified = false;
      else
        this.saveProjectObj.modified = true;
      console.log("prompt:", this.detail.prompt, "percentage:", this.percentage, "this.saveProjectObj:", this.saveProjectObj);
      console.log("this.canvas._object:", this.canvas._objects.length)

      projectSave(this.saveProjectObj).then(
          async (response) => {
            console.log("保存项目 请求成功了", response);
            const projectId = response.data.id;
            if (this.saveProjectObj.modified == false) {
              const tid = await this.getTaskGenerate(projectId);
              this.setTimer(tid);
            } else {
              const dataURL = this.canvas.toDataURL({
                format: 'png', // 指定输出格式，这里是PNG
                quality: 1.0   // 图片质量，范围从0到1
              });
              const blobObj = this.base64ToBlob({b64data: dataURL, contentType: 'image/png'})
              const url = response.data.uploadParams[0].hostUrl;
              const fileId = response.data.uploadParams[0].fileId;
              console.log("dataURL:", blobObj)
              uploadFile(url, blobObj).then(
                  response => {
                    console.log("上传文件 请求成功了", response);
                    this.getFileFinish(projectId, fileId);//调用文件上传通知接口
                  },
                  error => {
                    console.log("上传文件 请求失败了", error);
                  }
              )
            }
          },
          error => {
            console.log("保存项目 请求失败了", error);
          }
      )
    },
    getFileFinish(projectId, fileId) {
      fileFinish({projectId: projectId, fileId: fileId, finish: true}).then(
          async (response) => {
            console.log("文件上传完成通告 请求成功了", response);
            if (response.data.status == true) {
              let tid = await this.getTaskGenerate(projectId)//调用发起生成任务接口
              console.log("async tid")
              this.setTimer(tid)
              console.log("文件保存成功");
            } else
              console.log("文件保存失败");
          },
          error => {
            console.log("文件上传完成通告 请求失败了", error);
          }
      )
    },
    async getTaskGenerate(projectId) {
      let tid;
      await taskGenerate({projectId: projectId}).then(
          response => {
            tid = response.data.tid;
            console.log("发起生成任务 请求成功了", response);
          },
          error => {
            console.log("发起生成任务 请求失败了", error);
          }
      )
      return tid;
    },
    setTimer(tid) {
      this.timerId = setInterval(() => {//设置一个查询任务状态详情的定时器
        this.findStatus(tid);
      }, 3000); // 每隔3秒执行一次
    },
    findStatus(tid) {
      console.log("findStatus tid 2:", tid)
      findTaskStatus(tid).then(
          response => {
            this.tasks = response.data.results;
            const finishTask = this.findTargetFinishedTask(this.tasks);//获得状态为FINISHED的目标task
            if (finishTask != null) {
              console.log("734row findTaskStatus finishTask:", finishTask)
              this.displayAfterRenerImage(finishTask);//清除定时器并且加载渲染后的图片
            }
            console.log("查询任务状态详情 请求成功了!", response)//待定
          },
          error => {
            console.log("查询任务状态详情 请求失败了!", error)
          }
      )
    },
    base64ToBlob({b64data = '', contentType = '', sliceSize = 512} = {}) {
      // 使用 atob() 方法将数据解码
      const b64dataformat = b64data.substring(('data:image/png;base64,').length);
      console.log("b64dataformat:", b64dataformat)
      let byteCharacters = atob(b64dataformat);
      let byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);
        let byteNumbers = [];
        for (let i = 0; i < slice.length; i++) {
          byteNumbers.push(slice.charCodeAt(i));
        }
        // 8 位无符号整数值的类型化数组。内容将初始化为 0。
        // 如果无法分配请求数目的字节，则将引发异常。
        byteArrays.push(new Uint8Array(byteNumbers));
      }
      let result = new Blob(byteArrays, {
        type: contentType
      })
      return result;
    },
    cancelGenerate() {//点击取消按钮取消生成任务
      getProjectDetail(this.$route.query.id).then(
          response => {
            this.tasks = response.data.tasks;
            const tasks = this.tasks;
            let tid;
            for (var i = 0; i < tasks.length; i++) {
              console.log((tasks[i].status == 'RUNNING') || (tasks[i].status == 'READY') || (tasks[i].status == 'UPLOADING'))
              if ((tasks[i].status == 'RUNNING') || (tasks[i].status == 'READY') || (tasks[i].status == 'UPLOADING')) {
                tid = tasks[i].tid;
              }
            }
            console.log("cancelGenerate!", tid)
            cancelTask(tid).then(
                response => {
                  console.log("this.isDuringGeneration before:", this.isDuringGeneration)
                  this.isDuringGeneration = false;
                  console.log("this.isDuringGeneration after:", this.isDuringGeneration)
                  if (this.timerId) {//清除查询任务状态详情定时器
                    console.log("cancelTask this.timerId:", this.timerId)
                    clearInterval(this.timerId);
                  }
                  console.log("取消任务 请求成功了!", response)
                },
                error => {
                  console.log("取消任务 请求失败了!", error)
                }
            )
          },
          error => {
            cosole.log("取消生成任务失败")
          }
      )

    },
    findTargetFinishedTask(tasks) {//找到状态为FINISHED的目标task
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].status == 'FINISHED') {
          return tasks[i]
        } else {
          return null;
        }
      }
    },
    findTargetRunningTask(tasks) {//找到状态为FINISHED的目标task
      console.log("findTargetRunningTask tasks:", tasks)
      for (var i = 0; i < tasks.length; i++) {
        if ((tasks[i].status == 'RUNNING') || (tasks[i].status == 'READY') || (tasks[i].status == 'UPLOADING')) {
          return tasks[i]
        } else {
          return null;
        }
      }
    },
    confirmGeneration() {//确认 生成任务
      this.isConfirm = false;
      this.finishFileOverwrite();
    },
    cancelGeneration() {//取消生成任务
      this.isConfirm = false;//返回原来的画布
      // this.convertURLToBase64(this.detail.canvas.link);//返回原来的画布
    },
    getDuringGeneration() {
      let isStatus;
      if (this.detail.status == 'RUNNING') {
        const tasks = this.detail.tasks;
        for (var i = 0; i < tasks.length; i++) {
          if ((tasks[i].status == 'RUNNING') || (tasks[i].status == 'READY') || (tasks[i].status == 'UPLOADING')) {
            this.tid = tasks[i].tid;
            console.log("this.tid 1:", this.tid)
            isStatus = true;
          } else {
            isStatus = false;
          }
        }
      } else
        isStatus = false;
      if (this.isDuringGeneration || isStatus) {
        console.log("this.isDuringGeneration||isStatus:", this.isDuringGeneration || isStatus)
        return true;
      } else {
        console.log("this.isDuringGeneration||isStatus:", this.isDuringGeneration || isStatus)
        return false;
      }
      // if(this.isDuringGeneration ||this)
    },
    finishFileOverwrite() {
      const param = {projectId: this.detail.id}
      console.log(" param: ", param, this.detail)
      fileOverwrite(param).then(
          response => {
            this.canvas.clear(); // 清除画布上的所有对象
            this.getProjectDetails();//请求最新的项目详情
            console.log("覆盖当前画布 请求成功了!", response)
          },
          error => {
            console.log("覆盖当前画布 请求失败了!", error)
          }
      )
    },
    displayAfterRenerImage(finishTask) {//清除定时器并且加载渲染后的图片
      if (this.timerId) {//清除查询任务状态详情定时器
        clearInterval(this.timerId);
        // console.log("taskGenerate :",finishTask.result.link)
        this.isDuringGeneration = false;
        // this.findStatus();//任务完成时再次调用 拿到最新的任务状态详情(result)
        this.isConfirm = true;//任务生成成功完成时 要显示确认和取消栏
        const resultImg = this.$refs.resultImg;
        console.log("890row response.data:", finishTask)
        resultImg.style.backgroundImage = 'url(' + finishTask.result.link + ')';
        resultImg.style.backgroundRepeat = 'no-repeat';
        resultImg.style.backgroundSize = 'cover';
        resultImg.style.backgroundPosition = 'cover';
        // this.convertURLToBase64(task.result.link)
      }
    }
  },
  computed: {},
  watch: {
    shapeValue(newVal, oldVal) {
      drawType = newVal;
      this.canvas.isDrawingMode = 0;//关闭自由绘画功能和橡皮擦功能
      // this.$refs.iconPaint.style.color = '#fff';
      console.log("关闭自由绘画功能和橡皮擦功能 this.canvas.isDrawingMode", this.canvas.isDrawingMode)
    },
    shiftKey(newVal, oldVal) {
      console.log("this.shiftKey:newVal", newVal)
      this.isDrawingCircle = newVal;
    },
    delList(newVal, oldVal) {
      console.log("delList:", newVal);
    },
    isDuringGeneration(newVal, oldVal) {
      console.log("isDuringGeneration newVal:", newVal)
      this.isAmongGeneration = this.getDuringGeneration();
      console.log("this.isAmongGeneration:", this.isAmongGeneration)
    },
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/style.css';

.icon-icon-paint {
  width: 24px;
  height: 24px;
  color: #d34da2;
  font-size: 21px;
}

.twoDtothreeD-container {
  width: 100%;
  height: 100vh;
  display: flex;
  color: #fff;
  font-family: AliMedium;

  .to-left {
    display: inline-block;
    width: 1552px;
    height: 996px;
    background-color: #d4d4d4;

    .panel-white {
      // width: 1322px;
      // height: 734px;
      background-color: #fff;
      position: relative;
      left: 0;
      right: 0;
      top: 114px;
      margin: auto;
      // margin: 75px 115px 0 115px;
      img {
        margin: 87px 509px 60px 438px;
      }
    }

    /deep/ .canvas-container {
      // width: 1322px;
      // height: 734px;
      position: relative;
      left: 0;
      right: 0;
      top: 114px;
      margin: auto;
      background-color: #fff;
      // margin: 75px 115px 0 115px;
    }

    /deep/ .lower-canvas {
      margin: 0px;
    }

    .tool-navigation-container {
      // position:relative;
      width: 100%;
      display: flex;
      justify-content: center;
      height: 162px;
      position: relative;
      top: 114px;
      align-items: center;

      .tool-navigation {
        position: absolute;
        width: 640px;
        height: 64px;
        bottom: 34px;
        background-color: #212123;
        // margin: 91px 0 32px 0;
        border-radius: 32px;

        .undo-redo {
          display: inline-flex;
          // padding: 8px 16px;
          margin: 0 16px 0 30px;
          width: 64px;
          height: 100%;
          //居中操作
          // display: flex;
          justify-content: center;
          align-items: center;
          // border-right: 1px solid #3d3d3d;
        }

        .default-selected {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          // position: relative;
          // padding: 8px 16px;
          width: 56px;
          height: 100%;

          .hover-selected {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            // position: absolute;
            // top: 0;
            // bottom: 0;
            // margin: auto;
            width: 40px;
            height: 48px;
            line-height: 48px;
            z-index: 998;
          }
        }

        .hover-selected:hover {
          background-color: #5034ff;
          border-radius: 4px;
        }

        .line-right {
          position: absolute;
          top: 0;
          bottom: 0;
          margin: auto;
          display: inline-block;
          height: 40px;
          border-right: 1px solid #3d3d3d;
        }

        .eraser-paint-graph {
          // display: inline-block;
          // padding: 8px 16px;
          // margin: 12px 0 ;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          // position: relative;
          // padding: 8px 16px;
          // width: 56px;
          height: 100%;
          // border-right: 1px solid #3d3d3d;
          .color-selected {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 40px;
            height: 48px;
            line-height: 48px;
            z-index: 998;
            margin-left: 8px;

            .color-picker {
              margin: 0;
              padding: 0;
              width: 18px;
              height: 18px;
              background-color: #ff0000;
              // margin: 0 auto;
              border: 2px solid #6C6C6C;
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
                border-right: 2px solid #6C6C6C;
                border-bottom: 2px solid #6C6C6C;
                z-index: 999;
                position: absolute;
                right: -2px;
                bottom: -2px;
                box-sizing: content-box;
              }

              span:nth-child(1)::after {
                content: '';
                margin: 0;
                padding: 0;
                display: block;
                width: 8px;
                height: 8px;
                position: absolute;
                background-color: #212123;
                z-index: 999;
                border: 2px solid transparent;
                top: 4px;
                left: 4px;
                transform: rotate(45deg);
                border-left: 2px solid #6C6C6C;
                // box-shadow:inset 0px 0px 67px 37px #6C6C6C
              }
            }
          }

          .color-selected:hover {
            box-sizing: border-box;
            border: 2px solid #5034ff;
            border-radius: 4px;
          }

          .paint-selected, .alpha-selected {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 40px;
            height: 48px;
            line-height: 48px;
          }

          .paint-selected:hover {
            background-color: #59595a;
            border-radius: 4px;
          }

          .alpha-selected {
            width: 64px;
            margin-right: 8px;
          }

          .alpha-selected:hover {
            background-color: #5034ff;
            border-radius: 4px;
          }
        }

        .upload-download {
          display: inline-block;
          padding: 8px 16px;
          margin: 12px 0 12px 0;
          // border-right: 1px solid #3d3d3d;
        }

        .twoD-generation-container {
          display: flex;
          align-items: center; /* 垂直居中 */
          width: 165px;
          position: absolute;
          top: 0px;
          right: 8px;
        }

        .twoD-generation {
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
          // background-color: #2400ff;
          background-color: #969696;
          border-radius: 24px;
          font-family: AliMedium;
          cursor: pointer;
          // display: flex;
          // align-items: center; /* 垂直居中 */
          img {
            margin-right: 4px;
            vertical-align: middle
          }
        }
      }

      .tool-cancel-confirm {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 198px;
        height: 64px;
        border-radius: 32px;
        background: #212123;
        font-size: 20px;
        font-family: AliMedium;
        z-index: 2024;
        // text-align: center;
        // line-height: 64px;
        .tool-confirm {
          display: inline-block;
          width: 80px;
          height: 48px;
          text-align: center;
          line-height: 48px;
          border-radius: 24px;
          background: #2400ff;
          margin-left: 18px;
          cursor: pointer;
        }

        .tool-cancel {
          margin-left: 19px;
          cursor: pointer;
        }
      }
    }

  }

  .loading-mask {
    position: absolute;
    z-index: 2012;
    width: 1552px;
    height: 996px;
    background: rgba(217, 217, 217, 0.85);
    display: inline-flex;
    justify-content: center;
    align-items: center;

    .loading-icon {

      .el-icon-loading {
        font-size: 168px;
        color: #8c8c8c;
      }
    }

    .cancel-button {
      position: absolute;
      bottom: 32px;
      left: 0;
      right: 0;
      margin: auto;
      width: 154px;
      height: 48px;
      line-height: 48px;
      background: #2400ff;
      text-align: center;
      border: 8px solid #212123;
      border-radius: 32px;
      color: #fff;
      font-family: AliMedium;
      font-size: 20px;
      cursor: pointer;
    }
  }

  .result-img-container {
    position: absolute;
    z-index: 2012;
    width: 1552px;
    height: 996px;
    display: inline-flex;
    justify-content: center;
    // align-items: center;
    .result-img {
      margin-top: 114px;
      width: 720px;
      height: 720px;
      background-color: #fff;
    }
  }

  .to-right {
    display: inline-block;
    width: 368px;
    height: 996px;

    .prompt {
      height: 158px;
      border-bottom: 1px solid #3d3d3d;
      padding: 16px;
      font-size: 14px;
    }

    /deep/ .el-textarea__inner {
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

    /deep/ .el-textarea__inner::placeholder {
      font-size: 12px;
      color: #b2b2b2; /* 修改为需要的颜色 */
    }

    .ai-rate {
      height: 51px;
      border-bottom: 1px solid #3d3d3d;
      padding: 16px;
      font-size: 14px;

      .rate-content {
        display: flex;
        justify-content: space-between;
      }
    }

    .style-list {
      height: 63px;
      border-bottom: 1px solid #3d3d3d;
      padding: 16px 16px 15px 16px;

      .style-reference {
        font-size: 14px;
      }

      .el-select {
        width: 336px;
        height: 36px;
        margin-top: 8px;

        /deep/ .el-input__inner {
          background-color: #242425;
          border: 0px;
          border-radius: 8px;
          font-size: 12px;
          font-family: AliRegular;
        }

        /deep/ .el-input__inner::placeholder {
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

    .reference-image {
      height: 91px;
      border-bottom: 1px solid #3d3d3d;
      padding: 16px;

      .image-text {
        font-size: 14px;
      }

      .upload-demo {
        color: #b2b2b2;
        font-size: 12px;
        font-family: AliRegular;

        /deep/ .el-upload-dragger {
          display: flex;
          align-items: center; /* 垂直居中 */
          justify-content: center;
          width: 336px;
          height: 64px;
          background-color: #242425;
          border-radius: 8px;
          border: 0px;
          margin-top: 8px;

          .el-upload__text {
            margin-left: 4px;
            color: #b2b2b2;
            font-size: 12px;
            font-family: AliRegular;
          }
        }
      }
    }

    .history-record {
      padding: 16px 16px 24px 16px;

      .history-images {
        width: 320px; //336px-9px-7px
        height: 324px; //351px-8px-19px
        margin-top: 8px;
        border-radius: 8px;
        background-color: #242425;
        padding: 8px 7px 19px 9px;
        overflow-y: scroll;

        .img-hover {
          display: inline-block;
          position: relative;
          margin: 4px;
          //修改
          width: 152px;
          height: 154px;
          overflow: hidden; /* 超出容器部分隐藏 */
          .history-img {
            width: 100%; /* 宽度和容器一致 */
            height: 100%; /* 高度和容器一致 */
            // background-size: cover; /* 背景图片覆盖整个元素区域 */
            background-position: center; /* 背景图片居中 */
            object-fit: contain; /* 图片等比缩放填充容器 */
            border-radius: 4px;
            border: 0px;
          }

          // .history-img{
          //   width:152px;
          //   height: 154px;
          //   border-radius: 4px;
          //   border: 0px;
          // }
          .hover-gray-img {
            display: none;
            position: absolute;
            width: 152px;
            height: 154px;
            left: 0;
            top: 0;
            border-radius: 4px;

            .hover-gray {
              position: absolute;
              left: 0;
              top: 0;
              width: 152px;
              height: 154px;
              background-color: #969696;
              z-index: 998;
              opacity: 0.41;
              border-radius: 4px;
              color: #fff;
            }

            .vector-img {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              opacity: 100%;
              z-index: 999;
            }
          }

          &:hover .hover-gray-img {
            display: block;
            cursor: pointer;
          }
        }
      }
    }

    .generation-scheme {
      display: flex;
      align-items: center; /* 垂直居中 */
      justify-content: center;

      .el-button {
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