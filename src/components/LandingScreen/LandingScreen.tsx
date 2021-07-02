import * as React from 'react';

import { CloudLayer } from '../Clouds/Clouds.types'
import { Clouds } from '../Clouds'
import { Signature } from '../Signature'

export const LandingScreen = () => {
  const cloudLayers: CloudLayer[] = [
    { src: '/images/clouds_white_2.png', width: 1000, height: 509, velocity: 0.25, xStartPos: 100 },
    { src: '/images/clouds_black_1.png', width: 1000, height: 447, velocity: 0.50, xStartPos: 300 },
    { src: '/images/clouds_white_3.png', width: 1579, height: 341, velocity: 0.95, xStartPos: 0 }
  ];

  return (
    <>
      <Clouds layers={cloudLayers} speed={0.5} />
      <Signature />
    </>
  )
}