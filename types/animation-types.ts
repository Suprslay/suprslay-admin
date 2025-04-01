// Animation phases
export type AnimationPhase = "slideshow" | "row" | "collapse" | "final"

// Image position type
export interface ImagePosition {
  id: number
  x: number
  visible: boolean
}

// Utility functions
export const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// Smoother easing function for animations
export const easeOutQuint = (t: number): number => {
  return 1 - Math.pow(1 - t, 5)
}

// Even smoother easing function for sensitive animations
export const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

