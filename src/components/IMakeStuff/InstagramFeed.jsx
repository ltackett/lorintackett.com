import React from "react";
import { useHistory } from "react-router";
import styled from "styled-components";

import { AppContext } from "../../App.Context";
import { device } from "../../responsive";

const Feed = styled.div`
  display: grid;
  max-width: 800px;
  grid-gap: 1.5em;
  margin: 0 0 3em;

  grid-template-columns: 1fr;
  @media ${device.min.mobileM} { grid-template-columns: 1fr 1fr; }
  @media ${device.min.tablet} { grid-template-columns: 1fr 1fr 1fr 1fr; }
  
  a {
    box-shadow: rgba(0, 0, 0, 0.8) 0 0.5em 1.25em 0.25em;
    border-radius: 0.4em;
    display: block;
  }

  img {
    display: block;
    max-width: 100%;
  }
`;

export const InstagramFeed = () => {
  const history = useHistory()
  
  const [feedData, setFeedData] = React.useState(undefined);
  const [error, setError] = React.useState(undefined)

  const { setCurrentInstagramPost } = React.useContext(AppContext)

  React.useEffect(() => {
    const fetchInsta = async () => {
      const res = await fetch("https://www.instagram.com/lorintackett/?__a=1");
      const data = await res.text();
      let jsonData

      try {
        jsonData = JSON.parse(data)
      } catch (error) {
        setError(error)
        return
      }
      
      setFeedData(jsonData.graphql ? jsonData.graphql.user : jsonData);
    };

    fetchInsta();
  }, []);

  const recentPosts =
    feedData &&
    !feedData.error &&
    feedData.edge_owner_to_timeline_media.edges
      .filter((p, i) => i < 12)
      .map((p) => p.node);

  const handleClick = (e, post) => {
    e.preventDefault()
    setCurrentInstagramPost(post);
    history.push(`/instagram/${post.shortcode}`)
    
    window.ga(
      "send",
      "event",
      "InstagramLink",
      "click",
      `https://instagram.com/p/${post.shortcode}`
    )
  }

  if (error) {
    return (
      <>
        <p>Instagram feed temporarily unavailable.</p>
        <p>
          <a href="https://instagram.com/lorintackett" target="_blank" rel="noopener noreferrer">
            Visit my Instagram directly.
          </a>
        </p>
      </>
    )
  }

  return (
    <>
      <Feed>
        {recentPosts &&
          recentPosts.map((p) => (
            <a
              key={p.id}
              href={`https://instagram.com/p/${p.shortcode}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleClick(e, p)}
            >
              <img
                src={p.thumbnail_resources[3].src}
                alt={p.accessibility_caption}
              />
            </a>
          ))}
      </Feed>

      {feedData && feedData.error && (
        <>
          <p>Video feed temporarily unavailable.</p>
          <p>
            <a
              href="https://instagram.com/lorintackett"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit my Instagram directly.
            </a>
          </p>
        </>
      )}
    </>
  );
};
