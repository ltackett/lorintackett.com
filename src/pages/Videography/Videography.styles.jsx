import styled from 'styled-components';
import { device } from "responsive";

export const Feed = styled.div`
  display: grid;
  grid-gap: 1rem;
  margin: 0 0 3em;
  padding: 0 2.5rem;

  grid-template-columns: 1fr;
  @media ${device.min.mobileM} { grid-template-columns: 1fr 1fr; }
  @media ${device.min.tablet} { grid-template-columns: 1fr 1fr 1fr; }

  a.video {
    display: block;
  }

  img {
    display: block;
    max-width: 100%;
    padding: 0 0 1em;
  }
`;