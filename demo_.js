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
ctx.clearRect(x, y, width, height);

// 矩形
ctx.fillRect(x, y, width, height);

// 路径
ctx.beginPath(); // 新建一条路径，路径一旦创建成功，图形绘制命令被指向到路径上生成路径
ctx.moveTo(sx, sy); //路径的起始点坐标(sx,sy)
ctx.lineTo(xn, yn); //绘制一条到(xn,yn)的线段
ctx.closePath(); //闭合路径之后，图形绘制命令又重新指向到上下文中
ctx.stroke(); //通过线条来绘制图形轮廓
ctx.fill(); //通过填充路径的内容区域生成实心的图形

// 圆弧
ctx.beginPath();
ctx.arc(x, y, r, startAngle, endAngle, anticlockwise);
ctx.fill();

// 文本. 在指定的(x, y)位置填充指定的文本，绘制的最大宽度是可选的
ctx.fillText(text, x, y, maxWidth);

// 图片
ctx.drawImage(img, x, y);
