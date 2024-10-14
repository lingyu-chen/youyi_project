<template>
	<!--<div class="custom-progress" ref="progress" @mouseup="upEvent">
		  <el-progress :percentage="percentage" :color="customColor" :show-text="false"></el-progress>
		   <div class="progress-round" ref="round" @mousedown="downEvent" @mousemove="moveEvent" @mouseup="upEvent"></div>

		   <div class="progress-round" ref="round" @mousedown="downEvent"></div>
	  </div>-->
	<div>
		<div class="block">
			<el-slider v-model="percentage"></el-slider>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			percentage: 0,
			customColor: "#2400ff",
			roundObj: {
				isfalse: false, //控制滑动
				clientx: 0, //获取当前元素相对于窗口的X坐标
				offLeft: 0, //当前元素相对于父元素的左边距
				maxValue: 0, //整个进度条和圆点宽度的差值
				changeX: 0, //圆点移动过程的clientX
			},
		};
	},
	//渲染到页面的时候
	mounted() {
		this.$bus.$on("getInitialPercntage", (percentage) => {
			this.percentage = percentage;
			//   console.log("props RateValue:", this.percentage);
		});
	},
	beforeDestroy() {
		this.$bus.$off("getInitialPercntage");
	},
	methods: {},
	watch: {
		percentage(newVal, oldVal) {
			this.$emit("rate", Math.round(newVal));
			console.log("newVal=", newVal);
		},
	},
};
</script>
<style lang="scss" scoped>
.block {
	::v-deep.el-slider__runway {
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
			border: 0px;
			cursor: pointer;
		}
	}

	.el-slider__button-wrapper {
		cursor: pointer;
	}

	.el-slider__button {
		background-color: #2400ff;
		border: 0px;
		cursor: pointer;
	}
}

::v-deep.el-progress-bar__outer {
	width: 298px;
	height: 4px !important;
	background-color: #242425 !important;

	.el-progress-bar__inner {
		transition: width 0s ease;
	}
}

.custom-progress {
	position: relative;
	width: 298px;
	margin-top: 16px;

	.progress-round {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateY(-50%);
		// transform: translateX(-50%);
		width: 16px;
		height: 16px;
		border-radius: 50% 50%;
		background-color: #2400ff;
		cursor: pointer;
	}
}

::v-deep.el-progress-bar__outer {
	width: 298px;
	height: 4px !important;
	background-color: #242425 !important;

	.el-progress-bar__inner {
		transition: width 0s ease;
	}
}

.custom-progress {
	position: relative;
	width: 298px;
	margin-top: 16px;

	.progress-round {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateY(-50%);
		// transform: translateX(-50%);
		width: 16px;
		height: 16px;
		border-radius: 50% 50%;
		background-color: #2400ff;
		cursor: pointer;
	}
}
</style>