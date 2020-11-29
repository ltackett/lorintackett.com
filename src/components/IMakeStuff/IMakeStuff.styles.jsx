import React from "react";
import styled, { css } from "styled-components";

import { TransitionGroup } from "react-transition-group";

import backgroundCode from "./code.jpg";
import backgroundMusic from "./music.jpg";
import backgroundPhotography from "./photography.jpg";
import backgroundVideography from "./videography.jpg";
import { device } from "../../responsive";

export const Outer = styled.div`
  position: relative;
  min-height: 100vh;

  h1 {
    text-align: center;
    padding: 2em 0 1em;
    font-weight: normal;

    span {
      color: #ff9400;
    }

    font-size: 1em;
    @media ${device.min.mobileM} { font-size: 1.25em; }
    @media ${device.min.mobileL} { font-size: 1.5em; }
    @media ${device.min.tablet}  { font-size: 2em; }
  }
`;

export const Container = styled.div`
  perspective: 2000px;

  width: calc(100vw - 2em);
  margin: 0 1em;

  @media ${device.min.mobileM} { margin: 0 auto; }

  @media ${device.min.mobileM} { width: calc(${device.mobileM} - 2em); }
  @media ${device.min.mobileL} { width: calc(${device.mobileL} - 2em); }
  @media ${device.min.tablet} { width: calc(${device.tablet} - 2em); }
`;

export const StuffIMake = styled.div`
  display: grid;
  grid-gap: 1.5em;
  margin: 0 0 1.5em;

  grid-template-columns: 1fr 1fr;
  @media ${device.min.tablet} {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  `;

export const BackgroundOuter = styled(TransitionGroup)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
`;

export const BackgroundInner = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  &:after {
    content: ' ';
    displayL block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    background: linear-gradient(#000, transparent);
  }

  &:before {
    content: ' ';
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  
  &.code {
    &:before {
      opacity: 0.6;
      background: url(${backgroundCode});
      background-size: cover;
      background-position: center center;
    }
  }

  &.music {
    background: url(${backgroundMusic});
    background-size: cover;
    background-position: center center;
  }

  &.photos {
    &:before {
      opacity: 0.8;
      background: url(${backgroundPhotography});
      background-size: cover;
      background-position: bottom center;
    }
  }

  &.videos {
    background: url(${backgroundVideography});
    background-size: cover;
    background-position: bottom center;
  }

  &.enter {
    opacity: 0;
    transform: translate(0, 20%);
    transition: transform 5s ease-out, opacity 5s ease-in;
  }
  &.enter-active {
    opacity: 1;
    transform: translate(0, 0);
  }

  &.exit {
    opacity: 1;
    transform: translate(0, 0);
    transition: transform 0.5s ease-in, opacity 0.5s ease-out;
  }
  &.exit-active {
    opacity: 0;
    transform: translate(0, 20%);
  }
`;

export const Code = styled.div`
  display: grid;
  grid-gap: 1.5em;

  grid-template-columns: 1fr;
  @media ${device.min.mobileM} { grid-template-columns: 1fr 1fr; }

  max-width: calc(100vw - 2em);
  @media ${device.min.mobileM} { max-width: calc(${device.mobileM} - 2em); }
  @media ${device.min.mobileL} { max-width: calc(${device.mobileL} - 2em); }
  @media ${device.min.tablet} { max-width: calc(${device.tablet} - 2em); }

  img {
    box-sizing: border-box;
    box-shadow: rgba(0, 0, 0, 0.4) 0 0.5em 1.25em 0.25em;
    max-width: 100%;
  }
`;

export const Player = styled.div`
  background: #f5f5f5;
  box-shadow: rgba(0, 0, 0, 0.8) 0 0.5em 1.25em 0.25em;
  border-radius: 0.4em;
  height: 410px;
`;

// ============================================================================

const StyledButton = styled.a`
  position: relative;
  border: 2px solid #fff;
  border-radius: 0.4em;
  text-align: center;
  text-decoration: none;
  
  min-height: 5.5em;
  @media ${device.min.mobileM} { min-height: 7em; }
  @media ${device.min.mobileL} { min-height: 8em; }
  @media ${device.min.tablet} { min-height: 9em; }

  transition: color 0.5s ease-in-out, background 0.5s ease-in-out,
    border-color 0.5s ease-in-out;

  background-color: #000;
  color: #efefef;

  ${({ color }) => css`
    &.active {
      border-color: ${color};
      background-blend-mode: soft-light;
      background: ${color} radial-gradient(ellipse, #fff, transparent);
      color: #000;
    }
  `}

  svg {
    display: block;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    
    top: 35%;
    @media ${device.min.mobileM} { top: 40%; }

    
    font-size: 1.5;
    @media ${device.min.mobileM} { font-size: 2.5em; }
    @media ${device.min.mobileL} { font-size: 3em; }
    @media ${device.min.tablet} { font-size: 4em; }
  }

  span {
    position: absolute;
    padding: 1.5em 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
`;

export const Button = ({ selected, setSelected, section, color, children }) => {
  const handleClick = (e) => {
    e.preventDefault();
    setSelected([section]);
    window.ga("send", "event", "StuffIMakeButton", "click", section);
  };

  return (
    <StyledButton
      href={`#${section}`}
      color={color}
      className={section === selected[0] ? "active" : undefined}
      section={section}
      onClick={handleClick}
    >
      {children}
      <span>{section}</span>
    </StyledButton>
  );
};

// ============================================================================

export const StyledSection = styled.div`
  position: absolute;
  min-width: calc(100vw - 2em);
  margin: 0 0 3em;

  @media ${device.min.mobileM} { min-width: calc(${device.mobileM} - 2em); }
  @media ${device.min.mobileL} { min-width: calc(${device.mobileL} - 2em); }
  @media ${device.min.tablet} { min-width: calc(${device.tablet} - 2em); }

  &.enter {
    opacity: 0;
    transform: translate(120%, 0) rotate3d(0, 1, 0, -50deg);
  }
  &.enter-active {
    opacity: 1;
    transform: translate(0, 0) rotate3d(0, 1, 0, 0deg);
    transition: transform 0.5s ease-in-out, opacity 0.5s ease-in;
  }

  &.exit {
    opacity: 1;
    transform: translate(0, 0) rotate3d(0, 1, 0, 0deg);
  }
  &.exit-active {
    opacity: 0;
    transform: translate(-120%, 0) rotate3d(0, 1, 0, 50deg);
    transition: transform 0.5s ease-in-out, opacity 0.5s ease-out;
  }
  &.exit-complete {
    visibility: hidden;
    transform: translate(-9000px, 0);
    height: 1px;
    overflow: hidden;
  }
`;

export const Footer = styled.footer`
  font-size: 0.75em;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #111;
  color: #ccc;

  p {
    margin: 0.5em 1em;
  }
`

export const Section = ({ show, children }) => {
  const [classNames, setClassNames] = React.useState("exit-complete");

  React.useEffect(() => {
    if (show) {
      setEnter();
    } else {
      setExit();
    }
  }, [show]);

  const setEnter = () => {
    setClassNames("enter");
    setTimeout(() => {
      setClassNames("enter enter-active");
    }, 0);
    setTimeout(() => {
      setClassNames("enter-complete");
    }, 500);
  };

  const setExit = () => {
    setClassNames("exit exit-active");
    setTimeout(() => {
      setClassNames("exit-complete");
    }, 500);
  };

  return <StyledSection className={classNames}>{children}</StyledSection>;
};
