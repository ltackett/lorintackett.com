import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const PhotoGridBaseStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
  gap: 1rem;
  padding: 0 2.5rem 1rem;
`

export const StyledLink = styled(Link)`
    background-size: cover;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    padding: 1rem;

    // Make square
    &::before {
      content: "";
      padding-bottom: 100%;
      display: block;
    }
`