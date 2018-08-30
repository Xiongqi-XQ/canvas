const el = document.createElement('canvas');
el.setAttribute('id', 'canvas');
// if(window)
el.setAttribute('width', Math.min(window.innerWidth - 30, 800));
el.setAttribute('height', Math.min(window.innerWidth - 30, 800));
// alert(window.innerWidth)
document.getElementById('root').appendChild(el);

const input = document.getElementById('input');
input.value = sessionStorage.input || 'favicon.ico';
const button = document.getElementById('button');
const ctx = el.getContext('2d');

const img = new Image();
img.width = el.width;
img.height = el.height;

// const el = document.getElementById('canvas');
let pos = [];
let dots = [];
let unanime;

function clickButton() {
  sessionStorage.input = input.value;
  // sessionStorage.input = input.files[0];
  // window.cancelAnimationFrame(unanime);
  canvas();
  // setTimeout(() => {
  //   unanime = window.requestAnimationFrame(stepCreator());
  //   setTimeout(() => {
  //     cancelAnimationFrame(unanime);
  //   }, 300);
  // }, 500);
  // unanime = window.requestAnimationFrame(stepCreator());
  // setTimeout(()=>{cancelAnimationFrame(unanime)}, 100)
}

button.onclick = function() {
  clickButton();
};
input.onkeyup = function(e) {
  if (e.keyCode === 13) clickButton();
};
window.onload = function() {
  canvas();
  // setTimeout(() => {
  //   unanime = window.requestAnimationFrame(stepCreator());
  //   setTimeout(() => {
  //     cancelAnimationFrame(unanime);
  //   }, 300);
  // }, 1000);
};

function canvas() {
  img.onload = () => {
    ctx.clearRect(0, 0, el.width, el.height);
    ctx.drawImage(img, el.width, el.height);
    pos = [];
    dots = [];

    ctx.font = '200px Menlo bold';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.drawImage(img, 0, 0);
    // ctx.fillText('熊漆', 0, 0, 250);

    const imageData = ctx.getImageData(0, 0, el.width, el.height);
    // console.log(imageData);

    pos = getPoints(imageData, 0, 0);
    dotDraw(pos, ctx);
  };
  img.src = sessionStorage.input || 'favicon.ico';
}

function getPoints(imageData = [], sx = 0, sy = 0) {
  const { width, height, data } = imageData;
  const gap = 12; // 间隙大小
  const pos = []; // 点数组
  const alpha = 200; // 透明度阈值
  for (let i = 0; i < height; i += gap) {
    for (let j = 0; j < width * 4; j += gap * 4) {
      if (data[i * width * 4 + j + 3] >= alpha) {
        const r = data[i * width * 4 + j];
        const g = data[i * width * 4 + j + 1];
        const b = data[i * width * 4 + j + 2];
        const a = data[i * width * 4 + j + 3];
        if (r + g + b <= 765)
          pos.push({
            x: sx + Math.floor(j / 4),
            y: sy + Math.floor(i),
            rgba: { r, g, b, a },
          });
      }
    }
  }
  return pos;
}

class dot {
  constructor(point) {
    this.x = point.x;
    this.y = point.y;
    this.r = 3;
    this.colorHSL = random(360);
    this.colorSelf = 'rgba(' + point.rgba.r + ',' + point.rgba.g + ',' + point.rgba.b + ',' + point.rgba.a + ')';

    let time = random(3) + 1;
    this.boomX = this.x - el.width / 2;
    this.boomY = this.y - el.height / 2;
    this.endX = this.boomX + this.x;
    this.endY = this.boomY + this.y;
    this.speedX = this.boomX / time;
    this.speedY = this.boomY / time;
  }
  get color() {
    return `hsl(${this.colorHSL},100%,50%)`;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fillStyle = this.colorSelf; // `rgba(${random(256)},${random(256)},${random(256)},${1 - random(0.5, false)})`;
    ctx.fill();
  }
  drawBoom() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.r += 0.3;
    this.draw();
  }
}

function dotDraw(pos = [], ctx) {
  ctx.clearRect(0, 0, el.width, el.height);
  const r = 3;
  let tmp;
  for (let i of pos) {
    tmp = new dot(i);
    dots.push(tmp);
    tmp.draw();
  }
}

function stepCreator() {
  // ctx.clearRect(0, 0, el.width, el.height);

  return function step(timestamp) {
    dots.forEach(i => {
      i.drawBoom();
    });
    unanime = window.requestAnimationFrame(step);
  };
}

function random(range = 1, isInt = true) {
  return isInt ? Math.floor(Math.random() * range) : Math.random() * range;
}
