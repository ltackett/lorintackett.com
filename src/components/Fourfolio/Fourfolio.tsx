import * as React from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeadphones,
  faCamera,
  faVideo,
  faCode,
} from "@fortawesome/free-solid-svg-icons";

import { FourfolioContainer } from './Fourfolio.styles';
import { Link } from 'react-router-dom';

export const Fourfolio = () => {
  return (
    <FourfolioContainer>
      <Link to="/photography">
        <FontAwesomeIcon icon={faCamera} />
        <span>Photography</span>
      </Link>

      <Link to="/videography">
        <FontAwesomeIcon icon={faVideo} />
        <span>Videography</span>
      </Link>

      <Link to="/music">
        <FontAwesomeIcon icon={faHeadphones} />
        <span>Music</span>
      </Link>

      <Link to="/code">
        <FontAwesomeIcon icon={faCode} className="code" />
        <span>Code</span>
      </Link>
    </FourfolioContainer>
  )
}