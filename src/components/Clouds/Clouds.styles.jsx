import styled, { css } from 'styled-components'

/**
 * CloudsContainer
 * Styled component for dimensions
 */
export const CloudsContainer = styled.div`
  width: 100vw;
  height: 700px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(transparent 700px, #111 1000px),
              radial-gradient(circle at 50% -300px, transparent 300px, #111 1500px),
              radial-gradient(circle at 50% -300px, rgba(255, 255, 255, 0.6), 400px, transparent, 1800px, transparent),
              linear-gradient(#302d27 500px, #111 1000px);

  ${props => props.isPortraitMode && css`
    background: linear-gradient(transparent 700px, #111 1000px),
                radial-gradient(circle at 0 -300px, transparent 200px, #111 1500px),
                radial-gradient(circle at 0% -300px, rgba(255, 255, 255, 0.6), 400px, transparent, 1800px, transparent),
                linear-gradient(#302d27 500px, #111 1000px);
  `}
`

/**
 * CloudsCanvas
 * Styled component to reduce opacity of clouds
 */
export const CloudsCanvas = styled.canvas`
  opacity: ${props => props.opacity ? props.opacity : 0.4};
  position: absolute;
`

/**
 * Trees
 */
export const Trees = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  height: 700px;
  width: 3000px;
  background: url(/images/trees.png) no-repeat -200px -200px, linear-gradient(transparent 900px, #000 901px);
  transform: translate(-50%, 0);

  &:before, &:after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    width: 3000px;
    height: 100%;
    background: black;
  }

  &:before {
    left: -100%;
  }

  &:after {
    right: -100%;
  }

  ${props => props.isPortraitMode && css`
    left: auto;
    right: -500px;
    transform: none;
    background-position: 0 100px, 0 0;
    background-size: 85%;

    &:before, &:after {
      width: auto;
      left: auto;
      right: auto;
      background: red;
    }
  `}
`