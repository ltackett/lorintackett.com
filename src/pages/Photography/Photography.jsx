import * as React from 'react'
import { Link } from 'react-router-dom';

import { PhotographySharedStyles, PhotographyPageContainer, Header, Columns, LeftColumn, RightColumn } from './Photography.styles'
import { Fourfolio } from 'components/Fourfolio'

export const Photography = () => {
  return (
    <>
      <PhotographySharedStyles />
      <PhotographyPageContainer>
        <Header>
          <div>
            <Link to="/">
              <img src="/images/logo_black2_small.png" alt="" />
              <span className="visually-hidden">Lorin Tackett</span>
            </Link>
          </div>
          <div>
            <Fourfolio mini textColor="#777" borderColor="#999" hoverColor="#111" align="right" />
          </div>
        </Header>

        <Columns>
          <LeftColumn>
            <Link to="/">
              <img src="/images/logo_black.png" alt="" />
              <span className="visually-hidden">Lorin Tackett</span>
            </Link>
          </LeftColumn>

          <RightColumn>
            <h1>Photography</h1>
          </RightColumn>

          <LeftColumn>
            <ul className="galleries">
              <li>
                <Link to="/photography/nightscapes" className="nightscapes">Nightscapes</Link>
              </li>
              <li>
                <Link to="/photography/trees" className="trees">Trees</Link>
              </li>
              <li>
                <Link to="/photography/people" className="people">People</Link>
              </li>
              <li>
                <Link to="/photography/places" className="places">Places</Link>
              </li>
            </ul>

          </LeftColumn>

          <RightColumn>
            <img src="/images/aurora_borealis_mw_panorama.jpg" className="hero" alt="" />
            <p>My journey as a photographer began when I left a small digital camera in the glove box of a rental car. It wasn't a fancy camera, and I replaced it with an equally unremarkable cheap DSLR.</p>
            <p>I had no idea what a joy that camera would become to me, and that I would end up taking my first photos of the Milky Way galaxy with it, sparking a passion for photography that would inspire me to travel and explore.</p>
            <p>Come along and see the world through my lens!</p>
          </RightColumn>
        </Columns>
      </PhotographyPageContainer>
    </>
  )
}