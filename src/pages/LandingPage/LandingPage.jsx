import * as React from 'react';
import styled from 'styled-components';

import { Clouds } from 'components/Clouds';
import { Signature } from 'components/Signature';
import { Fourfolio } from 'components/Fourfolio';
import { Loading } from 'components/Loading';

const LandingPageContainer = styled.div`
  min-height: 100vh;
  background: #000;
  color: #efefef;
`

const images = [
  '/images/clouds_black_1.png',
  '/images/clouds_white_2.png',
  '/images/clouds_white_3.png',
  '/images/trees.png'
]

export const LandingPage = () => {
  const [clouds1Loaded, setClouds1Loaded] = React.useState(false);
  const [clouds2Loaded, setClouds2Loaded] = React.useState(false);
  const [clouds3Loaded, setClouds3Loaded] = React.useState(false);
  const [treesLoaded, setTreesLoaded] = React.useState(false);

  const cloudLayers = [
    { src: '/images/clouds_white_2.png', width: 1000, height: 509, velocity: 0.25, xStartPos: 100 },
    { src: '/images/clouds_black_1.png', width: 1000, height: 447, velocity: 0.50, xStartPos: 300 },
    { src: '/images/clouds_white_3.png', width: 1579, height: 341, velocity: 0.95, xStartPos: 0 }
  ];

  React.useEffect(() => {
    images.forEach((image) => {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        switch (image) {
          case images[0]: setClouds1Loaded(true); break;
          case images[1]: setClouds2Loaded(true); break;
          case images[2]: setClouds3Loaded(true); break;
          case images[3]: setTreesLoaded(true); break;
          default: break;
        }
      }
    })
  }, [])

  return (
    <LandingPageContainer>
      {clouds1Loaded && clouds2Loaded && clouds3Loaded && treesLoaded ? (
        <>
          <Clouds layers={cloudLayers} speed={0.5} />
          <Signature />
          <Fourfolio animated />
        </>
      ) : (
        <Loading>Loading...</Loading>
      )}
    </LandingPageContainer>
  )
}