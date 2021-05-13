export function changeTheme(acgnTheme) {
  let body = document.getElementsByTagName('body')[0]
  if (acgnTheme === 1001) {
    body.style.setProperty('--backgroundColor-theme', '#ffaaee')
    body.style.setProperty('--color-theme', '#ff88cc')
    body.style.setProperty('--backgroundColorHover-theme', '#ff88cc')
    body.style.setProperty('--colorHover-theme', '#ff88cc')
  } else if (acgnTheme === 1000) {
    body.style.setProperty('--backgroundColor-theme', '#91bef0')
    body.style.setProperty('--color-theme', '#6eb1fd')
    body.style.setProperty('--backgroundColorHover-theme', '#6eb1fd')
    body.style.setProperty('--colorHover-theme', '#6eb1fd')
  }
}
export function musicDataHandle(bgm) {
  return bgm.map(item => {
    let musicData = item.split('_')[2].split('-')
    return {
      title: musicData[1],
      artist: musicData[0],
      src: 'http://localhost:9810/acgnrecord/music/' + item
    }
  })
}
