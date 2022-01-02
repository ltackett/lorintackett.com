import * as React from 'react';

import { SignatureContainer, Logo } from './Signature.styles';

const images = [
  '/images/logo/layer1.png',
  '/images/logo/layer2.png',
  '/images/logo/layer3.png',
  '/images/logo/layer4.png',
  '/images/logo/layer5.png',
  '/images/logo/layer6.png'
]

export const Signature = () => {
  const [layer1Loaded, setLayer1Loaded] = React.useState(false)
  const [layer2Loaded, setLayer2Loaded] = React.useState(false)
  const [layer3Loaded, setLayer3Loaded] = React.useState(false)
  const [layer4Loaded, setLayer4Loaded] = React.useState(false)
  const [layer5Loaded, setLayer5Loaded] = React.useState(false)
  const [layer6Loaded, setLayer6Loaded] = React.useState(false)

  const [layer1AnimationDone, setLayer1AnimationDone] = React.useState(false)
  const [layer2AnimationDone, setLayer2AnimationDone] = React.useState(false)
  const [layer3AnimationDone, setLayer3AnimationDone] = React.useState(false)
  const [layer4AnimationDone, setLayer4AnimationDone] = React.useState(false)
  const [layer5AnimationDone, setLayer5AnimationDone] = React.useState(false)
  const [layer6AnimationDone, setLayer6AnimationDone] = React.useState(false)

  React.useEffect(() => {
    images.forEach((image) => {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        switch (image) {
          case images[0]: setLayer1Loaded(true); break;
          case images[1]: setLayer2Loaded(true); break;
          case images[2]: setLayer3Loaded(true); break;
          case images[3]: setLayer4Loaded(true); break;
          case images[4]: setLayer5Loaded(true); break;
          case images[5]: setLayer6Loaded(true); break;
          default: break;
        }
      }
    })
  }, [])

  let isLoaded = false;
  if (layer1Loaded && layer2Loaded && layer3Loaded && layer4Loaded && layer5Loaded && layer6Loaded) {
    isLoaded = true
  }

  return (
    <SignatureContainer>
      <h1 className="visually-hidden">
        Lorin Tackett Photography &amp; Creative Media
      </h1>
      <Logo className={isLoaded ? 'run-animation' : ''}>
        <span className={`layer-1 ${layer1AnimationDone ? 'done' : ''}`} onAnimationEnd={() => setLayer1AnimationDone(true)}></span>
        <span className={`layer-2 ${layer2AnimationDone ? 'done' : ''}`} onAnimationEnd={() => setLayer2AnimationDone(true)}></span>
        <span className={`layer-3 ${layer3AnimationDone ? 'done' : ''}`} onAnimationEnd={() => setLayer3AnimationDone(true)}></span>
        <span className={`layer-4 ${layer4AnimationDone ? 'done' : ''}`} onAnimationEnd={() => setLayer4AnimationDone(true)}></span>
        <span className={`layer-5 ${layer5AnimationDone ? 'done' : ''}`} onAnimationEnd={() => setLayer5AnimationDone(true)}></span>
        <span className={`layer-6 ${layer6AnimationDone ? 'done' : ''}`} onAnimationEnd={() => setLayer6AnimationDone(true)}></span>
      </Logo>
    </SignatureContainer>
  )
}