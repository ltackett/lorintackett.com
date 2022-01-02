import styled from 'styled-components';

export const FullScreenPhoto = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  text-align: center;

  & > div > div {
    bottom: 0;
    right: 0;
  }

  button#back-to-photogrid {
    position: absolute;
    z-index: 1000;
    top: 0;
    left: 0;
    margin: 1em;
  }
`

export const TriptychPhoto = styled.img`
  width: 100%;
  padding: 0 2.5rem 1rem;
`