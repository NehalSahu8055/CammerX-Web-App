/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*"],
  theme: {
    extend: {
      backgroundImage:{
        'hdr':"url('../../images/icons/hdr-effect.bmp')",
        'matrix-dot':"url('../../images/icons/matrix-dot-effect.jpg')",
        'rgb-split':"url('../../images/icons/rgbsplit.jpg')",
        'red-effect':"url('../../images/icons/red-effect.jpg')",
        'pixelation':"url('../../images/icons/pixelation-effect.bmp')",
        'vintage':"url('../../images/icons/vintage-effect.jpg')",
        'mirror':"url('../../images/icons/mirror-effect.jpg')",
      }
    },
  },
  plugins: [],
}

