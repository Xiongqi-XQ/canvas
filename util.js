/**
 * 返回随机(整)数, [0, range)
 * @param {number} range 范围
 * @param {boolean} isInt 是否整数
 */
function random(range = 1, isInt = true) {
  return isInt ? Math.floor(Math.random() * range) : Math.random() * range;
}

function getPoints(imageData = [], gap = 13, alpha = 250) {
  const { width, height, data } = imageData;
  // const gap = gap || 12; // 间隙大小
  const pos = []; // 点数组
  // const alpha = alpha || 200; // 透明度阈值
  for (let i = 0; i < height; i += gap) {
    for (let j = 0; j < width * 4; j += gap * 4) {
      if (data[i * width * 4 + j + 3] >= alpha) {
        pos.push({
          x: Math.floor(j / 4),
          y: Math.floor(i),
        });
      }
    }
  }
  return pos;
}
function getIMGPoints(imageData = [], gap = 13, alpha = 250) {
  const { width, height, data } = imageData;
  // const gap = gap || 12; // 间隙大小
  const pos = []; // 点数组
  // const alpha = alpha || 200; // 透明度阈值
  for (let i = 0; i < height; i += gap) {
    for (let j = 0; j < width * 4; j += gap * 4) {
      if (data[i * width * 4 + j + 3] >= alpha) {
        const r = data[i * width * 4 + j];
        const g = data[i * width * 4 + j + 1];
        const b = data[i * width * 4 + j + 2];
        const a = data[i * width * 4 + j + 3];
        if (r + g + b < 550)
          pos.push({
            x: Math.floor(j / 4),
            y: Math.floor(i),
            rgba: { r, g, b, a },
          });
      }
    }
  }
  return pos;
}

function text(event) {
  const value = document.querySelector('#text').value || sessionStorage.text;
  sessionStorage.text = value;
  document.querySelector('#text').value = '';
  init2();
}

function image(event) {
  const value = document.querySelector('#img').value || sessionStorage.img;
  sessionStorage.img = value;
  init3();
}

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
