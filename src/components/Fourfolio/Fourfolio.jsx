import * as React from 'react';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { FourfolioContainer } from './Fourfolio.styles';

export const Fourfolio = (props) => {
  const [fadeIn, setFadeIn] = React.useState('fadeIn-start')

  React.useEffect(() => {
    window.requestAnimationFrame(() => {
      setFadeIn('fadeIn-end')
    })
  }, [])

  return (
    <FourfolioContainer {...props} className={fadeIn}>
      <Link to="/photography">
        <Icon name="camera" />
        <span>Photography</span>
      </Link>

      <Link to="/videography">
        <Icon name="video" />
        <span>Videography</span>
      </Link>

      <Link to="/music">
        <Icon name="headphones" />
        <span>Music</span>
      </Link>

      <Link to="/code">
        <Icon name="code" />
        <span>Code</span>
      </Link>
    </FourfolioContainer>
  )
}