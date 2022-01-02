import React from "react";

import { Feed } from './Videography.styles'

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

  const recentVideos = feedData && feedData.items;

  return (
    <Feed>
      {recentVideos &&
        [...recentVideos].reverse().map((video) => (
          <a
            key={video.snippet.resourceId.videoId}
            href={`https://youtube.com/watch?v=${video.snippet.resourceId.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="video"
            onClick={() =>
              window.ga(
                "send",
                "event",
                "YouTubeLink",
                "click",
                `https://youtube.com/watch?v=${video.snippet.resourceId.videoId}`
              )
            }
          >
            <img
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.description}
            />
            <span>{video.snippet.title}</span>
          </a>
        ))}
    </Feed>
  );
};