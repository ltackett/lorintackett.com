import styled from 'styled-components';
import { device } from "responsive";

export const Header = styled.header`
  background-color: #efefef;
  padding: 2.5em;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  display: grid;
  grid-template-columns: 100%;
  gap: 1em;
  
  @media ${device.min.tablet} {
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }

  &:before, &:after {
    content: '';
    display: block;
    background-color: #efefef;
    position: absolute;
    top: 0;
    bottom: 0;
  }

  &:before {
    right: 100%;
    width: 100vw;
  }

  &:after {
    left: 100%;
    width: 100vw;
  }

  & > h1,
  & > div {
    place-self: center;

    @media ${device.min.tablet} {
      place-self: initial;
    }
  }

  h1 {
    margin: 0;
  }

  img {
    height: 51px;
  }
`

export const Footer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem;
  color: #666;
  text-align: center;
  text-shadow: rgba(0, 0, 0, 0.8) 0 1px 2px;
`
