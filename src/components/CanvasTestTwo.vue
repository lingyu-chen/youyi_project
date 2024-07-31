<template>
  <canvas id="canvas" width="1200" height="600"></canvas>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    var selectionRectConfig = {
      width: 0,
      height: 0,
      left: 0,
      top: 0,
      fill: "rgba(0, 0, 0, 0)",
      selectable: false,
      stroke: "red",
      strokeWidth: 2,
      hoverCursor: "default",
    };
    var selectionRect;

    // hasClicked 用于标志当前用户按下鼠标准备框选
    var hasClicked = true;
    // 标志用户正按住鼠标左键拖拉框选
    var isSelecting = false;

    var canvas = new fabric.Canvas("canvas", {
      selectionColor: "rgba(255,212,173, 0.8)",
      selectionLineWidth: 2,
      backgroundImage: "/canvas.jpeg",
    });
    canvas.setDimensions({
      width: 1000,
      height: 700,
    });

    canvas.on("mouse:down", function ({ e }) {
      hasClicked = true;
      selectionRectConfig.left = e.offsetX;
      selectionRectConfig.top = e.offsetY;
    });
    canvas.on("mouse:move", function () {
      if (hasClicked) {
        isSelecting = true;
        canvas.set("selectionBorderColor", "green");
      }
    });
    canvas.on("mouse:up", function ({ e }) {
      if (isSelecting) {
        // 清除之前的选中框
        canvas.remove(selectionRect);

        selectionRectConfig.width = e.offsetX - selectionRectConfig.left;
        selectionRectConfig.height = e.offsetY - selectionRectConfig.top;
        // 此时选中框的左上坐标以及宽度和高度
        console.log(
          `选中框 X 轴的范围：${selectionRectConfig.left} ~ ${
            selectionRectConfig.left + selectionRectConfig.width
          }` +
            `\n选中框 Y 轴的范围：${selectionRectConfig.top} ~ ${
              selectionRectConfig.top + selectionRectConfig.height
            }`
        );

        selectionRect = new fabric.Rect(selectionRectConfig);
        canvas.add(selectionRect);

        isSelecting = false;
        hasClicked = false;
      }
    });
  },
};
</script>
<style>
</style>