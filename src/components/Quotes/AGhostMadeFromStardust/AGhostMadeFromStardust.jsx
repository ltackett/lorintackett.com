import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'

import { Quote, DownArrow } from './Text'
import { Clouds } from './Clouds'

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
`

export const AGhostMadeFromStardust = () => {
  return (
    <>
      <link rel="stylesheet" href="https://use.typekit.net/bez2nnv.css"></link>
      <link href="https://fonts.googleapis.com/css?family=Archivo+Black&display=swap" rel="stylesheet"></link>
      <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700&display=swap" rel="stylesheet"></link>
      <GlobalStyles />
      <Layout>
        <Quote />
        <Clouds />
        <DownArrow />
      </Layout>
    </>
  )
}
