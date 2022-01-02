import styled from "styled-components";
import { device } from "responsive";

export const Projects = styled.div`
  display: grid;
  gap: 1.5em;
  padding: 0 2.5rem;

  grid-template-columns: 1fr;
  @media ${device.min.mobileM} { grid-template-columns: 1fr 1fr; }
  
  max-width: calc(100vw - 2em);
  @media ${device.min.tablet} { max-width: 900px; }
  
  img {
    box-sizing: border-box;
    box-shadow: rgba(0, 0, 0, 0.4) 0 0.5em 1.25em 0.25em;
    max-width: 100%;
  }
`;