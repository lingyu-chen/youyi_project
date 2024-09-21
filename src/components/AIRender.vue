<template>

	<div class="container">
		<div class="left-container" ref="threeContainer">
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
			<textarea class="prompt-input"></textarea>
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
				:value="styleList"
				class="style-list-select">
			</el-select>
			<div class="separator"></div>
			<h1 class="option-title">参考图片</h1>
			<div class="rel-pic-container">
				<img src="../assets/upload.png" alt="">
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
			<button class="generate-but" :class="{'generate-but-generating':isGenerating}">AI
				生成方案{{ isGenerating ? "..." : "" }}
			</button>
		</div>
	</div>
</template>
<script>
import * as THREE from 'three';
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
import {TransformControls} from "three/addons/controls/TransformControls.js";

const loader = new GLTFLoader();
const scene = new THREE.Scene();
const models = [];
const pointLight = new THREE.PointLight(0xFFFFFF, 20, 30);
const ambientLight = new THREE.AmbientLight(0x404040, 1);
const gridHelper = new THREE.GridHelper(50, 50);
let camera;
let orbitControls;
let transformControls;
const renderer = new THREE.WebGLRenderer();
const rayCaster = new THREE.Raycaster();
const mouseVector = new THREE.Vector2();
const customMaterial = new THREE.MeshStandardMaterial({
	color: 0xdfe0e2,

})

function myRender() {
	let cameraLocation = camera.position.clone();
	pointLight.position.set(cameraLocation.x, cameraLocation.y, cameraLocation.z);
	renderer.render(scene, camera);
}

export default {
	name: "AIRender",
	data() {
		return {
			aiRate: 90,
			content: "hello",
			keepStyle: false,
			isGenerating: false,
			transformMode: 'translate',
			selectedModel: null,
			styleList: []
		}
	},
	mounted() {
		const vm = this;
		loader.load('https://compare-patch1-1258190691.cos.ap-shanghai.myqcloud.com/youyi_resources/models/chair_demo.glb', function (glb) {
			const loadedModel = glb.scene;
			loadedModel.traverse(function (child) {
				if (child.isMesh) {
					child.material = customMaterial;
				}
			})
			const width = vm.$refs.threeContainer.clientWidth, height = vm.$refs.threeContainer.clientHeight;
			camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
			models.push(loadedModel);
			scene.add(loadedModel);
			console.log(glb.scene);
			pointLight.position.set(0, 10, 0);
			camera.position.set(0, 5, 5)
			scene.add(pointLight);
			scene.add(ambientLight);
			scene.add(gridHelper);
			renderer.setSize(width, height);
			renderer.setClearColor(0xD4D4D4, 1)
			vm.$refs.threeContainer.appendChild(renderer.domElement);
			orbitControls = new OrbitControls(camera, renderer.domElement);
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
			transformControls.addEventListener('dragging-changed', (e) => {
				orbitControls.enabled = !e.value;
			})
			scene.add(transformControls);
			myRender();
			window.addEventListener('resize', () => {
				renderer.setSize(vm.$refs.threeContainer.clientWidth, vm.$refs.threeContainer.clientHeight);
				myRender();
			})
			window.addEventListener('click', (event) => {
				// 计算鼠标位置 (0到1)
				mouseVector.x = (event.clientX / width) * 2 - 1;
				mouseVector.y = -(event.clientY / height) * 2 + 1;

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
			});
		})
	},
	methods: {
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

.left-container {
	position: absolute;
	left: 0;
	right: 336px;
	top: 0;
	bottom: 0;
	margin: auto;
	background-color: transparent;
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

/deep/ .el-slider__runway {
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

/deep/ .el-input__inner {
	background-color: #242425;
	border: 0;
	border-radius: 8px;
	font-size: 12px;
	font-family: AliRegular, sans-serif;
}

/deep/ .el-input__inner::placeholder {
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
