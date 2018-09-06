const button = document.querySelector('#reset');
let colorType = false;
let auto = true;
const { PI, sin, cos, abs } = Math;

const canvas = document.createElement('canvas');
canvas.setAttribute('id', 'canvas');
canvas.setAttribute('width', Math.max(window.innerWidth, 800));
canvas.setAttribute('height', Math.max(window.innerHeight, 800));
const ctx = canvas.getContext('2d');
document.getElementById('root').appendChild(canvas);

const Xc = canvas.width / 2;
const Yc = canvas.height / 2;
const W = canvas.width;
const H = canvas.height;
const focalLength = 400;
let scale = 1;
const clear = () => ctx.clearRect(0, 0, W, H);

let img = new Image();
let imgZoom = 1;

let un;
let angleY = 0;
let angleX = 0;
let speed = 0.000015;

sessionStorage.img = sessionStorage.img || 'svg.svg';
sessionStorage.text = sessionStorage.text || 'HUY';
sessionStorage.randomz = sessionStorage.randomz || 0;
sessionStorage.now = sessionStorage.now || 0;

function init3() {
  clear();
  if (un) cancelAnimationFrame(un);
  const balls = [];
  img = new Image();
  img.onload = () => {
    imgZoomFnc(img, W, H);
    const w = img.width;
    const h = img.height;
    ctx.drawImage(img, Xc - w / 2, Yc - h / 2, w, h);
    const imageData = ctx.getImageData(0, 0, W, H);
    pos = getIMGPoints(imageData, 13, 200);
    clear();
    pos.forEach(({ x, y, rgba }) => {
      let ball = new Ball({ xpos: x - Xc, ypos: y - Yc, zpos: random(Number(sessionStorage.randomz))||0, r: 3, rgba });
      balls.push(ball);
      ball.draw({});
    });
    randomBall(balls, 200);
    rotateFnc({ offsetX: Xc + 100, offsetY: Yc }, balls);
    canvas.addEventListener('mousemove', event => rotateFnc(event, balls));
  };
  img.src = sessionStorage.img || 'svg.svg';
}
function init2() {
  clear();
  if (un) cancelAnimationFrame(un);
  const balls = [];
  // ctx.drawImage(img, 0, 0);
  ctx.font = '200px Menlo bold';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(sessionStorage.text, Xc, Yc, 250);

  const imageData = ctx.getImageData(0, 0, W, H);

  pos = getPoints(imageData, 7, 200);
  clear();
  pos.forEach(({ x, y }) => {
    const ball = new Ball({ xpos: x - Xc, ypos: y - Yc, zpos: random(Number(sessionStorage.randomz))||0, r: 2 });
    balls.push(ball);
    ball.draw({});
  });
  randomBall(balls, 200);
  canvas.addEventListener('mousemove', event => rotateFnc(event, balls));
  rotateFnc({ offsetX: Xc + 100, offsetY: Yc }, balls);
}
function init1() {
  sessionStorage.now = 1;
  clear();
  if (un) cancelAnimationFrame(un);
  const balls = [];
  for (let i = 0; i < 10; i++) {
    const xpos = random(200) - 100; // 相对中心的位置
    const ypos = random(200) - 100;
    const zpos = random(200) - 100;
    // const angle = random(2 * PI);
    const r = random(20) + 10; // 半径
    const ball = new Ball({ xpos, ypos, zpos, r });
    balls.push(ball);
    ball.draw({});
  }
  rotateFnc({ offsetX: Xc + 100, offsetY: Yc + 100 }, balls);
  canvas.addEventListener('mousemove', event => rotateFnc(event, balls));
}
function randomBall(balls, num = 100, r = 3, w = 1000, h = 1000, z = 1000) {
  for (let i = 0; i < num; i++) {
    let ball = new Ball({ xpos: random(2 * w) - w, ypos: random(2 * h) - h, zpos: random(2 * z) - z, r, log: true });
    balls.push(ball);
    ball.draw({});
  }
}
function mouseMove(event, ball) {
  const { offsetX, offsetY } = event;
  const Xdis = Xc - offsetX;
  const Ydis = Yc - offsetY;
  const zoom = 2;
  ball.x = Xc - Xdis / zoom;
  ball.y = Yc - Ydis / zoom;
  ball.draw({});
}

function rotateFnc(event, balls) {
  // clear();
  const { offsetX, offsetY } = event;
  const Xdis = offsetX - Xc;
  const Ydis = offsetY - Yc;
  // console.log(Xc, Yc, Xdis, Ydis);
  // let angleY = Xdis * 0.05;
  // console.log('angleY', angleY);

  // man(balls, Xdis*0.05);
  if (auto) anime(balls, -Xdis * speed, Ydis * speed);
  else man(balls, -Xdis * speed, Ydis * speed);
}
function man(balls, angleY, angleX) {
  if (un) cancelAnimationFrame(un);
  clear();
  balls.sort((a, b) => b.z - a.z).forEach(ball => ball.rotate(angleY, angleX));
}
function anime(balls, angleY, angleX) {
  if (un) cancelAnimationFrame(un);
  un = requestAnimationFrame(() => frame());
  function frame() {
    // console.log(angleY);
    clear();
    balls.sort((a, b) => b.z - a.z).forEach(ball => ball.rotate(angleY, angleX));
    // angleY += speed1;
    // angleX += speed2;
    // console.log(angleY,angleX);
    // console.log(angleY);
    un = requestAnimationFrame(() => frame());
  }
}
class Ball {
  constructor({ xpos = 0, ypos = 0, zpos = 0, r = 1, angle = 0, rgba, log }) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.zpos = zpos;
    this.x = xpos + Xc;
    this.y = ypos + Yc;
    this.z = zpos;
    this.r = r;
    this.angle = angle;
    this.colorHSL = random(360);
    this.A = 100;
    if (log) {
      this.log = log;
      // console.log(this.x, this.y);
    }
    if (rgba) this.rgba = rgba;
  }
  get color() {
    if (this.rgba) {
      const { r, g, b, a } = this.rgba;
      return `rgba(${r},${g},${b},${a})`;
    }
    const colorHSL = this.colorHSL || random(360);
    if (colorType) this.colorHSL += 0.2;
    return `hsl(${this.colorHSL},100%,50%,${this.A}%)`;
  }
  draw({ x = this.x, y = this.y, r = this.r }) {
    // if (this.log) console.log(x,y,this.z);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color; // `rgba(${random(256)},${random(256)},${random(256)},${1 - random(0.5, false)})`;
    ctx.fill();
  }

  rotate(angleY, angleX) {
    // const cosy = cos(angleY);
    // const siny = sin(angleY);
    // const x1 = this.zpos * siny + this.xpos * cosy;
    // const y1 = this.ypos;
    // const z1 = this.zpos * cosy - this.xpos * siny;

    // const cosx = cos(angleX);
    // const sinx = sin(angleX);
    // const x2 = x1;
    // const y2 = -z1 * sinx + y1 * cosx;
    // const z2 = z1 * cosx + y1 * sinx;

    const cosx = cos(angleX);
    const sinx = sin(angleX);
    const x2 = this.xpos;
    const y2 = -this.zpos * sinx + this.ypos * cosx;
    const z2 = this.zpos * cosx + this.ypos * sinx;

    const cosy = cos(angleY);
    const siny = sin(angleY);
    const x1 = z2 * siny + x2 * cosy;
    const y1 = y2;
    const z1 = z2 * cosy - x2 * siny;

    scale = focalLength / (focalLength + z1); // focalLength;
    // console.log('scale', scale);
    // const x = Xc - (Xc - x1) * scale;
    // const y = Yc - (Yc - this.y) * scale;

    this.xpos = x1;
    this.ypos = y1;
    this.zpos = z1

    this.x = Xc + x1 * scale;
    this.y = Yc + y1 * scale;
    this.z = z1;
    const r = this.r * scale < 0 ? 0 : this.r * scale;
    // this.A = 100 - scale * 10;
    this.draw({ r });
  }
  drawBoom() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.r += 0.3;
    this.draw({});
  }
}

init3();
