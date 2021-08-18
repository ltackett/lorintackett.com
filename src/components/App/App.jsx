import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { GlobalStyles } from 'Styles.css';
import { AppContext } from 'contexts/appContext';

import { LandingPage } from 'pages/LandingPage';
import { Photography } from 'pages/Photography';

export const App = () => {
  const [ isPortraitMode, setIsPortraitMode ] = React.useState(false);

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
  }

  const handleResize = () => {
    detectOrientation();
  }

  React.useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <GlobalStyles />
      <AppContext.Provider value={appContext}>
        <Router>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/photography" component={Photography} />
          </Switch>
        </Router>
      </AppContext.Provider>
    </>
  );
}
