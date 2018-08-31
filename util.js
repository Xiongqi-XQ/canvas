/**
 * 返回随机(整)数, [0, range)
 * @param {number} range 范围
 * @param {boolean} isInt 是否整数
 */
function random(range = 1, isInt = true) {
  return isInt ? Math.floor(Math.random() * range) : Math.random() * range;
}
