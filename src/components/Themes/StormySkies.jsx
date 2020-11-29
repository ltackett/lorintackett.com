import React from 'react'
import styled, { createGlobalStyle, keyframes, css } from 'styled-components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'

import { Clouds } from '../Clouds/'
import { device } from '../../responsive';

const thumpBig = 1.25;
const thumpSmall = 1.1
const bounce = keyframes`
  from {
    transform: scale3d(1, 1, 1);
  }

  10% {
    transform: scale3d(${thumpBig}, ${thumpBig}, ${thumpBig});
  }

  20% {
    transform: scale3d(1, 1, 1);
  }

  30% {
    transform: scale3d(1, 1, 1);
  }

  40% {
    transform: scale3d(${thumpSmall}, ${thumpSmall}, ${thumpSmall});
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
  font-size: 2em;
  line-height: 1.25;
  margin: 0;
  text-shadow: 0 -1px 0  #ffffff,
               0 2px 3px #000000;
`

const Arrow = styled.span`
  ${textStyle}
  font-size: 2.5em;
  position: absolute;
  left: 50%;
  margin-left: -0.5em;
  animation: 1s ${bounce} infinite;

  bottom: 4em;
  @media ${device.min.tablet} { bottom: 1em; }
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
              radial-gradient(circle at 50% -20%, rgba(255, 249, 237, 1), 20%, transparent, 40%, transparent),
              linear-gradient(#302d27, #000);
  
  h2 {
    ${textStyle}

    font-size: 1em;
    @media ${device.min.mobileM} { font-size: 1.25em; }
    @media ${device.min.mobileL} { font-size: 1.5em; }
    @media ${device.min.tablet}  { font-size: 2em; }
    
  }

  p {
    font-size: 0.75em;
  }
`

export const StormySkies = (props) => {
  const cloudLayers = [
    { src: '/images/clouds_white_2.png', width: 1000, height: 509, velocity: 0.25, x: 100 },
    { src: '/images/clouds_black_1.png', width: 1000, height: 447, velocity: 0.50, x: 500 },
    { src: '/images/clouds_white_3.png', width: 1579, height: 341, velocity: 0.75, x: 200 }
  ]

  return (
    <>
      <link href="https://fonts.googleapis.com/css?family=Archivo+Black&display=swap" rel="stylesheet"></link>
      <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700&display=swap" rel="stylesheet"></link>
      <GlobalStyles />
      <Layout>
        {props.children}
        <Clouds layers={cloudLayers} speed={0.5} />
        <Arrow><FontAwesomeIcon icon={faArrowDown} /></Arrow>
      </Layout>
    </>
  )
}
