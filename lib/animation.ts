// Blob class for fluid animations
export class Blob {
  x: number
  y: number
  targetX: number
  targetY: number
  vx: number
  vy: number
  radius: number
  color: { r: number; g: number; b: number }
  points: { x: number; y: number; angle: number; speed: number; curve: number }[]
  angleStep: number
  maxPointSpeed: number

  constructor(x: number, y: number, radius: number, color: { r: number; g: number; b: number }) {
    this.x = x
    this.y = y
    this.targetX = x
    this.targetY = y
    this.vx = 0
    this.vy = 0
    this.radius = radius
    this.color = color
    this.points = []
    this.angleStep = (Math.PI * 2) / (10 + Math.floor(Math.random() * 5))
    this.maxPointSpeed = 0.0005 + Math.random() * 0.001 // Reduced for slower movement

    // Create points around the blob
    for (let angle = 0; angle < Math.PI * 2; angle += this.angleStep) {
      const pointRadius = radius * (0.9 + Math.random() * 0.2) // Reduced variation from 0.3 to 0.2
      this.points.push({
        x: x + Math.cos(angle) * pointRadius,
        y: y + Math.sin(angle) * pointRadius,
        angle,
        speed: 0.0001 + Math.random() * this.maxPointSpeed, // Reduced for slower movement
        curve: 0.5 + Math.random() * 0.2, // Reduced variation from 0.3 to 0.2
      })
    }
  }

  update(dt: number) {
    // Natural movement - extremely subtle random drift
    if (Math.random() < 0.001) {
      // Reduced from 0.002 for less frequent changes
      this.targetX += (Math.random() - 0.5) * 0.05 // Reduced from 0.1
      this.targetY += (Math.random() - 0.5) * 0.05
    }

    // More responsive movement toward target with less inertia
    const dx = this.targetX - this.x
    const dy = this.targetY - this.y

    // Accelerate very gradually - much slower
    this.vx += dx * 0.00005 * dt // Reduced from 0.0001
    this.vy += dy * 0.00005 * dt

    // Heavy damping for minimal movement
    this.vx *= 0.95 // Changed from 0.9 to 0.95 for slower decay
    this.vy *= 0.95

    // Apply velocity - much slower
    this.x += this.vx * dt * 0.15 // Reduced from 0.3
    this.y += this.vy * dt * 0.15

    // Bounce off edges with some padding
    const padding = this.radius * 1.5
    if (this.x < padding || this.x > window.innerWidth - padding) {
      this.vx *= -0.3 // Gentler bounce from 0.5 to 0.3
      this.x = Math.max(padding, Math.min(window.innerWidth - padding, this.x))
    }
    if (this.y < padding || this.y > window.innerHeight - padding) {
      this.vy *= -0.3 // Gentler bounce
      this.y = Math.max(padding, Math.min(window.innerHeight - padding, this.y))
    }

    // Update points with more responsive transitions - much slower
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i]

      // Calculate the ideal position based on angle and radius
      const idealX = this.x + Math.cos(point.angle) * this.radius
      const idealY = this.y + Math.sin(point.angle) * this.radius

      // Add some noise to the point position with very slow time-based variation
      const time = Date.now() * 0.00005 // Reduced from 0.0001 for slower variation
      const noise = Math.sin(time * point.speed + point.angle * 2) * this.radius * 0.05 // Reduced from 0.1 to 0.05

      // Move the point towards the ideal position with some noise - much slower
      point.x += (idealX + Math.cos(point.angle * 1.5 + time) * noise - point.x) * 0.005 * dt // Reduced from 0.01
      point.y += (idealY + Math.sin(point.angle * 1.5 + time) * noise - point.y) * 0.005 * dt

      // Rotate the angle slightly for subtle organic movement - much slower
      point.angle += point.speed * 0.005 * dt // Reduced from 0.01
    }
  }

  draw(ctx: CanvasRenderingContext2D, alpha: number) {
    if (this.points.length < 3) return

    ctx.beginPath()

    // Start from the first point
    const firstPoint = this.points[0]
    ctx.moveTo(firstPoint.x, firstPoint.y)

    // Draw curves between points
    for (let i = 0; i < this.points.length; i++) {
      const currentPoint = this.points[i]
      const nextPoint = this.points[(i + 1) % this.points.length]

      // Calculate control points for the curve
      const cp1x = currentPoint.x + (nextPoint.x - currentPoint.x) * currentPoint.curve
      const cp1y = currentPoint.y + (nextPoint.y - currentPoint.y) * currentPoint.curve
      const cp2x = nextPoint.x - (nextPoint.x - currentPoint.x) * nextPoint.curve
      const cp2y = nextPoint.y - (nextPoint.y - currentPoint.y) * nextPoint.curve

      // Draw a bezier curve to the next point
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, nextPoint.x, nextPoint.y)
    }

    ctx.closePath()

    // Enhanced gradient for more vibrant appearance
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 1.8) // Increased from 1.5 to 1.8

    // More vibrant center with higher alpha
    gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha * 0.9})`) // Increased from 0.8 to 0.9

    // Add a middle stop with medium opacity
    gradient.addColorStop(0.4, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha * 0.4})`) // Added middle stop

    // Fade to transparent at the edges
    gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`)

    ctx.fillStyle = gradient
    ctx.fill()
  }

  // Enhanced mouse influence with velocity-based movement
  applyMouseInfluence(
    mouseX: number,
    mouseY: number,
    mouseVelX: number,
    mouseVelY: number,
    isMoving: boolean,
    maxDistance = 500,
  ) {
    // Calculate distance to mouse
    const dx = mouseX - this.x
    const dy = mouseY - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < maxDistance) {
      // Calculate influence strength with smoother falloff curve
      const falloff = Math.pow(1 - Math.min(distance / maxDistance, 1), 4) // Changed from power of 3 to 4 for smoother falloff

      if (isMoving) {
        // When mouse is moving, create a more fluid "push" effect
        // Scale the effect based on mouse velocity and distance - reduced for slower movement
        const pushStrength = 0.01 * falloff // Reduced from 0.02

        // Add velocity in the direction of mouse movement with smoother transition - reduced for slower movement
        this.vx += mouseVelX * pushStrength * 0.15 // Reduced from 0.3
        this.vy += mouseVelY * pushStrength * 0.15

        // Create a more subtle swirling effect around the mouse path
        const perpX = -mouseVelY
        const perpY = mouseVelX
        const perpLength = Math.sqrt(perpX * perpX + perpY * perpY)

        if (perpLength > 0) {
          const normPerpX = perpX / perpLength
          const normPerpY = perpY / perpLength

          // Add a smoother perpendicular force (creates swirl) - reduced for slower movement
          this.vx += normPerpX * pushStrength * 0.07 // Reduced from 0.15
          this.vy += normPerpY * pushStrength * 0.07
        }

        // Add a more fluid influence on the blob's shape when mouse is moving
        for (let i = 0; i < this.points.length; i++) {
          const point = this.points[i]
          const pointDx = mouseX - point.x
          const pointDy = mouseY - point.y
          const pointDistance = Math.sqrt(pointDx * pointDx + pointDy * pointDy)

          if (pointDistance < this.radius * 3) {
            // Increased from 2.5 to 3 for wider effect
            const pointFalloff = Math.pow(1 - Math.min(pointDistance / (this.radius * 3), 1), 4) // Smoother falloff
            point.x += mouseVelX * pointFalloff * 0.025 // Reduced from 0.05
            point.y += mouseVelY * pointFalloff * 0.025
          }
        }
      } else {
        // When mouse is stationary, create a smoother gentle attraction - reduced for slower movement
        const attractionStrength = 0.0001 * falloff // Reduced from 0.0002
        this.targetX += dx * attractionStrength
        this.targetY += dy * attractionStrength
      }
    }
  }
}

// Color palettes
export const yellowColors = [
  { r: 255, g: 236, b: 66 }, // Bright yellow
  { r: 255, g: 215, b: 0 }, // Gold
  { r: 255, g: 191, b: 0 }, // Amber
  { r: 255, g: 173, b: 51 }, // Deep yellow
  { r: 250, g: 250, b: 210 }, // Light yellow
]

export const purpleColors = [
  { r: 147, g: 51, b: 234 }, // Purple-600
  { r: 168, g: 85, b: 247 }, // Purple-500
  { r: 192, g: 132, b: 252 }, // Purple-400
  { r: 216, g: 180, b: 254 }, // Purple-300
  { r: 233, g: 213, b: 255 }, // Purple-200
]

export const cmykColors = [
  { r: 255, g: 0, b: 255 }, // Magenta
  { r: 255, g: 255, b: 0 }, // Yellow
  { r: 0, g: 255, b: 255 }, // Cyan
  { r: 255, g: 0, b: 0 }, // Red
  { r: 0, g: 255, b: 0 }, // Green
  { r: 0, g: 0, b: 255 }, // Blue
]

