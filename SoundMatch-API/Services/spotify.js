const fetch = require("node-fetch");

const getPlaylists = async (accessToken) => {
  try {
    const response = await fetch("https://api.spotify.com/v1/me/playlists", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get public playlists: ${response.statusText}`);
    }

    const playlistsData = await response.json();
    return playlistsData.items;
  } catch (error) {
    throw new Error(`Error getting public playlists: ${error.message}`);
  }
};

const getPlaylistById = async (playlistId, accessToken) => {
  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get playlist by ID: ${response.statusText}`);
    }

    const playlistData = await response.json();
    return playlistData;
  } catch (error) {
    throw new Error(`Error getting playlist by ID: ${error.message}`);
  }
};

const getRecommendationGenres = async (accessToken) => {
  try {
    const response = await fetch("https://api.spotify.com/v1/recommendations/available-genre-seeds", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get recommendation genres: ${response.statusText}`);
    }

    const data = await response.json();
    return data.genres;
  } catch (error) {
    throw new Error(`Error getting recommendation genres: ${error.message}`);
  }
};

const getRecommendations = async (accessToken, genres) => {
  try {
    const seedGenres = genres.map((genre) => genre.toLowerCase()).join(",");

    const url = new URL("https://api.spotify.com/v1/recommendations");
    url.searchParams.append("seed_genres", seedGenres);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get music recommendations: ${response.statusText}`);
    }

    const data = await response.json();
    return data.tracks.map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map((artist) => artist.name).join(", "),
      album: track.album.name,
    }));
  } catch (error) {
    throw new Error(`Error getting music recommendations: ${error.message}`);
  }
};

const getFullTrackDetails = async (trackIds, accessToken) => {
  const url = `https://api.spotify.com/v1/tracks?ids=${trackIds.join(",")}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get full track details: ${response.statusText}`);
    }

    const trackDetails = await response.json();
    return trackDetails.tracks.map((track) => ({
      spotifyId: track.id,
      name: track.name,
      artist: track.artists.map((artist) => artist.name).join(", "),
      album: {
        name: track.album.name,
        imageURL: track.album.images.length > 0 ? track.album.images[0].url : null,
      },
      previewURL: track.preview_url,
      duration: track.duration_ms,
      genres: [],
    }));
  } catch (error) {
    throw new Error(`Error getting full track details: ${error.message}`);
  }
};


module.exports = {
  getPlaylistById,
  getPlaylists,
  getRecommendationGenres,
  getRecommendations,
  getFullTrackDetails
};
