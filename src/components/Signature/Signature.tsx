import * as React from 'react';
import styled from 'styled-components';

const Outer = styled.div`
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
`

const StyledSignature = styled.img`
  position: absolute;
  top: 200px;
  left: 50%;
  width: 500px;
  transform: translate(-50%, 0);
`

export const Signature = () => {

  return (
    <Outer>
      <h1 className="visually-hidden">
        Lorin Tackett Photography &amp; Creative Media
      </h1>
      <StyledSignature src="/images/logo.png" />
    </Outer>
  )
}