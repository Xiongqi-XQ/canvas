// 获取上下文
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d'); // 2D上下文

/**
 * 简单绘制
 */
let x = 0,
  y = 0,
  width = 50,
  height = 50,
  sx = 0,
  sy = 0,
  xn = 10,
  yn = 10;

// 一些方法
// 清除从(x, y)开始的宽width,高height的区域
ctx.clearRect(x, y, 200, 200);
ctx.fillStyle = 'red'; // 填充色

// 矩形
ctx.fillRect(x, y, 100, 100);
// ctx.fill()

// 路径
// ctx.beginPath(); // 新建一条路径，路径一旦创建成功，图形绘制命令被指向到路径上生成路径
// ctx.moveTo(0, 0); //路径的起始点坐标(sx,sy)
// ctx.lineTo(200, 0); //绘制一条到(xn,yn)的线段
// ctx.lineTo(200, 200); //绘制一条到(xn,yn)的线段
// ctx.closePath(); //闭合路径之后，图形绘制命令又重新指向到上下文中
// ctx.stroke(); //通过线条来绘制图形轮廓
// ctx.fill(); //通过填充路径的内容区域生成实心的图形

// // 圆弧
// ctx.beginPath();
// ctx.arc(200, 200, 100, 0, 2 * Math.PI, false);
// ctx.fill();

// 文本. 在指定的(x, y)位置填充指定的文本，绘制的最大宽度是可选的
ctx.fillText('text', 0, 10);

// 图片
const img = new Image();
img.src = 'd.ico';
img.onload = () => {
  ctx.drawImage(img, -25, -20);
  const imageData = ctx.getImageData(0, 0, 100, 100);

  const gap = 12; // 间隙大小
  const alpha = alpha || 200; // 透明度阈值

  const { width, height, data } = imageData;
  const points = []; // 点数组
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width * 4; j++) {
      if (data[i * width * 4 + j + 3] >= alpha) {
        points.push({
          x: Math.floor(j / 4),
          y: Math.floor(i),
        });
      }
    }
  }
  return points;
};
