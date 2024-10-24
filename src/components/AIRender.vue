<template>

	<div class="container">
		<div class="return-container">
			<img @click="leaveAndSave()" src="@/assets/tool-box-icons/return.png" alt="" class="return-icon">
			<span class="split">/</span>&nbsp;
			<span class="project-name">{{ projectName }}</span>
		</div>
		<div class="component-container">
			<div class="component-top-bar">
				<img src="@/assets/tool-box-icons/menu.png" alt="menu"/>
				<el-select class="component-class-selector" v-model="chosenClassId" placeholder="请选择组件">
					<el-option
						v-for="item in componentClassList"
						:key="item.cid"
						:label="item.cname"
						:value="item.cid"
					></el-option>
				</el-select>
			</div>
			<div class="component-list">
				<img v-for="content in componentList" :key="content.pid" :title="content.pname" :src="content.preLink"
				     @click="addComponent3D(content.link)"
				     alt=""/>
			</div>
		</div>
		<div class="left-container" ref="threeContainer" @keydown.delete="deleteModel" tabindex="-1">
			<div class="loading-container" v-if="isGenerating||isFinished">
				<div class="loader" v-if="isGenerating"><i class="el-icon-loading"></i></div>
				<img class="result-picture" v-if="isFinished" :src="resultUrl" alt="">

				<button class="cancel-task-but" @click="releaseResult()">×取&nbsp;&nbsp;消</button>
			</div>
			<div class="tool-box-container">
				<div class="tool-icon-outer">
					<img class="tool-icon-inner" src="@/assets/tool-box-icons/upload.png" alt="">
				</div>
				<div class="vertical-separator"></div>
				<div class="tool-icon-outer model-tool-icon-outer"
				     :class="{'tool-icon-active':isToolActive('translate')}"
				     @click="updateControlMode('translate')">
					<img src="@/assets/tool-box-icons/drag.png" alt="" class="tool-icon-inner">
				</div>
				<div class="tool-icon-outer model-tool-icon-outer"
				     :class="{'tool-icon-active':isToolActive('rotate')}"
				     @click="updateControlMode('rotate')">
					<img src="@/assets/tool-box-icons/rotate.png" alt="" class="tool-icon-inner">
				</div>
				<div class="tool-icon-outer model-tool-icon-outer"
				     :class="{'tool-icon-active':isToolActive('scale')}"
				     @click="updateControlMode('scale')">
					<img src="@/assets/tool-box-icons/scale.png" alt="" class="tool-icon-inner">
				</div>
				<div class="vertical-separator" style="margin-left: 12px"></div>
				<div class="tool-icon-outer delete-icon-outer">
					<img src="@/assets/tool-box-icons/delete.png" alt="" class="tool-icon-inner">
				</div>
			</div>
		</div>
		<div class="right-container">
			<h1 class="option-title">Prompt 提示词</h1>
			<textarea class="prompt-input" v-model="prompts"></textarea>
			<div class="separator"></div>
			<div class="ai-rate-container">
				<h1 class="option-title">AI 影响率</h1>
				<span class="rate-val">
					{{ aiRate }}%
				</span>
				<el-slider class="rate-slider" v-model="aiRate"></el-slider>
			</div>
			<div class="separator"></div>
			<h1 class="option-title">风格参照</h1>
			<el-select
				placeholder="请选择"
				style="color: #ff0000"
				:popper-append-to-body="false"
				v-model="chosenStyle"
				class="style-list-select"
			>
				<el-option
					v-for="item in styleList"
					:key="item.sid"
					:label="item.name"
					:value="item.sid"
				></el-option>
			</el-select>
			<div class="separator"></div>
			<h1 class="option-title">参考图片</h1>
			<div class="rel-pic-container">
				<img src="@/assets/upload.png" alt="">
				<label>点击/拖拽 来上传图片（jpeg，png）</label>
			</div>
			<div class="separator"></div>
			<div class="keep-style-container">
				<h1 class="option-title">风格延续</h1>
				<el-switch class="keep-style-switch" v-model="keepStyle" active-color="#00A700"
				           inactive-color="#577899"></el-switch>
			</div>
			<div class="separator"></div>
			<h1 class="option-title">历史记录</h1>
			<div class="history-list-container">

			</div>
			<button class="generate-but" :class="{'generate-but-generating':isGenerating}" @click="generateStart()"
			        :disabled="isGenerating||isFinished">AI
				生成方案{{ isGenerating ? "中..." : "" }}
			</button>
		</div>
	</div>
</template>
<script>
import * as THREE from 'three';
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
import {TransformControls} from "three/addons/controls/TransformControls.js";
import {
	cancelTask,
	fileFinish, fileRelease, findTaskStatus, getComponentClass, getComponentContent,
	getProjectDetail,
	getStyleList,
	projectSave,
	taskGenerate,
	uploadFile,
	uploadModelFile
} from "@/api";
import {GLTFExporter} from 'three/examples/jsm/exporters/GLTFExporter.js';

/* Three.JS Scene Properties Start */

const loader = new GLTFLoader();
const scene = new THREE.Scene();
let models = [];
const light = new THREE.PointLight(0xFFFFFF, 5, 50);
const ambientLight = new THREE.AmbientLight(0x404040, 1);
const gridHelper = new THREE.GridHelper(50, 50);
let camera;
let orbitControls;
let transformControls;
const renderer = new THREE.WebGLRenderer({
	preserveDrawingBuffer: true
});
const rayCaster = new THREE.Raycaster();
const mouseVector = new THREE.Vector2();
const customMaterial = new THREE.MeshStandardMaterial({
	color: 0xdfe0e2,

})

function myRender() {
	let cameraLocation = camera.position.clone();
	light.position.set(cameraLocation.x, cameraLocation.y + 20, cameraLocation.z);
	renderer.render(scene, camera);
}

function clickModel(width, height, event, vm) {
	// 计算鼠标位置 (0到1)
	mouseVector.x = (event.offsetX / width) * 2 - 1;
	mouseVector.y = -(event.offsetY / height) * 2 + 1;

	// 更新 Raycaster
	rayCaster.setFromCamera(mouseVector, camera);

	// 计算与模型的交叉点
	const intersects = rayCaster.intersectObjects(models);

	if (intersects.length > 0) {
		// 如果有交互，获取第一个模型
		const selectedModel = intersects[0].object;
		transformControls.attach(selectedModel);
		vm.selectedModel = selectedModel;
		myRender();
	}
}

/* Three.JS Scene Properties End */

export default {
	name: "AIRender",
	data() {
		return {
			aiRate: 90,
			model3dCnt: 0,
			prompts: '',
			projectId: this.$route.query.id,
			projectName: "",
			type: this.$route.query.type,
			keepStyle: false,
			transformMode: 'translate',
			selectedModel: null,
			styleList: [],
			chosenStyle: 1,
			status: 'EDIT', // EDIT RUNNING FINISHED
			checkTimer: null,
			isControlling: false,
			resultUrl: '',
			runningTaskId: 0,
			chosenClassId: null,
			/**
			 * cid,cname
			 */
			componentClassList: [],
			/**
			 * pid,pname,preLink,link
			 */
			componentList: []
		}
	},

	mounted() {
		getStyleList().then(
			(response) => {
				this.styleList = response.data.styles;
			},
			(error) => {
				console.log("request style list error:", error);
			}
		)
		this.getProjectDetail();

	},
	computed: {
		isGenerating: function () {
			return this.status === 'RUNNING';
		},
		isFinished: function () {
			return this.status === 'FINISHED';
		}
	},
	watch: {
		chosenClassId: function (newClassId) {
			this.getComponentContentList(newClassId);
		}
	},
	methods: {
		loadModel3D: function (url) {
			const vm = this;
			if (url == null || url === '') {
				url = "https://compare-patch1-1258190691.cos.ap-shanghai.myqcloud.com/youyi_resources/models/chair_demo.glb";
			}

			loader.load(url, function (glb) {
				const loadedModel = glb.scene;
				const objNamePre = "object";
				loadedModel.traverse(child => {
					if (child.isMesh) {
						child.material = customMaterial
						child.name = objNamePre + vm.model3dCnt;
						vm.model3dCnt++;
						models.push(child)
					}
				})
				const width = vm.$refs.threeContainer.clientWidth, height = vm.$refs.threeContainer.clientHeight;
				camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
				scene.add(loadedModel);
				light.position.set(0, 10, 0);
				camera.position.set(0, 5, 5)
				scene.add(light);
				scene.add(ambientLight);
				scene.add(gridHelper);
				renderer.setSize(width, height);
				renderer.setClearColor(0xD4D4D4, 1)
				vm.$refs.threeContainer.appendChild(renderer.domElement);
				orbitControls = new OrbitControls(camera, renderer.domElement);
				orbitControls.addEventListener('start', function () {
					vm.isControlling = true;
				})
				orbitControls.addEventListener('end', function () {
					vm.isControlling = false;
				})
				orbitControls.addEventListener('change', function () {
					myRender();
				})


				transformControls = new TransformControls(camera, renderer.domElement);
				transformControls.attach(loadedModel);
				vm.selectedModel = loadedModel;
				transformControls.setMode(vm.transformMode);
				transformControls.addEventListener('change', function () {
					myRender();
				})
				transformControls.addEventListener('start', function () {
					vm.isControlling = true;
				})
				transformControls.addEventListener('end', function () {
					vm.isControlling = false;
				})
				transformControls.addEventListener('dragging-changed', (e) => {
					orbitControls.enabled = !e.value;
				})
				scene.add(transformControls);
				scene.updateMatrixWorld(true);
				myRender();
				window.addEventListener('resize', () => {
					const width = vm.$refs.threeContainer === undefined ? 1024 : vm.$refs.threeContainer.clientWidth;
					const height = vm.$refs.threeContainer === undefined ? 768 : vm.$refs.threeContainer.clientHeight;
					renderer.setSize(width, height);
					myRender();
				})
				renderer.domElement.addEventListener('click', (event) => {
					if (!vm.isControlling) {
						clickModel(renderer.domElement.clientWidth, renderer.domElement.clientHeight, event, vm)
					}

				}, false);
				vm.getComponentClassList();
			})
		},
		addComponent3D: function (url) {
			const vm = this;
			if (url == null && url === '') {
				console.log("component url is empty");
				return;
			}
			loader.load(url, function (glb) {
				const loadedModel = glb.scene;
				loadedModel.traverse(function (child) {
					if (child.isMesh) {
						child.material = customMaterial;
						child.name = "insert" + vm.model3dCnt;
						vm.model3dCnt++;
						models.push(child);
					}
				})
				let cameraLocation = camera.position.clone();
				loadedModel.position.set(cameraLocation.x, cameraLocation.y, cameraLocation.z);
				loadedModel.scale.set(0.2, 0.2, 0.2);
				vm.selectedModel = loadedModel;
				scene.add(loadedModel);
				transformControls.setMode(vm.transformMode);
				transformControls.attach(loadedModel);
				myRender();
			});
		},
		getComponentClassList: async function () {
			const vm = this;
			await getComponentClass().then(
				(response) => {
					vm.componentClassList = response.data;
				},
				(error) => {
					console.log("request component class list error:", error);
				}
			)
		},
		getComponentContentList: async function (classId) {
			const vm = this;
			await getComponentContent(classId).then(
				(response) => {
					vm.componentList = response.data;
				},
				(error) => {
					console.log("request component content list error:", error)
				}
			);
		},
		getProjectDetail: async function () {
			const vm = this;
			await getProjectDetail(this.$route.query.id).then(
				(response) => {
					vm.projectName = response.data.name;
					vm.aiRate = parseInt(Math.min(100.0, Math.abs(response.data.aiRate * 100)).toFixed(0));
					vm.prompts = response.data.prompt == null ? '' : response.data.prompt.join(',');
					vm.chosenStyle = response.data.style;
					let link = response.data.model == null ? null : response.data.model.link;
					vm.loadModel3D(link);
				},
				(error) => {
					console.log("request project detail error:", error);
				}
			)
		},
		updateControlMode: function (mode) {
			if (mode === this.transformMode && this.selectedModel != null) {
				transformControls.detach(this.selectedModel);
				this.selectedModel = null;
				myRender();
				return;
			}
			this.transformMode = mode;
			transformControls.setMode(this.transformMode);
		},
		isToolActive: function (mode) {
			return mode === this.transformMode && this.selectedModel != null;
		},
		leaveAndSave: async function () {
			const vm = this;
			const renderedPicBlob = this.getRenderedPic();
			projectSave({
				id: this.projectId,
				name: this.projectName,
				prompt: this.prompts.split(','),
				aiRate: this.aiRate / 100.0,
				style: this.chosenStyle,
				modified: true,
				randomSeed: this.keepStyle ? this.projectId : new Date().getTime()
			}).then(
				async (response) => {
					await response.data.uploadParams.map(async (element) => {
						const tag = element.tag;
						const fileId = element.fileId;
						const hostUrl = element.hostUrl;
						if (tag === 'canvas') {
							return uploadFile(hostUrl, vm.base64ToBlob({
								b64data: renderedPicBlob,
								contentType: "image/png"
							})).then(async (result) => {
								console.log(result);
								await vm.fileFinishFunc(tag, fileId, this.projectId);
							}, (error) => {
								console.log(error);

							});
						} else {
							return this.getModelBlob().then(blob => {
								uploadModelFile(hostUrl, blob).then(async (result) => {
									console.log(result);
									await vm.fileFinishFunc(tag, fileId, this.projectId);

								}, (error) => {
									console.log(error);

								}).catch(error => {
									console.log(error);
								});
							})
						}

					})
					vm.$router.go(-1);

				},
				(error) => {
					console.log("上传文件失败", error)
					vm.setError();
				}
			)
		},
		generateStart: async function () {
			const vm = this;
			const renderedPicBlob = this.getRenderedPic();
			this.status = 'RUNNING';
			projectSave({
				id: this.projectId,
				name: this.projectName,
				prompt: this.prompts.split(','),
				aiRate: this.aiRate / 100.0,
				style: this.chosenStyle,
				modified: true,
				randomSeed: this.keepStyle ? this.projectId : new Date().getTime()
			}).then(
				async (response) => {
					let saveSuccess = false;
					const promises = response.data.uploadParams.map(async (element) => {
						const tag = element.tag;
						const fileId = element.fileId;
						const hostUrl = element.hostUrl;
						if (tag === 'canvas') {
							return uploadFile(hostUrl, vm.base64ToBlob({
								b64data: renderedPicBlob,
								contentType: "image/png"
							})).then(async (result) => {
								console.log(result);
								await vm.fileFinishFunc(tag, fileId, this.projectId);
								saveSuccess = true;
							}, (error) => {
								console.log(error);
								saveSuccess = false;
							});
						} else {
							return this.getModelBlob().then(blob => {
								uploadModelFile(hostUrl, blob).then(async (result) => {
									console.log(result);
									await vm.fileFinishFunc(tag, fileId, this.projectId);
									saveSuccess = true;
								}, (error) => {
									console.log(error);
									saveSuccess = false;
								}).catch(error => {
									console.log(error);
								});
							})
						}
					})
					await Promise.all(promises).then(async () => {
						if (saveSuccess) {
							await taskGenerate({
								projectId: vm.projectId,
							}).then((result) => {
								vm.taskCheckStart(result.data.tid);
								vm.runningTaskId = result.data.tid;
							}, (error) => {
								console.log(error);
								vm.setError();
							})
						} else {
							vm.setError();
						}
					})


				},
				(error) => {
					console.log("上传文件失败", error)
					vm.setError();
				}
			)
		},
		taskCheckStart: function (tid) {
			const vm = this;
			this.checkTimer = setInterval(function () {
				findTaskStatus(tid).then(
					(response) => {
						let task = response.data.results[0];
						if (task.status === 'FINISHED') {
							vm.resultUrl = task.result.link;
							vm.status = 'FINISHED';
							console.log('vm status is ' + vm.status + 'when finished.')
							clearInterval(vm.checkTimer);
						} else if (task.status === 'ERROR') {
							vm.status = 'ERROR';
							clearInterval(vm.checkTimer)
						}
					},
					(error) => {
						console.log(error);
						vm.setError();
						clearInterval(vm.checkTimer);
					}
				)
			}, 1200)
		},
		base64ToBlob({b64data = "", contentType = "", sliceSize = 512} = {}) {
			// 使用 atob() 方法将数据解码
			const b64dataformat = b64data.substring("data:image/png;base64,".length);
			let byteCharacters = atob(b64dataformat);
			let byteArrays = [];
			for (
				let offset = 0;
				offset < byteCharacters.length;
				offset += sliceSize
			) {
				let slice = byteCharacters.slice(offset, offset + sliceSize);
				let byteNumbers = [];
				for (let i = 0; i < slice.length; i++) {
					byteNumbers.push(slice.charCodeAt(i));
				}
				// 8 位无符号整数值的类型化数组。内容将初始化为 0。
				// 如果无法分配请求数目的字节，则将引发异常。
				byteArrays.push(new Uint8Array(byteNumbers));
			}
			return new Blob(byteArrays, {
				type: contentType,
			});
		}
		,
		getRenderedPic: function () {
			transformControls.detach(this.selectedModel);
			this.selectedModel = null;
			scene.remove(gridHelper);
			myRender();
			const originCanvas = renderer.domElement;
			const tmpCanvas = document.createElement("canvas");
			const tmpContext = tmpCanvas.getContext('2d');
			const width = originCanvas.width, height = originCanvas.height;
			const size = Math.min(width, height);
			const xOffset = (width - size) / 2;
			tmpCanvas.width = 512;
			tmpCanvas.height = 512;
			tmpContext.drawImage(originCanvas, xOffset, 0, size, size, 0, 0, 512, 512);
			const res = tmpCanvas.toDataURL('image/png');
			scene.add(gridHelper);
			myRender();
			return res;
		}
		,
		getModelBlob: function () {
			return new Promise((resolve, reject) => {
				const exporter = new GLTFExporter();
				scene.remove(light);
				scene.remove(ambientLight);
				scene.remove(transformControls);
				scene.remove(gridHelper);
				exporter.parse(scene, async function (result) {
						if (result instanceof ArrayBuffer) {
							const modelBlob = await new Blob([result], {type: "model/gltf-binary"});
							resolve(modelBlob);
							scene.add(light);
							scene.add(ambientLight);
							scene.add(transformControls);
							scene.add(gridHelper);
							myRender();
						}
					}, function (err) {
						console.log(err);
						reject(err);
						scene.add(light);
						scene.add(ambientLight);
						scene.add(transformControls);
						myRender();
					},
					{
						binary: true,
					});
			})
		}
		,
		fileFinishFunc: async function (tag, fileId, projectId) {
			return fileFinish({
				tag: tag,
				projectId: projectId,
				fileId: fileId,
				finish: true
			}).then((result) => {
					console.log(tag + " file finished " + result.data.status);
				}, (error) => {
					console.log(error);
				}
			)
		},
		setError() {
			this.status = 'ERROR';
		},
		releaseResult: function () {
			this.status = 'EDIT';
			if (this.status === 'RUNNING') {
				cancelTask(this.runningTaskId).then(
					(response) => {
						console.log(response.data.tid + " cancelled");
					}, (error) => {
						console.log(error);
					})
			} else if (this.status === 'FINISHED') {
				fileRelease({projectId: this.projectId}).then(
					(result) => {
						console.log("release task " + result.data.status);
					},
					(error) => {
						console.log(error);
					})
			}
		},
		deleteModel: function () {
			if (this.selectedModel != null) {
				this.selectedModel.parent.remove(this.selectedModel);
				transformControls.detach(this.selectedModel);
				models = models.filter((item) => item !== this.selectedModel);
				this.selectedModel = null;
				myRender();
			}
		}

	}
}
</script>


<style scoped lang="scss">

.container {
	position: relative;
	background-color: #d4d4d4;
	width: 100%;
	height: 100%;
}

.return-container {
	position: fixed;
	left: 244px;
	top: 22px;
	padding-left: 16px;
	width: 141px;
	height: 40px;
	background-color: transparent;
	margin: auto;
	border-left: 1px solid #3D3D3D;
	z-index: 11;
	display: flex;
	align-items: center;
	justify-content: center;
}

.return-icon {
	cursor: pointer;
	width: 24px;
	height: 24px;
}

span.split {
	color: #3D3D3D;
	font-family: AliMedium, sans-serif;
	font-size: 20px;
}

span.project-name {
	color: white;
	font-family: AliMedium, sans-serif;
	font-size: 20px;
}

.component-top-bar {
	width: 100%;
	height: 44px;
	border-radius: 8px 8px 0 0;
	border-bottom: 1px solid #3D3D3D;
	display: flex;
	align-items: center;
	justify-content: center;
}

.component-class-selector {
	width: 120px;
}

::v-deep .component-class-selector .el-input__inner {
	font-size: 16px;
	color: white;
	font-family: AliMedium, sans-serif;
	text-align: center;
	background-color: transparent;
	border: none;
}

.component-class-selector .el-select-dropdown__item {
	font-size: 16px;
	font-family: AliMedium, sans-serif;
	text-align: center;
}

.component-top-bar img {
	display: inline-block;
	width: 16px;
	height: 16px;
}

.component-top-bar span {
	display: inline;
	font-size: 16px;
	color: #ffffff;
	font-family: AliMedium, serif;
	margin-left: 8px;
	margin-right: 2px;
}

.component-container {
	position: absolute;
	background-color: #151517;
	width: 240px;
	height: auto;
	left: 32px;
	top: 16px;
	bottom: 32px;
	margin: auto;
	border-radius: 8px;
	z-index: 10;
	overflow: hidden;
}

.component-list {
	margin: 12px;
	height: calc(100% - 44px - 24px);
	width: calc(100% - 24px);
	padding-right: 8px;
	overflow-y: auto;
	overflow-x: hidden;
	display: flex;
	flex-wrap: wrap;
	align-content: flex-start;
}

.component-list > img {
	width: 104px;
	height: 104px;
	margin-right: 8px;
	margin-bottom: 8px;
	border-radius: 4px;
}

.component-list > img:nth-child(2n) {
	margin-right: 0;
}

/* 悬浮效果 */
.component-list img:hover {
	transform: scale(1.05); /* 图片放大到原大小的105% */
	z-index: 2; /* 确保悬浮的图片在其他图片之上 */
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* 添加阴影效果 */
}

/* 点击效果 */
.component-list img:active {
	transform: scale(0.98); /* 图片缩小到原大小的98% */
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 减弱阴影效果 */
}

.left-container {
	position: absolute;
	left: 0;
	right: 368px;
	top: 0;
	bottom: 0;
	margin: auto;
	background-color: transparent;
}

.loading-container {
	position: absolute;
	z-index: 5;
	width: 100%;
	height: 100%;
	background-color: rgba(217, 217, 217, 0.75);
}

.result-picture {
	display: block;
	position: absolute;
	width: 512px;
	height: 512px;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	margin: auto;
}

.loader {
	width: 211px;
	height: 211px;
	position: absolute;
	left: 0;
	bottom: 0;
	right: 0;
	top: 0;
	margin: auto;
	font-size: 168px;
}

.cancel-task-but {
	position: absolute;
	bottom: 40px;
	left: 0;
	right: 0;
	margin: auto;
	width: 154px;
	height: 48px;
	border: 0;
	color: white;
	background-color: #2400ff;
	border-radius: 50px;
	font-family: AliMedium, serif;
	font-size: 20px;
	cursor: pointer;
}

.cancel-task-but::first-letter {
	font-size: 25px;
	margin-right: 7px;
}


.tool-box-container {
	position: absolute;
	background-color: #212123;
	width: 307px;
	height: 63px;
	border: #3D3D3D 1px solid;
	border-radius: 45px;
	left: 0;
	bottom: 32px;
	right: 0;
	margin: auto;
	display: flex;
	align-items: center;
}

.tool-icon-outer {
	width: 40px;
	height: 40px;
	position: relative;
	border-radius: 4px;
	background-color: transparent;
	transition: background-color 0.15s linear;
	margin-left: 22px;
}

.delete-icon-outer {
	margin-left: 6px;
}

.model-tool-icon-outer {
	margin-left: 12px;
}

.tool-icon-active, .tool-icon-active:hover {
	background-color: #2400ff;
}

.tool-icon-inner {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	margin: auto;
}

.vertical-separator {
	height: 40px;
	width: 0;
	border: #3D3D3D 1px solid;
	margin-left: 9px;
}

.tool-icon-outer:hover {
	background-color: #2400ff;
}


.right-container {
	position: absolute;
	right: 0;
	top: 0;
	bottom: 0;
	margin: auto;
	padding: 0 16px;
	width: 336px;
	background-color: #151517;
}

.option-title {
	font-family: AliMedium, serif;
	font-weight: normal;
	font-size: 14px;
	color: white;
	margin-top: 16px;
}

.prompt-input {
	box-sizing: border-box;
	font-family: AliRegular, serif;
	width: 100%;
	height: 131px;
	padding: 10px 12px;
	background-color: #242425;
	border: none;
	margin-top: 8px;
	border-radius: 8px;
	font-size: 14px;
	line-height: 16px;
	color: #b2b2b2;
	text-align: left;
	resize: none;

}

.prompt-input:focus {
	border: 0;
	outline: none;
}

.separator {
	width: calc(100% + 32px);
	height: 1px;
	background-color: #3D3D3D;
	margin: 16px -16px 0 -16px;
}

.ai-rate-container {
	position: relative;
}

.rate-val {
	position: absolute;
	top: 0;
	right: 0;
	margin: auto;
	color: white;
	font-family: AliMedium, sans-serif;

	font-size: 14px;

}

::v-deep .el-slider__runway {
	height: 4px;
	background-color: #242425;

	.el-slider__bar {
		height: 4px;
		background-color: #2400ff;
		cursor: pointer;
	}

	.el-slider__button-wrapper {
		cursor: pointer;
	}

	.el-slider__button {
		background-color: #2400ff;
		border: 0;
		cursor: pointer;
	}
}

::v-deep .el-input__inner {
	background-color: #242425;
	border: 0;
	border-radius: 8px;
	font-size: 12px;
	font-family: AliRegular, sans-serif;
}

::v-deep .el-input__inner::placeholder {
	font-size: 12px;
	font-family: AliRegular, sans-serif;
	color: #fff;
}

.rate-slider {
	color: #242425;
}

.style-list-select {
	margin-top: 16px;
	width: 100%;
}

.rel-pic-container {
	margin-top: 8px;
	box-sizing: border-box;
	border: 0;
	border-radius: 8px;
	background-color: #242425;
	height: 64px;
	text-align: center;
	line-height: 64px;
}

.rel-pic-container > img {
	width: 16px;
	height: 16px;
	margin-right: 10px;
	vertical-align: middle;
}

.rel-pic-container > label {
	font-family: AliRegular, serif;
	font-size: 12px;
	color: #b2b2b2;
	vertical-align: middle;
}

.rel-pic-container:hover {
	cursor: pointer;
}

.keep-style-container {
	position: relative;
}

.keep-style-switch {
	position: absolute;
	width: 53px;
	height: 26px;
	right: 0;
	top: 0;
	bottom: 0;
	margin: auto;
}

.history-list-container {
	height: 178px;
	background-color: #242425;
	border: 0;
	border-radius: 8px;
	margin-top: 8px;
}

.generate-but {
	margin-top: 147px;
	font-family: AliMedium, serif;
	font-size: 20px;
	color: white;
	height: 48px;
	background-color: #2400ff;
	border: 0;
	width: 100%;
	cursor: pointer;
	border-radius: 8px;
	-webkit-transition-duration: 0.4s;
	transition-duration: 0.4s;
}

.generate-but:hover {
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 8%), 0 4px 8px 0 rgba(0, 0, 0, 8%);

}

.generate-but-generating, .generate-but-generating:hover {
	box-shadow: none;
	cursor: not-allowed;
	background-color: #412cbe;
}


</style>
