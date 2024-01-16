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

module.exports = {
  getPlaylists,
};
