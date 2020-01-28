import React from 'react'
import styled, { createGlobalStyle, keyframes, css } from 'styled-components'

import { Clouds } from '../Clouds/'

const bounce = keyframes`
  from {
    transform: scale3d(1, 1, 1);
  }

  10% {
    transform: scale3d(1.1, 1.1, 1.1);
  }

  20% {
    transform: scale3d(1, 1, 1);
  }

  30% {
    transform: scale3d(1, 1, 1);
  }

  40% {
    transform: scale3d(1.06, 1.06, 1.06);
  }

  55% {
    transform: scale3d(1, 1, 1);
  }
`

const textStyle = css`
  color: #cccccc;
  text-decoration: none;
  white-space: nowrap;
  font-weight: normal;
  font-size: 1.5em;
  line-height: 1.5em;
  margin: 0;
  text-shadow: 0 -1px 0  #ffffff,
               0 2px 3px #000000;
`

const Arrow = styled.span`
  ${textStyle}
  font-size: 2.5em;
  position: absolute;
  bottom: 1em;
  left: 50%;
  margin-left: -0.5em;
  animation: 1s ${bounce} infinite;
`

const GlobalStyles = createGlobalStyle`
  body {
    background: #000;
    font-family: 'Roboto', sans-serif;

    &, a {
      color: #ccc;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Archivo Black', sans-serif;
    }
  }
`

const Layout = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(transparent, 70%, #000),
              radial-gradient(at 50% 0%, transparent, 70%, #000),
              radial-gradient(circle at 50% -20%, rgba(255, 255, 255, 0.6), 20%, transparent, 70%, transparent),
              linear-gradient(#302d27, #000);

  h1 {
    ${textStyle}
  }

  p {
    font-size: 0.75em;
  }

  span { display: block; }
`

export const StormySkies = (props) => {
  const cloudLayers = [
    { src: '/images/clouds_white_2.png', width: 1000, height: 509, velocity: 0.25, x: 100 },
    { src: '/images/clouds_black_1.png', width: 1000, height: 447, velocity: 0.50, x: 500 },
    { src: '/images/clouds_white_3.png', width: 1579, height: 341, velocity: 1.00, x: 200 }
  ]

  return (
    <>
      <link href="https://fonts.googleapis.com/css?family=Archivo+Black&display=swap" rel="stylesheet"></link>
      <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700&display=swap" rel="stylesheet"></link>
      <GlobalStyles />
      <Layout>
        {props.children}
        <Clouds layers={cloudLayers} speed={1} />
        <Arrow>&#129123;</Arrow>
      </Layout>
    </>
  )
}
