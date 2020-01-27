import React from 'react'
import styled from 'styled-components'

/**
 * CloudsContainer
 * Styled component for dimensions and multi-gradient background
 */
const CloudsContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background: linear-gradient(transparent, 70%, #000),
              radial-gradient(at 50% 0%, transparent, 70%, #000),
              radial-gradient(circle at 50% -20%, rgba(255, 255, 255, 0.6), 20%, transparent, 70%, transparent),
              linear-gradient(#302d27, #000);
`

/**
 * CloudsCanvas
 * Styled component to reduce opacity of clouds
 */
const CloudsCanvas = styled.canvas`
  opacity: 0.4;
`

// Init vars
let canvas, c

// Init images
const img1 = new Image()
const img2 = new Image()
const img3 = new Image()

// Load images
img1.src = "/images/clouds_white_2.png"
img2.src = "/images/clouds_black_1.png"
img3.src = "/images/clouds_white_3.png"

/**
 * Clouds
 * React component that,
 *   1. Renders a canvas
 *   2. Starts an animation loop
 *   3. Moves the cloud layers by sub-pixel velocity on each animation tick
 */
export const Clouds = () => {
  // Create a ref for the clouds
  const cloudsRef = React.useRef(null)
  
  // When the ref is picked up by the render loop,
  //   1. set the canvas dimensions
  //   2. kick off the animation
  React.useEffect(() => {
    if (cloudsRef.current) {
      canvas = cloudsRef.current
      c = canvas.getContext('2d')

      resizeClouds()
      animateClouds()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloudsRef])

  // Function to resize the canvas
  const resizeClouds = () => {
    if (cloudsRef.current) {
      cloudsRef.current.width = window.innerWidth
      cloudsRef.current.height = window.innerHeight
    }
  }

  // Bind event listener on mount for for window resize, and cleanup when unmounted
  React.useEffect(() => {
    window.addEventListener('resize', resizeClouds)
    return () => window.removeEventListener('resize', resizeClouds)
  }, [])

  // Array of layers data
  const layers = [
    { image: img1, width: 1000, height: 509, velocity: 0.25, x: 100 },
    { image: img2, width: 1000, height: 447, velocity: 0.50, x: 500 },
    { image: img3, width: 1579, height: 341, velocity: 1.00, x: 200 }
  ]
  
  // Recursive function that handles animation
  const animateClouds = () => {
    // Clear the frame
    c.clearRect(0, 0, window.innerWidth, window.innerHeight)

    // Render the frame layers
    layers.forEach((layer) => {
      c.drawImage(layer.image, (layer.width*0)-layer.x, 0, layer.width, layer.height)
      c.drawImage(layer.image, (layer.width*1)-layer.x, 0, layer.width, layer.height)
      c.drawImage(layer.image, (layer.width*2)-layer.x, 0, layer.width, layer.height)

      // Recalculate position for next frame, or reset if out of bounds
      if (layer.x + layer.velocity > layer.width) {
        layer.x = 0
      } else {
        layer.x = layer.x + layer.velocity
      }
    })

    // Call animation function for next frame
    requestAnimationFrame(animateClouds)
  }

  return (
    <CloudsContainer>
      <CloudsCanvas ref={cloudsRef} />
    </CloudsContainer>
  )
}
