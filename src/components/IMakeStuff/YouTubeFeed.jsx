import React from "react";
import styled from "styled-components";
import { device } from "../../responsive";

const Feed = styled.div`
  display: grid;
  max-width: 800px;
  grid-gap: 1.5em;
  margin: 0 0 3em;

  grid-template-columns: 1fr;
  @media ${device.min.mobileM} { grid-template-columns: 1fr 1fr; }
  @media ${device.min.tablet} { grid-template-columns: 1fr 1fr 1fr 1fr; }

  a.video {
    box-shadow: rgba(0, 0, 0, 0.8) 0 0.5em 1.25em 0.25em;
    border-radius: 0.4em;
    display: block;
  }

  img {
    display: block;
    max-width: 100%;
  }
`;

const API = "https://www.googleapis.com/youtube/v3";
const key = `key=${process.env.REACT_APP_YOUTUBE_API_KEY}`

export const YouTubeFeed = () => {
  const [feedData, setFeedData] = React.useState(undefined);
  const [error, setError] = React.useState(undefined)

  React.useEffect(() => {
    const fetchYouTubePlaylistItems = async (playlistId) => {
      const res = await fetch(
        `${API}/playlistItems?${key}&playlistId=${playlistId}&part=snippet`
      );
      const data = await res.json();
      return data;
    }

    const getFeaturedYouTubeVideos = async () => {
      const featuredVideosPlaylist = 'PLM0140vr7t4sKSN4y5mk5S0OUWlPKq5MY'
      
      const featuredVideos = await fetchYouTubePlaylistItems(featuredVideosPlaylist)
      if (featuredVideos.error) {
        setError(featuredVideos.error)
        return;
      }

      if (featuredVideos.items.length === 0) {
        setError('no videos found in playlist')
        return;
      }

      setFeedData(featuredVideos)
    }

    getFeaturedYouTubeVideos()
  }, []);

  if (error) {
    return (
      <>
        <p>Video feed temporarily unavailable.</p>
        <p>
          <a href="https://www.youtube.com/channel/UCHQaouGFKexdm9klQ3Gs4vA" target="_blank" rel="noopener noreferrer">
            Visit my YouTube channel directly.
          </a>
        </p>
      </>
    )
  }

  const recentVideos = feedData && feedData.items

  return (
    <Feed>
      {recentVideos &&
        recentVideos.map((v) => (
          <a
            key={v.snippet.resourceId.videoId}
            href={`https://youtube.com/watch?v=${v.snippet.resourceId.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="video"
            onClick={() =>
              window.ga(
                "send",
                "event",
                "YouTubeLink",
                "click",
                `https://youtube.com/watch?v=${v.snippet.resourceId.videoId}`
              )
            }
          >
            <img
              src={v.snippet.thumbnails.medium.url}
              alt={v.snippet.description}
            />
          </a>
        ))}
    </Feed>
  );
};
