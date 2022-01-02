import * as React from 'react';

import { PhotoGridBaseStyles, StyledLink } from './PhotoGrid.styles';

export const PhotoGrid = (props) => {
  return (
    <PhotoGridBaseStyles>
      {props.photos && props.photos.length && props.photos.map((photo) =>
        <PhotoGridItem {...photo} key={props.id} ignoreTriptychs={props.ignoreTriptychs} />
      )}
    </PhotoGridBaseStyles>
  )
}

const PhotoGridItem = (props) => {
  const background = {
    backgroundImage: `url('/images/photos/thumbnails/${props.filename}')`,
    backgroundPositionX: props.offset ? `calc(50%${props.offset.left ? ` - ${props.offset.left}%` : ''}${props.offset.right ? ` + ${props.offset.right}%` : ''})` : '50%',
    backgroundPositionY: props.offset ? `calc(50%${props.offset.top ? ` - ${props.offset.top}%` : ''}${props.offset.bottom ? ` + ${props.offset.bottom}%` : ''})` : '50%'
  }

  const handleClick = () => {
    if (props.type === 'triptych' && !props.ignoreTriptychs) {
      window.scroll({ top: 0, behavior: 'smooth' });
    }
  }

  let path = props.path;

  if (props.type === 'triptych' && !props.ignoreTriptychs) {
    path = props.triptychPath
  }

  return (
    <StyledLink to={`/photography/${path}`} style={background} onClick={handleClick}>
      <span className="visually-hidden">{props.title}</span>
    </StyledLink>
  )
}