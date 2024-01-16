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
    
    playlistData.tracks.items.forEach((item) => {
      const track = item.track;
      const artistGenres = track.artists.map((artist) => artist.genres).flat();

      console.log({
        name: track.name,
        artist: track.artists.map((artist) => artist.name).join(", "),
        album: track.album.name,
        genres: artistGenres,
        spotifyId: track.id,
      });
    });

    return playlistData;
  } catch (error) {
    throw new Error(`Error getting playlist by ID: ${error.message}`);
  }
};


module.exports = {
  getPlaylistById,
  getPlaylists,
};
