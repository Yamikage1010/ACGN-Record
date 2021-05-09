export function getLocalTime(nS) {
  return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/, ' ')
}
//animation-duration: ;
export function createBackgroundAnimetion(backgroundImages, apiSrc) {
  let keyframesChangeBG1 = `0% {
            transform: scale(1.03);
            background-image: url('${apiSrc}${backgroundImages[0]}');
          }`,
    keyframesChangeBG2 = ``
  let oneLoop = Math.floor(100 / backgroundImages.length)
  let changeTime = Math.floor(oneLoop / 5)
  if (backgroundImages.length % 2 === 1) {
    //奇数
    for (let i = 1; i <= backgroundImages.length - 2; i += 2) {
      keyframesChangeBG1 += `
          ${oneLoop * i - changeTime}% {
            opacity: 1;
          }
          ${oneLoop * i}% {
            transform: scale(1.1);
            background-image: url('${apiSrc}${backgroundImages[i - 1]}');
            opacity: 0;
          }
          ${oneLoop * (i + 1) - changeTime}% {
            transform: scale(1);
            background-image: url('${apiSrc}${backgroundImages[i + 1]}');
            opacity: 0;
          }
          ${oneLoop * (i + 1)}% {
            opacity: 1;
          }`
      keyframesChangeBG2 += `
          ${oneLoop * i - changeTime}% {
            transform: scale(1);
            background-image: url('${apiSrc}${backgroundImages[i]}');
          }
          ${oneLoop * (i + 1)}% {
            transform: scale(1.1);
            background-image: url('${apiSrc}${backgroundImages[i]}');
          }`
    }
    keyframesChangeBG1 += `${oneLoop * backgroundImages.length - changeTime}% {
            opacity: 1;
            background-image: url('${apiSrc}${backgroundImages[backgroundImages.length - 1]}');
          }
          100% {
            transform: scale(1.1);
            opacity: 0;
          }`
    keyframesChangeBG2 += `${oneLoop * backgroundImages.length - changeTime}% {
            transform: scale(1);
            background-image: url('${apiSrc}${backgroundImages[0]}');
          }
          100% {
            transform: scale(1.03);
            background-image: url('${apiSrc}${backgroundImages[0]}');
          }`
  } else {
    //偶数
    for (let i = 0; i <= backgroundImages.length - 2; i += 2) {
      keyframesChangeBG1 += `
          ${oneLoop * (i + 1) - changeTime}% {
            opacity: 1;
          }
          ${oneLoop * (i + 1)}% {
            transform: scale(1.1);
            background-image: url('${apiSrc}${backgroundImages[i]}');
            opacity: 0;
          }
          ${oneLoop * (i + 2) - changeTime}% {
            transform: scale(1);
            background-image: url('${apiSrc}${backgroundImages[i + 2 === backgroundImages.length ? 0 : i + 2]}');
            opacity: 0;
          }
          ${i + 2 === backgroundImages.length ? 100 : oneLoop * (i + 2)}% {
            ${i + 2 === backgroundImages.length ? ` transform: scale(1.03); ` : ``}
            opacity: 1;
          }`
      keyframesChangeBG2 += `
          ${oneLoop * (i + 1) - changeTime}% {
            transform: scale(1);
            background-image: url('${apiSrc}${backgroundImages[i + 1]}');
          }
          ${i + 2 === backgroundImages.length ? 100 : oneLoop * (i + 2)}% {
            transform: scale(1.1);
            background-image: url('${apiSrc}${backgroundImages[i + 1]}');
          }`
    }
  }
  let backgroundKeyframes =
    `@keyframes changeBG1 {` + keyframesChangeBG1 + `}` + `\n` + `@keyframes changeBG2 {` + keyframesChangeBG2 + `}`
  return backgroundKeyframes
}
//  `
//         @keyframes changeBG1 {
//           0% {
//             transform: scale(1.03);
//             background-image: url('${apiSrc}${backgroundImages[0]}');
//             opacity: 1;
//           }
//           28% {
//             opacity: 1;
//           }
//           33% {
//             transform: scale(1.1);
//             background-image: url('${apiSrc}${backgroundImages[0]}');
//             opacity: 0;
//           }
//           61% {
//             transform: scale(1);
//             background-image: url('${apiSrc}${backgroundImages[2]}');
//             opacity: 0;
//           }
//           66% {
//             opacity: 1;
//           }
//           94% {
//             background-image: url('${apiSrc}${backgroundImages[2]}');
//             opacity: 1;
//           }
//           100% {
//             transform: scale(1.1);
//             opacity: 0;
//           }
//         }
//         @keyframes changeBG2 {
//           0% {
//             transform: scale(1);
//             background-image: url('${apiSrc}${backgroundImages[1]}');
//           }
//           28% {
//             transform: scale(1);
//           }
//           66% {
//             transform: scale(1.1);
//             background-image: url('${apiSrc}${backgroundImages[1]}');
//           }
//           94% {
//             transform: scale(1);
//             background-image: url('${apiSrc}${backgroundImages[0]}');
//           }
//           100% {
//             transform: scale(1.03);
//             background-image: url('${apiSrc}${backgroundImages[0]}');
//           }
//         }`
