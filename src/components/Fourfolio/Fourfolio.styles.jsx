import styled, { css } from 'styled-components';
import { device } from "responsive";


export const FourfolioContainer = styled.nav`
  width: 700px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 2em;
  
  ${props => !props.mini && css`
    grid-template-columns: 1fr 1fr;
    width: 100%;
    padding: 0 1em;

    @media ${device.min.tablet} {
      grid-template-columns: 1fr 1fr 1fr 1fr;
      width: 700px;
      padding: 0;
    }
  `}

  ${props => props.align && props.align === 'left' && css`
    margin-left: 0;
  `}

  ${props => props.align && props.align === 'right' && css`
    margin-right: 0;
  `}

  ${props => props.inline && css`
    margin: 0;
  `}

  ${props => props.mini && css`
    width: 300px;
    grid-gap: 1em;
  `}

  ${props => props.animated && css`
    &.fadeIn-start {
      opacity: 0;
    }

    &.fadeIn-end {
      opacity: 1;
      transition: opacity 10s ease;
    }
  `}

  a {
    position: relative;
    color: ${props => props.textColor ? props.textColor : '#666'};
    display: block;
    text-align: center;
    padding: 2.5em 0;
    border: 2px solid ${props => props.borderColor ? props.borderColor : '#333'};
    border-radius: 0.5em;
    transition: color 0.3s ease,
                border-color 0.3s ease;

    ${props => props.mini && css`
      padding: 1em 0;
      border-radius: 0.25em;
    `}

    span {
      position: absolute;
      left: 50%;
      bottom: -2.5em;
      opacity: 0;
      transform: translate(-50%,0);
      transition: bottom 0.3s ease,
                  opacity 0.3s ease;
    }

    &:hover {
      color: ${props => props.hoverColor ? props.hoverColor : '#efefef'};
      border-color: ${props => props.hoverColor ? props.hoverColor : '#efefef'};

      span {
        bottom: -2em;
        opacity: 1;
      }
    }

    i {
      font-size: 3em;
      line-height: 1;
      margin: 0;
      
      ${props => props.mini && css`
        font-size: 1.5em;
      `}
    }
  }
`
