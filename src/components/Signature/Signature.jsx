import * as React from 'react';

import { SignatureContainer, Logo } from './Signature.styles';

export const Signature = () => {
  const videoRef = React.useRef(null);

  return (
    <SignatureContainer>
      <h1 className="visually-hidden">
        Lorin Tackett Photography &amp; Creative Media
      </h1>
      <Logo src="/images/logo.webm" ref={videoRef} autoPlay muted />
    </SignatureContainer>
  )
}