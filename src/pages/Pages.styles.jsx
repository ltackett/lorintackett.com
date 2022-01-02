import styled, { createGlobalStyle, keyframes } from 'styled-components';

const fadeinBackground = keyframes`
  from {
    background-position: 50% calc(50% + 50px);
    opacity: 0;
  }

  to {
    background-position: 50% 50%;
    opacity: 0.15;
  }
`

export const FullscreenBackground = createGlobalStyle`
  body:before {
    content: '';
    display: block;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: url('${props => props.image}');
    background-size: cover;
    background-position: 50% 50%;
    opacity: 0.15;
    z-index: -1;
    animation: ${fadeinBackground} 3s ease-in-out;
  }
`

export const PageContainer = styled.div`
  padding: 0 0 3rem;

  h2 {
    margin: 10rem 2.5rem 2.5rem;
  }

  p {
    margin: 0 2.5rem 2.5rem;
  }

  main {
    max-width: 900px;
    margin: 0 auto;
  }
`