import React from 'react'
import styled from 'styled-components'

/**
 * CloudsContainer
 * Styled component for dimensions
 */
const CloudsContainer = styled.div`
  height: 100vh;
  width: 100vw;
`

/**
 * CloudsCanvas
 * Styled component to reduce opacity of clouds
 */
const CloudsCanvas = styled.canvas`
  opacity: ${props => props.opacity ? props.opacity : 0.4};
`

// Init vars
let canvas, c

/**
 * Clouds
 * React component that,
 *   1. Renders a canvas
 *   2. Starts an animation loop
 *   3. Moves the cloud layers by sub-pixel velocity on each animation tick
 */
export const Clouds = (props) => {
  const layers = []
  
  props.layers.forEach(layer => {
    // Init and start loading images from src
    const img = new Image()
    img.src = layer.src

    // Push new img to layerImgs array for consumption in the animation loop
    layers.push({
      ...layer,
      image: img,
      velocity: layer.velocity*props.speed
    })
  })

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
  
  // Recursive function that handles animation
  const animateClouds = () => {
    // Clear the frame
    c.clearRect(0, 0, window.innerWidth, window.innerHeight)

    // Render the frame layers
    layers.forEach((layer) => {
      if (layer.opacity) { c.globalAlpha = layer.opacity }

      c.drawImage(layer.image, (layer.width*0)-layer.x, 0, layer.width, layer.height)
      c.drawImage(layer.image, (layer.width*1)-layer.x, 0, layer.width, layer.height)
      c.drawImage(layer.image, (layer.width*2)-layer.x, 0, layer.width, layer.height)
      
      if (layer.opacity) { c.globalAlpha = 1 }

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
      <CloudsCanvas ref={cloudsRef} opacity={props.opacity} />
    </CloudsContainer>
  )
}
