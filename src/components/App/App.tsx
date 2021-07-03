import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { AppContext } from '../../contexts/appContext';

import { GlobalStyles } from '../../Styles.css';
import { LandingScreen } from '../LandingScreen';

export const App = () => {
  const [ isPortraitMode, setIsPortraitMode ] = React.useState<boolean>(false);

  const appContext = {
    isPortraitMode
  }

  const detectOrientation = () => {
    const width = window.innerWidth
    const height = window.innerHeight

    if (height > (width / 0.8)) {
      setIsPortraitMode(true);
    } else {
      setIsPortraitMode(false);
    }
    console.log({ width, height })
  }

  React.useEffect(() => {
    detectOrientation();
    window.addEventListener('resize', detectOrientation);

    return () => window.removeEventListener('resize', detectOrientation);
  }, [])

  React.useEffect(() => {
    console.log(isPortraitMode)
  }, [isPortraitMode])

  return (
    <>
      <GlobalStyles />
      <AppContext.Provider value={appContext}>
        <Router>
          <Switch>
            <Route exact path="/">
              <LandingScreen />
            </Route>

            <Route path="/photography">
              <p>Photography</p>
            </Route>
          </Switch>
        </Router>
      </AppContext.Provider>
    </>
  );
}
