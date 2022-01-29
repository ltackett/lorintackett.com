import styled, { keyframes } from 'styled-components';


const pulse = keyframes`
  from {
    opacity: 0.5;
  }

  to {
    opacity: 1;
  }
`
export const Loading = styled.p`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ${pulse} 0.3s ease-in-out alternate infinite;
`