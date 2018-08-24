const el = document.createElement('canvas');
el.setAttribute('id', 'canvas');
// if(window)
el.setAttribute('width', Math.min(window.innerWidth - 30, 800));
el.setAttribute('height', Math.min(window.innerWidth - 30, 800));
// alert(window.innerWidth)
document.getElementById('root').appendChild(el);

const input = document.getElementById('input');
const button = document.getElementById('button');

// const el = document.getElementById('canvas');
const ctx = el.getContext('2d');
let pos = [];
let dots = [];
let unanime;

function clickButton() {
  // window.cancelAnimationFrame(unanime);
  canvas();
  setTimeout(() => {
    unanime = window.requestAnimationFrame(stepCreator());
    setTimeout(() => {
      cancelAnimationFrame(unanime);
    }, 300);
  }, 500);
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
  setTimeout(() => {
    unanime = window.requestAnimationFrame(stepCreator());
    setTimeout(() => {
      cancelAnimationFrame(unanime);
    }, 300);
  }, 1000);
};

function canvas() {
  const text = input.value || 'XQ';
  ctx.clearRect(0, 0, el.width, el.height);
  pos = [];
  dots = [];

  ctx.font = '200px Menlo bold';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, el.width / 2, el.height / 2, 300);
  // ctx.fillText('熊漆', 0, 0, 250);

  const imageData = ctx.getImageData(0, 0, el.width, el.height);
  // console.log(imageData);

  pos = getPoints(imageData, 0, 0);
  dotDraw(pos, ctx);
}

function getPoints(imageData = [], sx = 0, sy = 0) {
  const { width, height, data } = imageData;
  const gap = 7; // 间隙大小
  const pos = []; // 点数组
  const alpha = 200; // 透明度阈值
  for (let i = 0; i < height; i += gap) {
    for (let j = 0; j < width * 4; j += gap * 4) {
      if (data[i * width * 4 + j + 3] >= alpha) {
        pos.push({ x: sx + Math.floor(j / 4), y: sy + Math.floor(i) });
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
    ctx.fillStyle = this.color; // `rgba(${random(256)},${random(256)},${random(256)},${1 - random(0.5, false)})`;
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

function stepCreatorOld() {
  let count = 0;
  let posTmp = pos;
  const len = pos.length;
  let r = 3;
  let x = 0;
  ctx.clearRect(0, 0, el.width, el.height);
  return function step(timestamp) {
    if (count === 120) {
      count = -1;
    } else if (count < 60) {
      // ctx.clearRect(0, 0, el.width, el.height);
      // console.log('+',co);
      // r += 1 / 60;
      dots.forEach(i => {
        i.drawBoom();
      });
      // for (let i of pos) {
      //   ctx.beginPath();
      //   ctx.arc(i.x, i.y, r, 0, 2 * Math.PI);
      //   ctx.fillStyle = `hsl(${x % 360},100%,50%)`;
      //   ctx.fill();
      // }
    } else {
      // ctx.clearRect(0, 0, el.width, el.height);
      dots.forEach(i => {
        i.drawBoom();
      });
      // r -= 1 / 60;
      // // console.log('-');
      // for (let i of pos) {
      //   ctx.beginPath();
      //   ctx.arc(i.x, i.y, r, 0, 2 * Math.PI);
      //   ctx.fillStyle = `hsl(${x % 360},100%,50%)`;
      //   ctx.fill();
      // }
    }
    if (x === 360) x = 0;
    if (count % 5 === 0) ++x;
    count++;
    unanime = window.requestAnimationFrame(step);
  };
}

function random(range = 1, isInt = true) {
  return isInt ? Math.floor(Math.random() * range) : Math.random() * range;
}
