import styled, { keyframes } from 'styled-components';
import { device } from "responsive";

const layer1 = keyframes`
  from {
    width: 0%;
    height: 100%;
  }

  to {
    width: 100%;
    height: 100%;
  }
`

const layer2 = keyframes`
  0% {
    width: 0%;
    height: 100%;
  }

  40% {
    width: 0%;
    height: 100%;
  }

  41% {
    width: 100%;
    height: 100%;
  }

  100% {
    width: 100%;
    height: 100%;
  }
`

const layer3 = keyframes`
  0% {
    width: 100%;
    height: 0%;
  }

  70% {
    width: 100%;
    height: 0%;
  }

  75% {
    width: 100%;
    height: 100%;
  }

  100% {
    width: 100%;
    height: 100%;
  }
`

const layer4 = keyframes`
  0% {
    width: 0%;
    height: 100%;
  }

  75% {
    width: 0%;
    height: 100%;
  }

  80% {
    width: 100%;
    height: 100%;
  }

  100% {
    width: 100%;
    height: 100%;
  }
`

const layer5 = keyframes`
  0% {
    width: 0%;
    height: 100%;
  }

  84% {
    width: 0%;
    height: 100%;
  }

  89% {
    width: 100%;
    height: 100%;
  }

  100% {
    width: 100%;
    height: 100%;
  }
`

const layer6 = keyframes`
  0% {
    width: 100%;
    height: 0%;
  }

  94% {
    width: 100%;
    height: 0%;
  }

  100% {
    width: 100%;
    height: 100%;
  }
`

export const SignatureContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100vw;
  height: 700px;
`

export const Logo = styled.span`
  display: block;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  
  top: 70px;
  width: 300px;
  height: 210px;

  @media ${device.min.tablet} {
    top: 100px;
    width: 500px;
    height: 341px;
  }

  span {
    display: block;
    position: absolute;
    background-repeat: no-repeat;
    
    background-size: 300px;
    
    @media ${device.min.tablet} {
      background-size: 500px;
    }
  }

  &.run-animation {
    span.layer-1 { background-image: url('/images/logo/layer1.png'); animation: ${layer1} 2s linear; }
    span.layer-2 { background-image: url('/images/logo/layer2.png'); animation: ${layer2} 2s linear; }
    span.layer-3 { background-image: url('/images/logo/layer3.png'); animation: ${layer3} 3s linear; }
    span.layer-4 { background-image: url('/images/logo/layer4.png'); animation: ${layer4} 3s linear; }
    span.layer-5 { background-image: url('/images/logo/layer5.png'); animation: ${layer5} 3s linear; }
    span.layer-6 { background-image: url('/images/logo/layer6.png'); animation: ${layer6} 3s linear; }
  }
  

  span.done {
    width: 100%;
    height: 100%;
  }

`