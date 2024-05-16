<template>
    <div class="custom-progress" ref="progress" @mouseup="upEvent">
        <el-progress :percentage="percentage" :color="customColor" :show-text="false"></el-progress>
        <!-- <div class="progress-round" ref="round" @mousedown="downEvent" @mousemove="moveEvent" @mouseup="upEvent"></div>
         -->
         <div class="progress-round" ref="round" @mousedown="downEvent"></div>
    </div>
    
</template>
<script>
    export default {
        props:['percentage1'],
        data() {
            return {
                percentage:this.percentage1,
                customColor: '#2400ff',
                roundObj:{
                    isfalse:false,//控制滑动
                    clientx:0,//获取当前元素相对于窗口的X坐标
                    offLeft:0,//当前元素相对于父元素的左边距
                    maxValue:0, //整个进度条和圆点宽度的差值
                    changeX:0,//圆点移动过程的clientX
                }
            }
        },
        //渲染到页面的时候
        mounted() {
            // console.log("this.$props->",this.$props);
            setTimeout(()=>{
                this.$refs.round.style.left = this.percentage+'%';
                console.log("this.percentage=",this.percentage);
                console.log("this.$props->",this.$props);
            },5000)
        },
        methods: {
            downEvent(event)
            {
                this.roundObj.isfalse = true;
                this.roundObj.clientx = event.clientX;
                this.roundObj.offLeft = this.$refs.round.offsetLeft;
                this.roundObj.maxValue = this.$refs.progress.offsetWidth - this.$refs.round.offsetWidth;
                // console.log("this.$refs.progress.offsetWidth=",this.$refs.progress.width);
                var _this = this;
                // console.log("this.percentage1=",this.percentage)
                this.$refs.progress.onmousemove = function(event)
                {
                    if(!_this.roundObj.isfalse)
                        return;
                        _this.roundObj.changeX = event.clientX;
                    var moveX = Math.min(_this.roundObj.maxValue,Math.max(-2,_this.roundObj.offLeft+(_this.roundObj.changeX - _this.roundObj.clientx)));
                    //移动超过进度条的宽度取最大宽
                    // console.log("_this.roundObj=",_this.roundObj);
                    _this.percentage = Math.round(Math.max(0,moveX/_this.roundObj.maxValue)*100);
                    console.log("_this.percentage1=",_this.percentage);
                    _this.$refs.round.style.left = _this.percentage+'%';
                }
            },      
            upEvent(event)
            {
                this.roundObj.isfalse = false;
            },
        },
        watch:{
            percentage(newVal,oldVal){
                this.$emit('rate',newVal);
                console.log("newVal=",newVal);
            }
        }
    }
</script>
<style lang="scss" scoped>
    /deep/.el-progress-bar__outer{
        width: 298px;
        height: 4px !important;
        background-color: #242425 !important;
        .el-progress-bar__inner{
            transition: width .1s ease;
        }
    }
    .custom-progress{
        position: relative;
        width: 298px;
        margin-top: 16px;
        .progress-round{
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