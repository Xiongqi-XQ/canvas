/**
 * 返回随机(整)数, [0, range)
 * @param {number} range 范围
 * @param {boolean} isInt 是否整数
 */
function random(range = 1, isInt = true) {
  return isInt ? Math.floor(Math.random() * range) : Math.random() * range
}

/**
 * 返回 points
 * @param {Array} imageData
 * @param {number} gap 间隙大小
 * @param {number} alpha 透明度阈值
 * @param {number} rgbMax 色彩阈值
 * @param {number} rgbMin 色彩阈值
 * @returns {Array} points 数组
 */
function getIMGPoints(imageData = [], gap = 13, alpha = 250, rgbMax = 765, rgbMin = 0) {
  const { width, height, data } = imageData
  const points = []
  for (let i = 0; i < height; i += gap) {
    for (let j = 0; j < width * 4; j += gap * 4) {
      if (data[i * width * 4 + j + 3] >= alpha) {
        const r = data[i * width * 4 + j]
        const g = data[i * width * 4 + j + 1]
        const b = data[i * width * 4 + j + 2]
        const a = data[i * width * 4 + j + 3]
        if (r + g + b <= rgbMax && r + g + b >= rgbMin)
          points.push({
            x: Math.floor(j / 4),
            y: Math.floor(i),
            rgba: { r, g, b, a },
          })
      }
    }
  }
  return points
}

/**
 * 点击事件判断
 * @param {Event} event
 * @param {string} type
 */
function clickFunc(event, type) {
  switch (type) {
    case 'img':
      image()
      break
    case 'text':
      text()
      break
    case 'selected':
      selected()
      break
    case 'randomz':
      randomz()
      break
    case 'simple':
      initSimple()
      break
    case 'boom':
      boom()
      break
    default:
      break
  }
}

/**
 * 图像点击事件
 * @param {Event} event
 */
function image(event) {
  const value = document.querySelector('#img').value || sessionStorage.img
  sessionStorage.img = value
  sessionStorage.now = 'img'
  initImg()
}

/**
 * 文本点击事件
 * @param {Event} event
 */
function text(event) {
  const value = document.querySelector('#text').value || sessionStorage.text
  sessionStorage.text = value
  document.querySelector('#text').value = ''
  sessionStorage.now = 'text'
  initText()
}

/**
 * 选择点击事件
 * @param {Event} event
 */
function selected(event) {
  const value = document.querySelector('#select').value || 'img/d.svg'
  sessionStorage.img = 'img/'+value
  sessionStorage.now = 'img'
  initImg()
}

/**
 * simpleBalls事件
 * @param {Event} event
 */
function simple(event) {
  sessionStorage.now = 'simple'
  initSimple()
}

/**
 * boom事件
 * @param {Event} event
 */
function boom(event) {
  const value = document.querySelector('#text').value || sessionStorage.text
  sessionStorage.text = value
  document.querySelector('#text').value = ''
  sessionStorage.now = 'boom'
  initBoom()
}

/**
 * 随机z点击事件
 * @param {Event} event
 */
function randomz(event) {
  const value = document.querySelector('#randomz').value || sessionStorage.randomz
  sessionStorage.randomz = value
  switch (sessionStorage.now) {
    case 'img':
      initImg()
      break
    case 'text':
      initText()
      break
    case 'simple':
      break
    case 'boom':
      initBoom()
      break
    default:
      initImg()
      break
  }
}

/**
 * 缩放图片大小以填充指定大小区域
 * @param {Image} img
 * @param {number} W 指定区域宽度
 * @param {number} H 指定区域高度
 * @param {number} bigger 填充后再次缩放比例
 */
function imgZoomFnc(img, W = 800, H = 800, bigger = 1) {
  const wZoom = W / img.width;
  const hZoom = H / img.height;
  if (hZoom <= wZoom) {
    img.height = H * bigger;
    img.width *= hZoom * bigger;
  } else {
    img.width = W * bigger;
    img.height *= wZoom * bigger;
  }
}
