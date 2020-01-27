import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  max-width: 800px;
  margin: 20em auto 10em;
  padding: 0 1em;
`

export const Intro = () => {
  return (
    <Container>
      <h1>Hi. I'm Lorin.</h1>
      <p>I make cool stuff on the interwebs, I take pretty pictures at night, and I make music that nobody listens to.</p>
    </Container>
  )
}
