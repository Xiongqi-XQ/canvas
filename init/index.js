const el = document.getElementById('canvas');
const ctx = el.getContext('2d');

ctx.fillStyle = '#FF0000';
ctx.fillRect(0, 0, 100, 100);

ctx.fillStyle = '#00FF00';
ctx.fillRect(100, 100, 100, 100);

// 直线
ctx.beginPath();
ctx.moveTo(50, 50);
ctx.lineTo(150, 150);
ctx.closePath();
ctx.stroke();

// 圆弧
ctx.beginPath();
ctx.arc(100, 100, 100, -Math.PI / 2, -Math.PI, true);
ctx.stroke();
ctx.beginPath();
ctx.arc(100, 100, 100, 0, Math.PI / 2, false);
ctx.stroke();
ctx.fill()
