import React from 'react'
import styled from 'styled-components'

import { Route } from 'react-router'

import { AppContext } from '../../App.Context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowClose } from '@fortawesome/free-solid-svg-icons'

const FullScreenModal = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;

  background: #000;
  overflow: auto;
  padding: 3em;


  svg {
    position: absolute;
    font-size: 1.5em;
    top: 0.5em;
    right: 0.5em;
    color: #fff;
    curso
  }

  img {
    max-height: calc(100% - 6em);
    max-width: 100%;
    position: relative;
    left: 50%;
    transform: translate(-50%, 0);
    margin: 0 0 1em;
  }

  .caption {
    max-width: 100%;
    margin: 0 auto;
  }
`

export const InstagramPost = () => {
  const { currentInstagramPost } = React.useContext(AppContext)

  const handleClose = () => {
    window.history.back()
  }

  if (!currentInstagramPost) {
    return null;
  }
  
  return (
    <Route exact path="/instagram/:postId">
      <InnerContent p={currentInstagramPost}>
        <FontAwesomeIcon icon={faWindowClose} onClick={handleClose} />
      </InnerContent>
    </Route>
  )
}

const InnerContent = ({ p, children }) => {
  const imgRef = React.useRef(null)

  const [imgDimensions, setImgDimensions] = React.useState();

  const caption = p.edge_media_to_caption.edges[0].node.text.replace(/\n/g, '<br />')

  return (
    <FullScreenModal>
      {children}
      <img src={p.display_url} alt="accessibility_caption" ref={imgRef} onLoad={() => setImgDimensions(imgRef.current.getBoundingClientRect())} />
      {imgDimensions &&
        <div className="caption" dangerouslySetInnerHTML={{ __html: caption }} style={{ width: imgDimensions.width }} />
      }
    </FullScreenModal>
  )
}