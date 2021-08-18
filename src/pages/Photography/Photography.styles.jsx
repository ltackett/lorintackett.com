import styled, { createGlobalStyle } from 'styled-components';

export const PhotographySharedStyles = createGlobalStyle`
  body {
    background: #111;
    color: #efefef;
  }
`

export const PhotographyPageContainer = styled.div`
`

export const Header = styled.header`
  background-color: #efefef;
  padding: 2.5em;
  display: grid;
  grid-template-columns: 1fr 1fr;

  img {
    height: 51px;
  }
`

export const Columns = styled.div`
  width: 960px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-gap: 2em 5.5em;
  padding: 3em 0;
`

export const LeftColumn = styled.nav`
  img { width: 100%; }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  ul.galleries li {
    text-align: center;
    margin-bottom: 2em;
    background-color: #efefef;

    a {
      color: #333;
      display: block;
      padding: 2em 0;

      position: relative;
      z-index: 1;
      transition: color 0.1s ease,
                  text-shadow 0.1s ease,
                  padding 0.5s ease;

      &:before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: -1;
        transition: all 0.5s ease;
        background: 50% calc(50% + 20px);
        background-size: 250px;
        opacity: 0;
      }

      &:hover {
        padding: 5em 0;
        color: #fff;
        text-shadow: 0px 1px 3px #000;

        &:before {
          background-position: 50% 50%;
          opacity: 1;
        }
      }

      &.nightscapes:before {
        background-image: url(/images/gallery_thumbnails/nightscapes.jpg);
      }

      &.trees:before {
        background-image: url(/images/gallery_thumbnails/trees.jpg);
      }

      &.people:before {
        background-image: url(/images/gallery_thumbnails/people.jpg);
      }

      &.places:before {
        background-image: url(/images/gallery_thumbnails/places.jpg);
      }
    }
  }
`

export const RightColumn = styled.main`
  img {
    border: 1em solid #efefef;
    box-shadow: 0 0.175em 0.5em rgba(0, 0, 0, 0.175);
  }

  img.hero {
    width: 100%;
    margin: 0 0 3em;
  }

  h1 {
    padding-top: 3.75em;
  }
`