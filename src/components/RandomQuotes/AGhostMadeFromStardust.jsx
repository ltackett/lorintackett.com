import React from 'react';
import styled from 'styled-components';



const StyledQuote = styled.div`
  transform: translate(-50%, -50%);
  display: inline-block;
  text-align: right;
  position: absolute;
  top: 350px;
  left: 50%;
  z-index: 1;

  h1 {
    font-family: 'Oswald', sans-serif;
  }

  span {
    display: block;
  }
`

export const AGhostMadeFromStardust = ({ children }) => {
  return (
    <>
      <link rel="stylesheet" href="https://use.typekit.net/bez2nnv.css"></link>
      <StyledQuote>
        <h1>
          <span>You’re a ghost driving a meat-coated skeleton made from stardust.</span>
          <span>... what do you have to be scared of?</span>
        </h1>
        <p>
          <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/rat_sandwich/status/296920453442842625">@rat_sandwich</a>
        </p>
      </StyledQuote>
    </>
  )
}
