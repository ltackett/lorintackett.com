import * as React from 'react'

import { FullscreenBackground, PageContainer } from '../Pages.styles';
import { Projects } from './Code.styles';

export const Code = () => {
  return (
    <>
      <FullscreenBackground image="/images/code.jpg" />
      <PageContainer>
        <main>
          <h2>Frontend Projects</h2>
          <p>My career outside of my creative endeavors is in developing user interfaces for web applications. Here are some products I have been privileged to work on.</p>
          <Projects>
            <a
              href="https://www.microsoft.com/en-us/microsoft-365/microsoft-stream"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                window.ga(
                  "send",
                  "event",
                  "Project",
                  "click",
                  "MSFT_Stream"
                )
              }
            >
              <img src="/images/msft.jpg" alt="Microsoft Stream" />
            </a>

            <a
              href="http://musictocodeto.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                window.ga(
                  "send",
                  "event",
                  "Project",
                  "click",
                  "MTCT"
                )
              }
            >
              <img src="/images/mtct.jpg" alt="Music To Code To" />
            </a>

            <a
              href="https://www.t-mobile.com/offers/t-mobile-digits"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                window.ga(
                  "send",
                  "event",
                  "Project",
                  "click",
                  "TMO"
                )
              }
            >
              <img src="/images/tmo.jpg" alt="DIGITS by T-Mobile" />
            </a>

            <a
              href="https://livesessions.npr.org/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                window.ga(
                  "send",
                  "event",
                  "Project",
                  "click",
                  "NPR"
                )
              }
            >
              <img src="/images/npr.jpg" alt="NPR Live Sessions" />
            </a>
          </Projects>
        </main>
      </PageContainer>
    </>
  )
}