<template>
	<div class="container">
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
				class="style-list-select">
			</el-select>
			<div class="separator"></div>

		</div>
	</div>
</template>
<script>
export default {
	name: "AIRender",
	data: function () {
		return {
			aiRate: 20,
			content: "hello"
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
	font-family: AliMedium,serif;
	font-size: 14px;
	color: white;
	margin-top: 16px;
}

.prompt-input {
	box-sizing: border-box;
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
</style>
