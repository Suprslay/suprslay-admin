export function initShimmerEffect() {
  // Add the shimmer keyframes to the document if they don't exist
  if (typeof window !== "undefined" && !document.getElementById("shimmer-keyframes")) {
    const style = document.createElement("style")
    style.id = "shimmer-keyframes"
    style.innerHTML = `
      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
    `
    document.head.appendChild(style)
  }
}

