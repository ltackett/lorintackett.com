import React from 'react';
import { createGlobalStyle } from 'styled-components';

import { RandomQuotes } from './components/RandomQuotes';
import { Intro } from './components/Intro';

const GlobalStyle = createGlobalStyle`
  html, body {
    padding: 0;
    margin: 0;
  }
`

function App() {
  return (
    <>
      <GlobalStyle />
      <RandomQuotes />
      <Intro />
    </>
  );
}

export default App;
