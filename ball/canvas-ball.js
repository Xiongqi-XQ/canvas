/*******    init    *******/
const canvas = document.createElement('canvas')
canvas.setAttribute('id', 'canvas')
canvas.setAttribute('width', Math.max(window.innerWidth, 200))
canvas.setAttribute('height', Math.max(window.innerHeight, 200))
document.getElementById('root').appendChild(canvas)
const ctx = canvas.getContext('2d')

/*******    util    *******/
const { PI, sin, cos, abs, max, min } = Math
const clear = () => ctx.clearRect(0, 0, W, H)
const Xc = canvas.width / 2
const Yc = canvas.height / 2
const W = canvas.width
const H = canvas.height

/*******    config    *******/
let autoColor = false
let autoCircle = true
let autoColorText = false
let un

sessionStorage.img = sessionStorage.img || 'img/google.png'
sessionStorage.text = sessionStorage.text || 'HUY'
sessionStorage.randomz = sessionStorage.randomz || 100
sessionStorage.now = 'img'

let angleYtotal = 0
let angleXtotal = 0
let latestMouseX = Xc + 100
let latestMouseY = Yc
let boomCheck

let balls = []

/*******    func    *******/
function initImg() {
  clear()
  if (un) cancelAnimationFrame(un)
  let img = new Image()
  img.onload = () => {
    imgZoomFnc(img, W, H)
    const w = img.width
    const h = img.height
    ctx.drawImage(img, Xc - w / 2, Yc - h / 2, w, h)

    const imageData = ctx.getImageData(0, 0, W, H)
    const pos = getIMGPoints(imageData, 13, 230, 650)
    balls = []
    pos.forEach(({ x, y, rgba }) => {
      let ball = new Ball({ xpos: x - Xc, ypos: y - Yc, zpos: random(Number(sessionStorage.randomz)) || 0, r: 3, rgba })
      balls.push(ball)
    })
    clear()
    randomBall(balls, 200)
    balls.sort((a, b) => b.z - a.z).forEach(ball => ball.rotate(angleYtotal, angleXtotal))

    rotateFnc({ offsetX: latestMouseX, offsetY: latestMouseY })
    canvas.removeEventListener('mousemove', rotateFnc)
    canvas.addEventListener('mousemove', rotateFnc)
  }
  img.src = sessionStorage.img
}

function initText() {
  clear()
  if (un) cancelAnimationFrame(un)

  ctx.font = `${Xc}px Menlo bold`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(sessionStorage.text, Xc, Yc, Xc)

  const imageData = ctx.getImageData(0, 0, W, H)

  pos = getIMGPoints(imageData, 7, 200)
  balls = []
  let colorHSL = random(360)
  pos.forEach(({ x, y }) => {
    const ball = new Ball({
      xpos: x - Xc,
      ypos: y - Yc,
      zpos: random(Number(sessionStorage.randomz)) || 0,
      r: 2,
      colorHSL,
    })
    balls.push(ball)
  })

  clear()
  randomBall(balls, 200)
  balls.sort((a, b) => b.z - a.z).forEach(ball => ball.rotate(angleYtotal, angleXtotal))

  rotateFnc({ offsetX: latestMouseX, offsetY: latestMouseY })
  canvas.removeEventListener('mousemove', rotateFnc)
  canvas.addEventListener('mousemove', rotateFnc)
}

function initBoom() {
  clear()
  if (un) cancelAnimationFrame(un)
  canvas.removeEventListener('mousemove', rotateFnc)

  ctx.font = `${max((Xc * 3) / 4, 400)}px Menlo bold`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(sessionStorage.text, Xc, Yc, Xc)

  const imageData = ctx.getImageData(0, 0, W, H)

  pos = getIMGPoints(imageData, 13, 200)
  balls = []
  let colorHSL = random(360)
  pos.forEach(({ x, y }) => {
    const ball = new Ball({
      xpos: x - Xc,
      ypos: y - Yc,
      zpos: random(Number(sessionStorage.randomz)) || 0,
      r: 2,
      colorHSL,
    })
    balls.push(ball)
  })

  clear()
  const randomBalls = []
  randomBalls.sort((a, b) => b.z - a.z).forEach(ball => ball.draw())
  balls.sort((a, b) => b.z - a.z).forEach(ball => ball.draw())

  boomFunc(balls, randomBalls)
}

function initSimple() {
  clear()
  if (un) cancelAnimationFrame(un)

  balls = []
  for (let i = 0; i < 10; i++) {
    const xpos = random(400) - 200 // 相对中心的位置
    const ypos = random(400) - 200
    const zpos = random(400) - 200
    const r = random(20) + 10 // 半径
    const ball = new Ball({ xpos, ypos, zpos, r })
    balls.push(ball)
  }
  balls.sort((a, b) => b.z - a.z).forEach(ball => ball.rotate(angleYtotal, angleXtotal))

  rotateFnc({ offsetX: latestMouseX, offsetY: latestMouseY })
  canvas.removeEventListener('mousemove', rotateFnc)
  canvas.addEventListener('mousemove', rotateFnc)
}

function randomBall(balls, num = 100, r = 3, w = 1000, h = 1000, z = 1000) {
  for (let i = 0; i < num; i++) {
    let ball = new Ball({ xpos: random(2 * w) - w, ypos: random(2 * h) - h, zpos: random(2 * z) - z, r })
    balls.push(ball)
  }
  return balls
}

function rotateFnc(event) {
  const { offsetX, offsetY } = event

  latestMouseX = offsetX
  latestMouseY = offsetY

  const Xdis = offsetX - Xc
  const Ydis = offsetY - Yc

  let speed = 0.000015
  let angleY = (-Xdis * speed) % (2 * PI)
  let angleX = (Ydis * speed) % (2 * PI)

  if (autoCircle) anime(balls, angleY, angleX)
  else man(balls, angleY, angleX)
}

function man(balls, angleY, angleX) {
  if (un) cancelAnimationFrame(un)
  clear()
  balls.sort((a, b) => b.z - a.z).forEach(ball => ball.rotate(angleY, angleX))
  angleYtotal = (angleYtotal + angleY) % (2 * PI)
  angleXtotal = (angleXtotal + angleX) % (2 * PI)
}

function anime(balls, angleY, angleX) {
  if (un) cancelAnimationFrame(un)
  un = requestAnimationFrame(frame)
  function frame() {
    clear()
    balls.sort((a, b) => b.z - a.z).forEach(ball => ball.rotate(angleY, angleX))
    angleYtotal = (angleYtotal + angleY) % (2 * PI)
    angleXtotal = (angleXtotal + angleX) % (2 * PI)
    un = requestAnimationFrame(frame)
  }
}

function boomFunc(balls, randomBalls) {
  if (un) cancelAnimationFrame(un)
  let time = 2000
  setTimeout(() => {
    un = requestAnimationFrame(boomCreator(0, randomBalls))
    setTimeout(() => {
      cancelAnimationFrame(un)
      un = requestAnimationFrame(boomCreator(1, randomBalls))
      setTimeout(() => {
        cancelAnimationFrame(un)
      }, time)
    }, time)
  }, 1000)
}
function boomCreator(type, randomBalls) {
  if (un) cancelAnimationFrame(un)
  if (type === 0)
    return function step() {
      clear()
      randomBalls.sort((a, b) => b.z - a.z).forEach(ball => ball.draw())
      balls.sort((a, b) => b.z - a.z).forEach(ball => ball.drawBoom())
      un = requestAnimationFrame(step)
    }
  else if (type === 1)
    return function step(timestamp) {
      clear()
      randomBalls.sort((a, b) => b.z - a.z).forEach(ball => ball.draw())
      balls.sort((a, b) => b.z - a.z).forEach(ball => ball.drawBack())
      un = requestAnimationFrame(step)
    }
}

class Ball {
  constructor({ xpos = 0, ypos = 0, zpos = 0, r = 1, angle = 0, rgba, colorHSL }) {
    this.xpos = xpos
    this.ypos = ypos
    this.zpos = zpos

    this.r = r
    this.angle = angle
    this.colorHSL = (!autoColorText && colorHSL) || random(360)
    this.rgba = rgba
    this.A = 100
  }
  get x() {
    return Xc + this.xpos * this.zFactor
  }
  get y() {
    return Yc + this.ypos * this.zFactor
  }
  get z() {
    return this.zpos
  }
  get zFactor() {
    return 400 / (this.z + 400)
  }

  get color() {
    if (this.rgba) {
      const { r, g, b, a } = this.rgba
      return `rgba(${r},${g},${b},${a})`
    }
    if (autoColor) this.colorHSL += 0.2
    return `hsl(${this.colorHSL},100%,50%,${this.A}%)`
  }
  draw({ x = this.x, y = this.y, r = this.r } = {}) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.strokeStyle = this.color
    ctx.fillStyle = this.color // `rgba(${random(256)},${random(256)},${random(256)},${1 - random(0.5, false)})`;
    ctx.fill()
  }

  rotate(angleY, angleX) {
    const cosx = cos(angleX)
    const sinx = sin(angleX)
    const x1 = this.xpos
    const y1 = this.ypos * cosx - this.zpos * sinx
    const z1 = this.zpos * cosx + this.ypos * sinx

    const cosy = cos(angleY)
    const siny = sin(angleY)
    const x2 = z1 * siny + x1 * cosy
    const y2 = y1
    const z2 = z1 * cosy - x1 * siny

    this.xpos = x2
    this.ypos = y2
    this.zpos = z2

    const r = this.r * this.zFactor < 0 ? 0 : this.r * this.zFactor

    this.draw({ r })
  }
  drawBoom() {
    if (this.boomX === undefined) {
      this.boomX = random(W) - Xc
      this.boomY = random(H) - Yc
      this.boomZ = random(400)
      this.xrun = this.xpos
      this.yrun = this.ypos
      this.zrun = this.zpos
      this.rrun = this.r
    }
    let disX = this.boomX - this.xrun
    let disY = this.boomY - this.yrun
    let disZ = this.boomZ - this.zrun
    let speedX = disX
    let speedY = disY
    let speedZ = disZ

    let focalLength = 100
    let scale = focalLength / (focalLength + this.zrun)

    if (scale < 0.001) scale = 0
    this.xrun += speedX * scale * 0.3
    this.yrun += speedY * scale * 0.3
    this.zrun += speedZ * scale * 0.3
    this.rrun += speedZ * scale * 0.005
    this.rrun = this.rrun < 0 ? 0 : this.rrun
    this.draw({ x: this.xrun + Xc, y: this.yrun + Yc, r: this.rrun })
  }
  drawBack() {
    let disX = this.xpos - this.xrun
    let disY = this.ypos - this.yrun
    let disZ = this.zpos - this.zrun
    let speedX = disX
    let speedY = disY
    let speedZ = disZ

    let focalLength = 100
    let scale = focalLength / (focalLength + this.zrun)

    if (scale < 0.001) scale = 0
    this.xrun += speedX * scale * 0.3
    this.yrun += speedY * scale * 0.3
    this.zrun += speedZ * scale * 0.3
    this.rrun += speedZ * scale * 0.005
    this.rrun = this.rrun < 0 ? 0 : this.rrun
    this.draw({ x: this.xrun + Xc, y: this.yrun + Yc, r: this.rrun })
  }
}

/*******    start    *******/
;(function() {
  initImg()
})()
