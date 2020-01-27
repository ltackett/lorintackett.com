import React from 'react';
import styled, { css, keyframes } from 'styled-components';

const textStyle = css`
  color: #cccccc;
  text-decoration: none;
  white-space: nowrap;
  font-family: 'Oswald', sans-serif;
  font-weight: normal;
  font-size: 1.5em;
  line-height: 1.5em;
  margin: 0;
  text-shadow: 0 -1px 0  #ffffff,
               0 2px 3px #000000;
`

const StyledQuote = styled.div`
  transform: translate(-50%, -50%);
  display: inline-block;
  text-align: right;
  position: absolute;
  top: 350px;
  left: 50%;
  z-index: 1;

  h1 {
    ${textStyle}
  }

  p {
    font-size: 0.75em;
  }

  span { display: block; }
`

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

const Arrow = styled.span`
  ${textStyle}
  font-size: 2.5em;
  /* transform: translate(-50%, 0); */
  position: absolute;
  bottom: 1em;
  left: 50%;
  animation: 1s ${bounce} infinite
`

export const Quote = ({ children }) => {
  return (
    <StyledQuote>
      <h1>
        <span>You’re a ghost driving a meat-coated skeleton made from stardust.</span>
        <span>... what do you have to be scared of?</span>
      </h1>
      <p>
        <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/rat_sandwich/status/296920453442842625">@rat_sandwich</a>
      </p>
    </StyledQuote>
  )
}

export const DownArrow = () => {
  return <Arrow>&#129123;</Arrow>
}
