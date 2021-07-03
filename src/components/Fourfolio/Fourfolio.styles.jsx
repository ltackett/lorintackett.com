import styled from 'styled-components';

export const FourfolioContainer = styled.div`
  width: 700px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 2em;

  a {
    position: relative;
    color: #666;
    display: block;
    border: 2px solid #333;
    text-align: center;
    padding: 2.5em 0;
    border-radius: 0.5em;
    transition: all 0.3s ease;

    span {
      position: absolute;
      left: 0;
      right: 0;
      bottom: -2.5em;
      opacity: 0;
      transition: all 0.3s ease;
    }

    &:hover {
      color: #efefef;
      border-color: #efefef;

      span {
        bottom: -2em;
        opacity: 1;
      }
    }

    svg {
      font-size: 3em;
    }
  }
`
