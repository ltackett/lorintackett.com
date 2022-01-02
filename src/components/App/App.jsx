import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import { GlobalStyles } from 'Styles.css';
import { Header, Footer } from './App.styles';
import { AppContext } from 'contexts/appContext';

import { Fourfolio } from 'components/Fourfolio';
import { LandingPage } from 'pages/LandingPage';
import { Photography } from 'pages/Photography';
import { Videography } from 'pages/Videography';
import { Music } from 'pages/Music';
import { Code } from 'pages/Code';

export const App = () => {
  const [isPortraitMode, setIsPortraitMode] = React.useState(false);

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

  const date = new Date();

  return (
    <>
      <GlobalStyles />
      <AppContext.Provider value={appContext}>
        <Router>
          <Switch>
            <Route exact path="/" />
            <Route path="/photography/photos" />
            <Route>
              <Header>
                <h1>
                  <Link to="/">
                    <img src="/images/logo_black2_small.png" alt="" />
                    <span className="visually-hidden">Lorin Tackett</span>
                  </Link>
                </h1>
                <div>
                  <Fourfolio mini textColor="#777" borderColor="#999" hoverColor="#111" align="right" />
                </div>
              </Header>
            </Route>
          </Switch>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/photography" component={Photography} />
            <Route path="/videography" component={Videography} />
            <Route path="/music" component={Music} />
            <Route path="/code" component={Code} />
          </Switch>
        </Router>
        <Footer>
          &copy; Lorin Tackett {date.getFullYear()}
        </Footer>
      </AppContext.Provider>
    </>
  );
}
