import React from 'react';

import { createGlobalStyle } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom'

import { AppContext } from './App.Context';
import { RandomQuotes } from './components/RandomQuotes';
import { IMakeStuff } from './components/IMakeStuff';
import { StormySkies } from './components/Themes';
import { InstagramPost } from './components/InstagramPost';

const GlobalStyle = createGlobalStyle`
  html, body {
    padding: 0;
    margin: 0;
  }
`

function App() {
  const [currentInstagramPost, setCurrentInstagramPost] = React.useState(undefined)
  return (
    <>
      <GlobalStyle />
      <Router>
        <AppContext.Provider value={{ currentInstagramPost, setCurrentInstagramPost }}>
          <StormySkies>
            <RandomQuotes />
          </StormySkies>
          <IMakeStuff />
          <InstagramPost />
        </AppContext.Provider>
      </Router>
    </>
  );
}

export default App;
