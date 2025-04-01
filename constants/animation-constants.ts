// Animation timing constants
export const IMAGE_WIDTH = 220 // Width of image + gap
export const IMAGE_APPEARANCE_DELAY = 80 // ms - reduced from 100
export const SHIFT_DELAY = 40 // ms - reduced from 50
export const MAX_RIGHT_IMAGES = 3 // Max images on right before shifting
export const COLLAPSE_DURATION = 800 // ms - reduced from 2000 to make collapse much faster
export const FINAL_FRAME_DURATION = 1000 // ms
export const SLIDESHOW_INTERVAL = 250 // ms - increased slightly for smoother transitions
export const VIDEO_DELAY = 1500 // ms - reduced from 2000
export const RECTANGLE_REVEAL_DURATION = 1500 // ms - increased from 1200 for smoother animation

// Update the video and audio URLs with the provided Blob URLs
export const FINAL_VIDEO_URL_DESKTOP =
  "https://imaxj0liizc2l98g.public.blob.vercel-storage.com/public/Extended_Video_desktop.mp4"
export const FINAL_VIDEO_URL_MOBILE =
  "https://imaxj0liizc2l98g.public.blob.vercel-storage.com/public/Extended_Video_mobile.mp4"

// Background music URL
export const BACKGROUND_MUSIC_URL = "https://imaxj0liizc2l98g.public.blob.vercel-storage.com/public/slay-1.mp3"

// Background image URLs - Already using Vercel Blob
export const BACKGROUND_IMAGE_URL_DESKTOP =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/first_frame_desktop-72GzMW5gIQedR1Rf5zCbD2LLfu8bxQ.png"
export const BACKGROUND_IMAGE_URL_MOBILE =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/first_frame_mobile-m11nvDktIemSioWTlKf92OioMU4zf3.png"

// Array of all image URLs - Already using Vercel Blob
export const IMAGE_URLS = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/I2%283%29-LVlY5RrJSRJgZUa8gsfebElXUfQ18h.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/result_1742983907_0-dTpGxAK8zLnWIkTj9rgAOj73hjiKmG.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/result_1742984222_1-aAQo8IgjIHZgTtjfTGEnLp0kk2dmMY.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/result_1742983366_0-dk9PrvsoYCQvy7zoRsIO3tJXLnVmzG.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/result_1742981546_1-vlqdUXJL9G0jmAAnVIAG1lc5341Nsv.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/result_1742983143_0-umbmCLbDxSEW2BMDH727lrOuQ6LwG2.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/result_1742982173_0-yb0ELnpVi5ummO5zcMTxUnCUTp0ABp.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/e221-56JdnqIv6dItvnoXckDfOdtvGn2X08.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/result_1742983511_0-Hbb0UCaYKOD7NyPbD2ycd6PutLD0pe.png",
]

// The final image is the last one in the array
export const FINAL_IMAGE_INDEX = IMAGE_URLS.length - 1

// The middle image is the final center image
export const FINAL_CENTER_IMAGE_INDEX = Math.floor(IMAGE_URLS.length / 2)

