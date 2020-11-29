import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeadphones,
  faCamera,
  faVideo,
  faCode,
} from "@fortawesome/free-solid-svg-icons";

import { CSSTransition } from "react-transition-group";

import {
  Outer,
  Container,
  StuffIMake,
  BackgroundOuter,
  BackgroundInner,
  Code,
  Player,
  Button,
  Section,
  Footer
} from "./IMakeStuff.styles";

import projectMTCT from "./mtct.jpg";
import projectNPR from "./npr.jpg";
import projectTMO from "./tmo.jpg";
import projectMSFT from "./msft.jpg";

import { InstagramFeed } from "./InstagramFeed";
import { YouTubeFeed } from "./YouTubeFeed";

export const IMakeStuff = () => {
  const [selected, setSelected] = React.useState([""]);

  return (
    <Outer className={selected}>
      <BackgroundOuter>
        {selected.map((section) => (
          <CSSTransition key={section} timeout={{ enter: 5000, exit: 500 }}>
            <BackgroundInner className={section} />
          </CSSTransition>
        ))}
      </BackgroundOuter>

      <Container>
        <h1>
          Hi. I'm Lorin <span>&amp;</span> I make stuff.
        </h1>

        <StuffIMake>
          <Button
            {...{ selected, setSelected }}
            section="code"
            color="#8ad8e6aa"
          >
            <FontAwesomeIcon icon={faCode} className="code" />
          </Button>

          <Button
            {...{ selected, setSelected }}
            section="music"
            color="#e6c18aaa"
          >
            <FontAwesomeIcon icon={faHeadphones} />
          </Button>

          <Button
            {...{ selected, setSelected }}
            section="photos"
            color="#9ce68aaa"
          >
            <FontAwesomeIcon icon={faCamera} />
          </Button>

          <Button
            {...{ selected, setSelected }}
            section="videos"
            color="#e6978aaa"
          >
            <FontAwesomeIcon icon={faVideo} />
          </Button>
        </StuffIMake>

        <Section show={selected[0] === "code"}>
          <Code>
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
              <img src={projectMSFT} alt="Microsoft Stream" />
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
              <img src={projectMTCT} alt="Music To Code To" />
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
              <img src={projectTMO} alt="DIGITS by T-Mobile" />
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
              <img src={projectNPR} alt="NPR Live Sessions" />
            </a>
          </Code>
        </Section>

        <Section show={selected[0] === "music"}>
          <Player>
            <iframe
              title="Daze of Resistance"
              width="100%"
              height="410"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1135319245&color=%23f36e44&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
            ></iframe>
          </Player>
        </Section>

        <Section show={selected[0] === "photos"}>
          <InstagramFeed />
        </Section>

        <Section show={selected[0] === "videos"}>
          <YouTubeFeed />
        </Section>
      </Container>
      
      <Footer>
        <p>&copy; Lorin Tackett {new Date().getFullYear()}</p>
      </Footer>
    </Outer>
  );
};
