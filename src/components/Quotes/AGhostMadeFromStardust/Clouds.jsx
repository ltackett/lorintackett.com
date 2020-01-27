import React from 'react'
import styled from 'styled-components'

const Backdrop = styled.div`
  height: 100vh;
  width: 100vw;
  background: linear-gradient(transparent, 70%, #000),
              radial-gradient(at 50% 0%, transparent, 70%, #000),
              radial-gradient(circle at 50% -20%, rgba(255, 255, 255, 0.6), 20%, transparent, 70%, transparent),
              linear-gradient(#302d27, #000);
`

const CloudsContainer = styled.div`
  pointer-events: none;
  position: absolute;
  overflow: hidden;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: 0.4;

  img {
    visibility: hidden;
    position: absolute;
  }
`

const CloudsCanvas = styled.canvas`
  background-color: transparent;
`

let canvas, c

const img1 = new Image()
const img2 = new Image()
const img3 = new Image()

img1.src = "/images/clouds_white_2.png"
img2.src = "/images/clouds_black_1.png"
img3.src = "/images/clouds_white_3.png"

export const Clouds = (props) => {
  const cloudsRef = React.useRef(null)
  
  React.useEffect(() => {
    if (cloudsRef.current) {
      canvas = cloudsRef.current
      c = canvas.getContext('2d')

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      
      animateClouds()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloudsRef])

  const resizeClouds = () => {
    if (cloudsRef.current) {
      cloudsRef.current.width = window.innerWidth
      cloudsRef.current.height = window.innerHeight
    }
  }

  React.useEffect(() => {
    window.addEventListener('resize', resizeClouds)
    return () => window.removeEventListener('resize', resizeClouds)
  }, [])

  const layers = [
    { image: img1, width: 1000, height: 509, velocity: 0.25, x: 100 },
    { image: img2, width: 1000, height: 447, velocity: 0.50, x: 500 },
    { image: img3, width: 1579, height: 341, velocity: 1.00, x: 200 }
  ]
  
  const animateClouds = () => {
    c.clearRect(0, 0, window.innerWidth, window.innerHeight)

    layers.forEach((layer) => {
      c.drawImage(layer.image, (layer.width*0)-layer.x, 0, layer.width, layer.height)
      c.drawImage(layer.image, (layer.width*1)-layer.x, 0, layer.width, layer.height)
      c.drawImage(layer.image, (layer.width*2)-layer.x, 0, layer.width, layer.height)

      if (layer.x + layer.velocity > layer.width) {
        layer.x = 0
      } else {
        layer.x = layer.x + layer.velocity
      }
    })

    requestAnimationFrame(animateClouds)
  }

  return (
    <>
      <Backdrop />
      <CloudsContainer>
        <CloudsCanvas ref={cloudsRef} />
      </CloudsContainer>
    </>
  )
}
