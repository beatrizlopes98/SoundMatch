const spotify = require("../Services/spotify");
const { handleError } = require("../Services/error");
const Playlist = require("../Models/playlist");

exports.getPlaylists = async function (req, res) {
  const userId = req.user.id;

  try {
    const playlistsData = await spotify.getPlaylists(
      req.spotifyPayload.data.user.access_token,
      userId
    );

    const playlistsToSave = playlistsData.map((playlist) => ({
      music: [],
      title: playlist.name,
      imageCover: playlist.images[0]
        ? playlist.images[0].url
        : "..&#x2F;assets&#x2F;sound.png",
      externalUrl: playlist.external_urls.spotify,
      userId,
    }));

    const savedPlaylists = await Playlist.insertMany(playlistsToSave);

    res.status(200).json(savedPlaylists);
  } catch (error) {
    handleError(
      res,
      500,
      `Error getting and saving playlists: ${error.message}`
    );
  }
};
