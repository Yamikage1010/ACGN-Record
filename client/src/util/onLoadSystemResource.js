function loadImage(src) {
  let p = new Promise(function(resolve, reject) {
    let img = new Image()
    img.onload = function() {
      //加载时执行resolve函数
      resolve(img)
    }
    img.onerror = function() {
      reject(src)
    }
    img.src = src
  })
  return p
}
/*loadData {
    apiSrc//路径
    loaded//已加载数量
 }*/
async function loadAcgnImage(imageNameArray, loadData) {
  let arr = []
  for (let i = 0; i < imageNameArray.length; i++) {
    await loadImage(loadData.apiSrc + imageNameArray[i]).then(img => {
      arr.push(img)
      loadData.loaded++
      console.log(loadData.loaded)
    })
  }
  return arr
}
export { loadAcgnImage }
