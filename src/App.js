import React from 'react';
import { createGlobalStyle } from 'styled-components';

import { RandomQuotes } from './components/RandomQuotes';
import { Intro } from './components/Intro';
import { StormySkies } from './components/Themes';

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
      <StormySkies>
        <RandomQuotes />
      </StormySkies>
      <Intro />
    </>
  );
}

export default App;
