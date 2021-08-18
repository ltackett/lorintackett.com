import * as React from 'react';
import styled from 'styled-components';

import { Clouds } from 'components/Clouds'
import { Signature } from 'components/Signature'
import { Fourfolio } from 'components/Fourfolio';

const LandingPageContainer = styled.div`
  min-height: 100vh;
  background: #000;
  color: #efefef;
`

export const LandingPage = () => {
  const cloudLayers = [
    { src: '/images/clouds_white_2.png', width: 1000, height: 509, velocity: 0.25, xStartPos: 100 },
    { src: '/images/clouds_black_1.png', width: 1000, height: 447, velocity: 0.50, xStartPos: 300 },
    { src: '/images/clouds_white_3.png', width: 1579, height: 341, velocity: 0.95, xStartPos: 0 }
  ];

  return (
    <LandingPageContainer>
      <Clouds layers={cloudLayers} speed={0.5} />
      <Signature />
      <Fourfolio animated />
    </LandingPageContainer>
  )
}