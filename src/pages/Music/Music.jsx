import * as React from 'react'

import { PageContainer } from '../Pages.styles';

export const Music = () => {
  return (
    <PageContainer>
      <main>
        <h2>Latest Tunes</h2>
        <iframe
          title="Daze of Resistance"
          width="100%"
          height="500"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1135319245&color=%23f36e44&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
        ></iframe>
      </main>
    </PageContainer>
  )
}