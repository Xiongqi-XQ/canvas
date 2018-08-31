const button = document.querySelector('#reset');
let colorType = false;
let auto = true;
const { PI, sin, cos, abs } = Math;

const el = document.querySelector('#canvas');
const ctx = el.getContext('2d');

const Xc = el.width / 2;
const Yc = el.height / 2;
const W = el.width;
const H = el.height;
const focalLength = 250;
let scale = 1;
const clear = () => ctx.clearRect(0, 0, W, H);

function init() {
  clear();
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
  // el.addEventListener('mousemove', event => mouseMove(event, ball));
  el.addEventListener('mousemove', event => rotateY(event, balls));
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
let un;
let angleY = 0;
function rotateY(event, balls) {
  // clear();
  const { offsetX, offsetY } = event;
  const Xdis = offsetX - Xc;
  const Ydis = offsetY - Yc;
  // let angleY = Xdis * 0.05;
  // console.log('angleY', angleY);

  // man(balls, Xdis*0.05);
  auto ? anime(balls, Xdis * 0.001) : man(balls, Xdis * 0.05);
  // if (un) cancelAnimationFrame(un);
  // un = requestAnimationFrame(()=>anime(balls, angleY));
}
function man(balls, a) {
  if (un) cancelAnimationFrame(un);
  clear();
  balls.sort((a, b) => a.z - b.z).forEach(ball => ball.rotateY(a));
}
function anime(balls, speed) {
  if (un) cancelAnimationFrame(un);
  un = requestAnimationFrame(() => frame(balls, angleY));
  function frame() {
    // console.log(angleY);
    clear();
    balls.sort((a, b) => a.z - b.z).forEach(ball => ball.rotateY(angleY));
    angleY += speed;
    // console.log(angleY);
    un = requestAnimationFrame(() => frame(balls, angleY));
  }
}
class Ball {
  constructor({ xpos = 0, ypos = 0, zpos = 0, r = 1, angle = 0 }) {
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
  }
  get color() {
    const colorHSL = this.colorHSL || random(360);
    if (colorType) this.colorHSL += 0.2;
    return `hsl(${this.colorHSL},100%,50%,${this.A}%)`;
  }
  draw({ x = this.x, y = this.y, r = this.r }) {
    // console.log('r', r);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color; // `rgba(${random(256)},${random(256)},${random(256)},${1 - random(0.5, false)})`;
    ctx.fill();
  }

  rotateY(angleY) {
    const cosy = cos(angleY);
    const siny = sin(angleY);
    const x1 = this.zpos * siny + this.xpos * cosy;
    const z1 = this.zpos * cosy - this.xpos * siny;

    scale = (focalLength + z1) / focalLength;
    // console.log('scale', scale);
    // const x = Xc - (Xc - x1) * scale;
    // const y = Yc - (Yc - this.y) * scale;
    this.x = Xc + x1 * scale;
    this.y = Yc + this.ypos * scale;
    this.z = z1;
    const r = this.r * scale;
    this.A = scale * 40 + 30;
    this.draw({ r });
  }
  drawBoom() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.r += 0.3;
    this.draw({});
  }
}

init();
