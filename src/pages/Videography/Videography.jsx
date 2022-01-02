import * as React from 'react'

import { PageContainer } from '../Pages.styles'
import { YouTubeFeed } from './YouTubeFeed'

export const Videography = () => {
  return (
    <PageContainer>
      <main>
        <h2>Latest Videos</h2>
        <YouTubeFeed />
      </main>
    </PageContainer>
  )
}