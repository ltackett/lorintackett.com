import * as React from 'react'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { GlobalHotKeys } from 'react-hotkeys';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import { PageContainer } from '../Pages.styles';
import { FullScreenPhoto, TriptychPhoto } from './Photography.styles';
import { PhotoGrid } from 'components/PhotoGrid';

import { photos } from './photos';

const categorizedPhotos = {};
categorizedPhotos['Nightscapes'] = [];
categorizedPhotos['Nightscape Portraits'] = [];
categorizedPhotos['Portraits of Trees'] = [];
categorizedPhotos['Landscapes'] = [];
categorizedPhotos['Norwegian Island Life'] = [];
categorizedPhotos['Miniature Mountains Triptych'] = [];
categorizedPhotos['Redwood Forest Triptych'] = [];
categorizedPhotos['Tillamook Forest Triptych'] = [];

photos.reverse().forEach((photo) => {
  photo.categories.forEach((category) => {
    if (!categorizedPhotos[category]) {
      categorizedPhotos[category] = []
    }

    categorizedPhotos[category].push(photo)
  })
})

export const Photography = () => {
  return (
    <PageContainer>
      <main>
        <Switch>
          <Route exact path="/photography">
            {categorizedPhotos && Object.keys(categorizedPhotos).map(category =>
              <React.Fragment key={category}>
                <h2>{category}</h2>
                <PhotoGrid photos={categorizedPhotos[category]} />
              </React.Fragment>
            )}
          </Route>

          <Route path="/photography/photos/:photoId" component={Photo} />

          <Route path="/photography/triptychs/:triptychId" component={Triptych} />
        </Switch>
      </main>
    </PageContainer>
  )
}

const Photo = (props) => {
  const { params } = useRouteMatch()
  const photo = props.photo || photos.filter(photo => photo.id === params.photoId)[0]

  const close = () => {
    window.history.back();
  }

  return (
    <GlobalHotKeys keyMap={{ close: 'escape' }} handlers={{ close }}>
      <FullScreenPhoto src={photo.filename} >
        {/* <PinchZoomPan position="center">
          <img src={`/images/photos/${photo.filename}`} alt={photo.title} />
        </PinchZoomPan> */}
        <TransformWrapper centerOnInit centerZoomedOut>
          <TransformComponent wrapperStyle={{
            width: '100vw',
            height: '100vh'
          }}>
            <img src={`/images/photos/${photo.filename}`} alt={photo.title} />
          </TransformComponent>
        </TransformWrapper>
        <button id="back-to-photogrid" onClick={() => window.history.back()}>Back</button>
      </FullScreenPhoto>
    </GlobalHotKeys>
  )
}

const Triptych = (props) => {
  const { params } = useRouteMatch()
  const triptychPhotos = photos.filter(photo => photo.triptychId === params.triptychId)

  console.log({ photos, triptychPhotos })

  return (
    <>
      <h2>{triptychPhotos[0].title}</h2>
      <p>{triptychPhotos[0].description}</p>
      <PhotoGrid photos={triptychPhotos} ignoreTriptychs />

      {triptychPhotos.map(photo =>
        <TriptychPhoto src={`/images/photos/thumbnails/${photo.filename}`} alt={photo.title} />
      )}
    </>
  )
}