const el = document.createElement('canvas')
el.setAttribute('id', 'canvas')
// if(window)
el.setAttribute('width', window.innerWidth)
el.setAttribute('height', window.innerHeight)
// alert(window.innerWidth)
document.getElementById('root').appendChild(el)

const input = document.getElementById('input')
const button = document.getElementById('button')

const W = el.width
const H = el.height

// const el = document.getElementById('canvas');
const ctx = el.getContext('2d')
let pos = []
let dots = []
let unanime
const focalLength = 100
let time = 2000

function clickButton() {
  // window.cancelAnimationFrame(unanime);
  canvas()
  setTimeout(() => {
    unanime = window.requestAnimationFrame(stepCreator(0))
    setTimeout(() => {
      cancelAnimationFrame(unanime)
      unanime = window.requestAnimationFrame(stepCreator(1))
      setTimeout(() => {
        cancelAnimationFrame(unanime)
      }, time)
    }, time)
  }, 1000)
  // unanime = window.requestAnimationFrame(stepCreator());
  // setTimeout(()=>{cancelAnimationFrame(unanime)}, 100)
}

button.onclick = function() {
  clickButton()
}
input.onkeyup = function(e) {
  if (e.keyCode === 13) clickButton()
}
window.onload = function() {
  canvas()
  setTimeout(() => {
    unanime = window.requestAnimationFrame(stepCreator(0))
    setTimeout(() => {
      cancelAnimationFrame(unanime)
      unanime = window.requestAnimationFrame(stepCreator(1))
      setTimeout(() => {
        cancelAnimationFrame(unanime)
      }, time)
    }, time)
  }, 1000)
}

function canvas() {
  const text = input.value || 'HUY'
  ctx.clearRect(0, 0, el.width, el.height)
  pos = []
  dots = []

  ctx.font = '200px Menlo bold'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, el.width / 2, el.height / 2, 300)

  const imageData = ctx.getImageData(0, 0, el.width, el.height)

  pos = getPoints(imageData, 0, 0)
  dotDraw(pos, ctx)
}

function getPoints(imageData = [], sx = 0, sy = 0) {
  const { width, height, data } = imageData
  const gap = 7 // 间隙大小
  const pos = [] // 点数组
  const alpha = 200 // 透明度阈值
  for (let i = 0; i < height; i += gap) {
    for (let j = 0; j < width * 4; j += gap * 4) {
      if (data[i * width * 4 + j + 3] >= alpha) {
        pos.push({ x: sx + Math.floor(j / 4), y: sy + Math.floor(i) })
      }
    }
  }
  return pos
}

class dot {
  constructor(point) {
    this.x = point.x
    this.y = point.y
    this.z = 0
    this.r = 2
    this.xrun = point.x
    this.yrun = point.y
    this.zrun = 0
    this.rrun = 3

    this.colorHSL = random(360)

    this.boomZ = random(400)
    this.boomX = random(W)
    this.boomY = random(H)
  }
  get color() {
    return `hsl(${200},100%,50%)`
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.xrun, this.yrun, this.rrun, 0, 2 * Math.PI)
    ctx.fillStyle = this.color // `rgba(${random(256)},${random(256)},${random(256)},${1 - random(0.5, false)})`;
    ctx.fill()
  }
  drawBoom() {
    let disX = this.boomX - this.xrun
    let disY = this.boomY - this.yrun
    let disZ = this.boomZ - this.zrun
    let speedX = disX
    let speedY = disY
    let speedZ = disZ

    // this.zrun += speedZ
    let scale = focalLength / (focalLength + this.zrun)
    // if(this.x this.boomx)
    if (scale < 0.001) scale = 0
    this.xrun += speedX * scale * 0.3
    this.yrun += speedY * scale * 0.3
    this.zrun += speedZ * scale * 0.3
    this.rrun += speedZ * scale * 0.005
    this.rrun = this.rrun < 0 ? 0 : this.rrun
    this.draw()
  }
  drawBack() {
    let disX = this.x - this.xrun
    let disY = this.y - this.yrun
    let disZ = this.z - this.zrun
    let speedX = disX
    let speedY = disY
    let speedZ = disZ

    let scale = focalLength / (focalLength + this.zrun)
    // if(this.x this.boomx)
    if (scale < 0.001) scale = 0
    this.xrun += speedX * scale * 0.3
    this.yrun += speedY * scale * 0.3
    this.zrun += speedZ * scale * 0.3
    this.rrun += speedZ * scale * 0.005
    this.rrun = this.rrun < 0 ? 0 : this.rrun
    this.draw()
  }
}

function dotDraw(pos = [], ctx) {
  ctx.clearRect(0, 0, el.width, el.height)
  const r = 3
  let tmp
  for (let i of pos) {
    tmp = new dot(i)
    dots.push(tmp)
    tmp.draw()
  }
}

function stepCreator(type) {
  // ctx.clearRect(0, 0, el.width, el.height);
  if (type === 0)
    return function step(timestamp) {
      ctx.clearRect(0, 0, el.width, el.height)
      dots.forEach(i => {
        i.drawBoom()
      })
      unanime = window.requestAnimationFrame(step)
    }
  else if (type === 1)
    return function step(timestamp) {
      ctx.clearRect(0, 0, el.width, el.height)
      dots.forEach(i => {
        i.drawBack()
      })
      unanime = window.requestAnimationFrame(step)
    }
}

function stepCreatorOld() {
  let count = 0
  let posTmp = pos
  const len = pos.length
  let r = 3
  let x = 0
  ctx.clearRect(0, 0, el.width, el.height)
  return function step(timestamp) {
    if (count === 120) {
      count = -1
    } else if (count < 60) {
      dots.forEach(i => {
        i.drawBoom()
      })
    } else {
      dots.forEach(i => {
        i.drawBoom()
      })
    }
    if (x === 360) x = 0
    if (count % 5 === 0) ++x
    count++
    unanime = window.requestAnimationFrame(step)
  }
}

function random(range = 1, isInt = true) {
  return isInt ? Math.floor(Math.random() * range) : Math.random() * range
}
