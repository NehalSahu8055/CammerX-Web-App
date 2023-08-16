const vid = document.querySelector(".vid-player"),
  canvas = document.querySelector("canvas"),
  ctx = canvas.getContext("2d"),
  fullScreenBtn = document.querySelector(".full-screen"),
  toggleTools = document.querySelectorAll(".toggle-tools button"),
  soundRange = document.querySelector(".sound-level input"),
  camOffOverlay = document.querySelector(".cam-off-overlay"),
  camToggle = document.querySelector(".cam-toggle"),
  audToggle = document.querySelector(".aud-toggle"),
  filterTrayInputs = [
    ...document.querySelectorAll(".filter-tray .normal-filters div input"),
  ],
  afterEffects = [...document.querySelectorAll(".afterEffects button")],
  blurOverlay = document.querySelector(".blur-overlay"),
  liveOverlay = document.querySelector(".live-overlay"),
  screenShotBtn = document.querySelector(".tool-tray .screenshot"),
  screenShotEmptyTray = document.querySelector(".screenshot-tray .empty-tray");

/*
--------------------------------------------- INDEX -------------------------------------------
1 -> WebCam Handle
  1.1 -> Cam On/Off
  1.2 -> Webcam Toggle
    1.2.1 -> WebCam On
    1.2.2 -> WebCam Off
    1.2.3 -> Get Video
2 -> Mic Handle
3 -> Sound Level Handle
4 -> Fullscreen Handle
5 -> Filters Handle
6 -> Video On Canvas Handle
7 -> ShortCut Key Handle
*/

// ---------------------------------- [ 1 -> WebCam Handle ] -------------------------------------

// ----------- { 1.1 -> Cam On/Off } ---------------
let isCamOn;
const camOnOff = () => {
  const videoSvg = camToggle.firstElementChild;
  (camSvg = videoSvg.nextElementSibling),
    (cList = camOffOverlay.classList),
    (isCamOn = !isCamOn);

  // aria Pressed on buttons and live overlay handle
  if (isCamOn) {
    camToggle.setAttribute("aria-pressed", true);
    liveOverlay.classList.remove("hidden");
  } else {
    camToggle.setAttribute("aria-pressed", false);
    liveOverlay.classList.add("hidden");
  }

  cList.toggle("hidden");
  camSvg.classList.toggle("hidden");
  camSvg.nextElementSibling.classList.toggle("hidden");

  getVideo(isCamOn);
};
toggleTools[0].addEventListener("click", camOnOff);

// ----------- { 1.2 -> Webcam Toggle } ---------------
// 1.2.1 -> WebCam On
const webcamOn = (src) => {
  vid.srcObject = src;
  vid.play();
};
// 1.2.2 -> WebCam Off
const webcamOff = (src) => {
  vid.srcObject = src;
  vid.pause();
};

// 1.2.3 -> Get Video
const getVideo = (isCamOn) => {
  //returns a promise
  let promise = navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  promise
    .then((localMediaStream) => {
      isCamOn ? webcamOn(localMediaStream) : webcamOff(null);
    })
    .catch((error) => {
      alert("Error : " + error);
    });
};

// ---------------------------------- [ 2 -> Mic Handle ] -------------------------------------

const micMuteUnmute = () => {
  let audioSvg = audToggle.firstElementChild.nextElementSibling;

  audioSvg.classList.toggle("hidden");
  audioSvg.nextElementSibling.classList.toggle("hidden");
  vid.muted = !vid.muted;

  // aria Pressed On buttons
  vid.muted
    ? audToggle.setAttribute("aria-pressed", true)
    : audToggle.setAttribute("aria-pressed", false);
};
toggleTools[1].addEventListener("click", micMuteUnmute);

let hasTakenScreenShot;
const strip = document.querySelector(".strip");

const getScreenshot = () => {
  // take the data out of the canvas
  const data = canvas.toDataURL("image/jpeg");
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", "CammerX_Screenshot");
  link.innerHTML = `<img src="${data}" alt="Handsome Man" class="shadow-[-1px_0px_4px_0px_#000000b3]  h-full rounded-xl bg-cover bg-center border-2 border-[#000000b3] opacity-75  transition-all duration-300 mb-2" title = "Click to download"/>
  <button class="absolute bottom-3 right-3 dwnld-img shadow-2xl hover:shadow-[0px_0px_1rem_5px_#00000020]  bg-green-500 hover:bg-green-600 text-white font-bold p-2 inline-flex rounded-full items-center">
  <img src="./images/icons/download.svg" alt="Download button svg for downloading screenshots">
  </button>`;
  strip.innerHTML = ""; //clear existing screenshots if any
  strip.appendChild(link);
  hasTakenScreenShot = strip.innerHTML == "" ? false : true;
  hasTakenScreenShot
    ? screenShotEmptyTray.classList.add("hidden")
    : screenShotEmptyTray.classList.remove("hidden");
};

toggleTools[2].addEventListener("click", getScreenshot);

// ---------------------------------- [ 3 -> Sound Level Handle ] -------------------------------------

const changeVidVolume = (e) => {
  vid.volume = soundRange.value / 10;
  const soundSvg = document.querySelector(".sound-level .ss");
  //  toggling b/w 0 level and 0-1 level
  const isMuted = vid.volume === 0;
  soundSvg.classList.toggle("hidden", isMuted);
  soundSvg.nextElementSibling.classList.toggle("hidden", !isMuted);
};
soundRange.addEventListener("change", changeVidVolume);

let clicked;
toggleTools[3].addEventListener("click", (e) => {
  soundRange.classList.toggle("hidden");
  clicked = !clicked;
  // aria Pressed On buttons
  clicked
    ? e.currentTarget.setAttribute("aria-pressed", true)
    : e.currentTarget.setAttribute("aria-pressed", false);
});

// ---------------------------------- [ 4 -> Fullscreen Handle ] -------------------------------------

const enterFullScreen = (e) => {
  if (e.requestFullscreen) {
    e.requestFullscreen();
  } else if (e.mozRequestFullScreen) {
    e.mozRequestFullScreen(); // Firefox
  } else if (e.webkitRequestFullscreen) {
    e.webkitRequestFullscreen(); // Safari
  } else if (e.msRequestFullscreen) {
    e.msRequestFullscreen(); // IE/Edge
  }
};

let isClicked;
fullScreenBtn.addEventListener("click", (e) => {
  const fullscreenSvg = e.currentTarget.firstElementChild.nextElementSibling;
  fullscreenSvg.classList.toggle("hidden");
  fullscreenSvg.nextElementSibling.classList.toggle("hidden");
  enterFullScreen(vid);

  isClicked = !isClicked;
  // aria Pressed On buttons
  isClicked
    ? e.currentTarget.setAttribute("aria-pressed", true)
    : e.currentTarget.setAttribute("aria-pressed", false);
});
document.addEventListener("fullscreenchange", (event) => {
  document.fullscreenElement
    ? console.log("Entered fullscreen:", document.fullscreenElement)
    : console.log("Exited fullscreen.");
});

// ---------------------------------- [ 5 -> Filters Handle ] -------------------------------------

const filter = (e, filter, unit) => {
  let filterString = "";
  let filterValue = e.currentTarget.value;
  filterString += `${filter}(${filterValue}${unit})` + " ";
  ctx.filter = filterString;
};

const indexFilter = [
  { blur: "px" },
  { grayscale: "%" },
  { brightness: "%" },
  { contrast: "%" },
  { saturate: "%" },
  { sepia: "%" },
  { invert: "%" },
];

let iterator = 0;

filterTrayInputs.forEach((filterTool) => {
  let filterName = Object.keys(indexFilter[iterator])[0];
  let unit = indexFilter[iterator][filterName];
  filterTool.addEventListener("input", (e) => {
    filter(e, `${filterName}`, `${unit}`);

    // Updating aria-value
    e.currentTarget.setAttribute("aria-valuenow", e.currentTarget.value);
  });
  ++iterator;
});

const hdr = (pixels) => {
  const exposure = 1.5; // Adjust the exposure value as needed
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] = Math.min(255, pixels.data[i] * exposure); // Red
    pixels.data[i + 1] = Math.min(255, pixels.data[i + 1] * exposure); // Green
    pixels.data[i + 2] = Math.min(255, pixels.data[i + 2] * exposure); // Blue
  }
  return pixels;
};
afterEffects[0].addEventListener("click", (e) => {
  isHDR = !isHDR;
  // aria Pressed On buttons
  isHDR
    ? e.currentTarget.setAttribute("aria-pressed", true)
    : e.currentTarget.setAttribute("aria-pressed", false);

  e.currentTarget.classList.toggle("border-dashed");
});

const overlayToggle = (e) => {
  e.currentTarget.firstElementChild.classList.toggle("hidden");
};

// Overlay for naming after effects
afterEffects.forEach((effect) => {
  effect.addEventListener("mouseover", overlayToggle);
  effect.addEventListener("mouseout", overlayToggle);
});

const matrixDot = (pixels) => {
  const brushSize = 5;
  const intensity = 5; //initially 20
  for (let y = 0; y < canvas.height; y += brushSize) {
    for (let x = 0; x < canvas.width; x += brushSize) {
      const pixelIdx = (y * canvas.width + x) * 4;
      for (let i = 0; i < brushSize; i++) {
        for (let j = 0; j < brushSize; j++) {
          const idx = ((y + i) * canvas.width + (x + j)) * 4;
          pixels.data[pixelIdx] = pixels.data[idx] + intensity; // Red
          pixels.data[pixelIdx + 1] = pixels.data[idx + 1] + intensity; // Green
          pixels.data[pixelIdx + 2] = pixels.data[idx + 2] + intensity; // Blue
        }
      }
    }
  }
  return pixels;
};
afterEffects[1].addEventListener("click", (e) => {
  isMatrixDot = !isMatrixDot;
  // aria Pressed On buttons
  isMatrixDot
    ? e.currentTarget.setAttribute("aria-pressed", true)
    : e.currentTarget.setAttribute("aria-pressed", false);

  e.currentTarget.classList.toggle("border-dashed");
});

const rgbSplit = (pixels) => {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  return pixels;
};
afterEffects[2].addEventListener("click", (e) => {
  isRGBSplit = !isRGBSplit;
  // aria Pressed On buttons
  isRGBSplit
    ? e.currentTarget.setAttribute("aria-pressed", true)
    : e.currentTarget.setAttribute("aria-pressed", false);

  e.currentTarget.classList.toggle("border-dashed");
});
const redEffect = (pixels) => {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
};
afterEffects[3].addEventListener("click", (e) => {
  isRedEffect = !isRedEffect;
  // aria Pressed On buttons
  isRedEffect
    ? e.currentTarget.setAttribute("aria-pressed", true)
    : e.currentTarget.setAttribute("aria-pressed", false);

  e.currentTarget.classList.toggle("border-dashed");
});

const pixelationEffect = () => {
  const pixelSize = 10;
  // pixels = custom(pixels);
  ctx.drawImage(vid, 0, 0, canvas.width / pixelSize, canvas.height / pixelSize);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    canvas,
    0,
    0,
    canvas.width / pixelSize,
    canvas.height / pixelSize,
    0,
    0,
    canvas.width,
    canvas.height
  );
};

afterEffects[4].addEventListener("click", (e) => {
  isPixelationEffect = !isPixelationEffect;
  // aria Pressed On buttons
  isPixelationEffect
    ? e.currentTarget.setAttribute("aria-pressed", true)
    : e.currentTarget.setAttribute("aria-pressed", false);

  e.currentTarget.classList.toggle("border-dashed");
});

const vintageEffect = () => {
  // Apply vintage effect using filters and color adjustments
  ctx.filter = "sepia(0.4) brightness(0.8) contrast(1.2) saturate(0.8)";
};
afterEffects[5].addEventListener("click", (e) => {
  isVintageEffect = !isVintageEffect;
  // Reset filter
  if (!isVintageEffect) ctx.filter = "none";
  // aria Pressed On buttons

  isVintageEffect
    ? e.currentTarget.setAttribute("aria-pressed", true)
    : e.currentTarget.setAttribute("aria-pressed", false);

  e.currentTarget.classList.toggle("border-dashed");
});

const mirrorEffect = (pixels) => {
  const output = ctx.createImageData(canvas.width, canvas.height);
  const data = output.data;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const srcIdx = (y * canvas.width + x) * 4;
      const destIdx = (y * canvas.width + (canvas.width - x - 1)) * 4;

      data[destIdx] = pixels.data[srcIdx];
      data[destIdx + 1] = pixels.data[srcIdx + 1];
      data[destIdx + 2] = pixels.data[srcIdx + 2];
      data[destIdx + 3] = pixels.data[srcIdx + 3];
    }
  }

  return output;
};

afterEffects[6].addEventListener("click", (e) => {
  ismirrorEffect = !ismirrorEffect;
  // aria Pressed On buttons

  ismirrorEffect
    ? e.currentTarget.setAttribute("aria-pressed", true)
    : e.currentTarget.setAttribute("aria-pressed", false);

  e.currentTarget.classList.toggle("border-dashed");
});

// ---------------------------------- [ 6 -> Video On Canvas Handle ] -------------------------------------

let isRGBSplit,
  isRedEffect,
  isHDR,
  isMatrixDot,
  isPixelationEffect,
  isVintageEffect,
  ismirrorEffect;

const vidOnCanva = () => {
  const width = vid.videoWidth,
    height = vid.videoHeight;
  canvas.width = width;
  canvas.height = height;

  ctx.filter = blur("100px");
  return setInterval(() => {
    ctx.drawImage(vid, 0, 0, width, height);
    let pixels = ctx.getImageData(0, 0, width, height);

    pixels = isRedEffect ? redEffect(pixels) : pixels;
    pixels = isRGBSplit ? rgbSplit(pixels) : pixels;
    pixels = isHDR ? hdr(pixels) : pixels;
    pixels = isMatrixDot ? matrixDot(pixels) : pixels;
    pixels = ismirrorEffect ? mirrorEffect(pixels) : pixels;

    if (isPixelationEffect) pixelationEffect();
    if (isVintageEffect) vintageEffect();

    // have to remove below line for pixelation
    if (!isPixelationEffect) ctx.putImageData(pixels, 0, 0);
  }, 16);
};

vid.addEventListener("canplay", vidOnCanva);

//  ----------- { 7 -> ShortCut Key Handle } ---------------

window.addEventListener("keydown", (e) => {
  // ctrl+m/M  -> Mic Toggle
  if (e.key === ("m" || "M") && e.ctrlKey) micMuteUnmute();

  // ctrl+q/Q  -> WebCam Toggle
  if (e.key === ("q" || "Q") && e.ctrlKey) camOnOff();

  // ctrl+alt+s/S  -> Get Screnshot
  if (e.ctrlKey && e.altKey && e.key === ("s" || "S")) getScreenshot();
});
