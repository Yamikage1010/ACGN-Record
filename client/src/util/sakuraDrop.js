//樱花下落
import { getSakura } from '@/api/systemResource'

var stop, staticx
var img = new Image()
var sakura = ''
getSakura().then(res => {
  if (res.code == 200) {
    sakura = res.data
    img.src = sakura
    startSakura()
  }
})

function Sakura(x, y, s, r, fn, sx, sy) {
  this.x = x
  this.y = y
  this.s = s
  this.r = r
  this.fn = fn
  this.sx = sx
  this.sy = sy
  this.oneToZeroX = true
  this.oneToZeroY = true
}

Sakura.prototype.draw = function(cxt) {
  cxt.save()
  // var xc = (40 * this.s) / 4;
  cxt.translate(this.x, this.y)
  cxt.rotate(this.r)
  cxt.scale(this.sx, this.sy)
  cxt.drawImage(img, 0, 0, 40 * this.s, 40 * this.s)
  cxt.restore()
}

Sakura.prototype.update = function() {
  this.x = this.fn.x(this.x, this.y)
  this.y = this.fn.y(this.y, this.y)
  if (this.oneToZeroX) {
    this.sx = this.fn.sx(this.sx)
  } else {
    this.sx = this.fn.sy(this.sx)
  }
  if (this.oneToZeroY) {
    this.sy = this.fn.sx(this.sy)
  } else {
    this.sy = this.fn.sy(this.sy)
  }
  if (this.sx >= 1) {
    this.oneToZeroX = true
  } else if (this.sx <= 0) {
    this.oneToZeroX = false
  }
  if (this.sy >= 1) {
    this.oneToZeroY = true
  } else if (this.sy <= 0) {
    this.oneToZeroY = false
  }
  this.r = this.fn.r(this.r)
  if (this.x > window.innerWidth * 1.5 || this.x < 0 || this.y > window.innerHeight * 1.5 || this.y < 0) {
    this.r = getRandom('fnr')
    if (Math.random() > 0.4) {
      this.x = getRandom('x')
      this.y = 0
      this.s = getRandom('s')
      this.r = getRandom('r')
    } else {
      this.x = window.innerWidth * 1.5
      this.y = getRandom('y')
      this.s = getRandom('s')
      this.r = getRandom('r')
    }
  }
}

function SakuraList() {
  this.list = []
}
SakuraList.prototype.push = function(sakura) {
  this.list.push(sakura)
}
SakuraList.prototype.update = function() {
  for (var i = 0, len = this.list.length; i < len; i++) {
    this.list[i].update()
  }
}
SakuraList.prototype.draw = function(cxt) {
  for (var i = 0, len = this.list.length; i < len; i++) {
    this.list[i].draw(cxt)
  }
}
SakuraList.prototype.get = function(i) {
  return this.list[i]
}
SakuraList.prototype.size = function() {
  return this.list.length
}

function getRandom(option) {
  var ret, random
  switch (option) {
    case 'x':
      ret = Math.random() * window.innerWidth * 1.5
      break
    case 'y':
      ret = Math.random() * window.innerHeight * 1.5
      break
    case 'sx':
      ret = Math.random()
      break
    case 'sy':
      ret = Math.random()
      break
    case 's':
      ret = Math.random()
      break
    case 'r':
      ret = Math.random() * 6
      break
    case 'fnx':
      random = -0.5 + Math.random() * 1
      ret = function(x) {
        return x + 0.5 * random - 1.7
      }
      break
    case 'fny':
      random = 1.5 + Math.random() * 0.7
      ret = function(x, y) {
        return y + random
      }
      break
    case 'fnsx':
      random = Math.random() / 50
      ret = function(x) {
        return x - random
      }
      break
    case 'fnsy':
      random = Math.random() / 50
      ret = function(y) {
        return y + random
      }
      break
    case 'fnr':
      random = Math.random() * 0.03
      ret = function(r) {
        return r + random
      }
      break
  }
  return ret
}

function startSakura() {
  requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame
  var canvas = document.createElement('canvas'),
    cxt
  staticx = true
  canvas.height = window.innerHeight * 1.5
  canvas.width = window.innerWidth * 1.5
  canvas.setAttribute('style', 'position: fixed;left: 0;top: 0;pointer-events: none;')
  canvas.setAttribute('id', 'canvas_sakura')
  document.getElementsByTagName('body')[0].appendChild(canvas)
  cxt = canvas.getContext('2d')
  var sakuraList = new SakuraList()
  for (var i = 0; i < 200; i++) {
    var sakura,
      randomX,
      randomY,
      randomSX,
      randomSY,
      randomS,
      randomR,
      randomFnx,
      randomFnsy,
      randomFnsx,
      randomFny,
      randomFnR
    randomX = getRandom('x')
    randomY = getRandom('y')
    randomSX = getRandom('sx')
    randomSY = getRandom('sy')
    randomR = getRandom('r')
    randomS = getRandom('s')
    randomFnx = getRandom('fnx')
    randomFny = getRandom('fny')
    randomFnsx = getRandom('fnsx')
    randomFnsy = getRandom('fnsy')
    randomFnR = getRandom('fnr')
    sakura = new Sakura(
      randomX,
      randomY,
      randomS,
      randomR,
      {
        x: randomFnx,
        y: randomFny,
        sx: randomFnsx,
        sy: randomFnsy,
        r: randomFnR
      },
      randomSX,
      randomSY
    )
    sakura.draw(cxt)
    sakuraList.push(sakura)
  }
  stop = requestAnimationFrame(function func() {
    cxt.clearRect(0, 0, canvas.width, canvas.height)
    sakuraList.update()
    sakuraList.draw(cxt)
    stop = requestAnimationFrame(func)
  })
}

// window.onresize = function() {
//   var canvasSnow = document.body;
//   canvasSnow.width = window.innerWidth*1.5;
//   canvasSnow.height = window.innerHeight*1.5;
// };

// img.onload = function() {
//   startSakura();
// };

export function stopSakura() {
  if (staticx) {
    var child = document.getElementById('canvas_sakura')
    child.parentNode.removeChild(child)
    window.cancelAnimationFrame(stop)
    staticx = false
  } else {
    startSakura()
  }
}
