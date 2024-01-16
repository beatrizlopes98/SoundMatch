const spotify = require("../Services/spotify");
const { handleError } = require("../Services/error");

const playlists = require("../Models/playlist").playlists;
const users = require("../Models/user").users;

exports.getPlaylists = async function (req, res) {
  const user = await users.findOne({ email: req.user });

  try {
    const playlistsData = await spotify.getPlaylists(req.spotifyPayload.data.user.access_token);

    const playlistsToSave = playlistsData.map((playlist) => ({
      music: [],
      title: playlist.name,
      imageCover: playlist.images[0]
        ? playlist.images[0].url
        : "..&#x2F;assets&#x2F;sound.png",
      externalUrl: playlist.external_urls.spotify,
      userId: user._id,
    }));

    console.log(playlistsToSave);
    const savedPlaylists = await playlists.insertMany(playlistsToSave);

    res.status(200).json(savedPlaylists);
  } catch (error) {
    handleError(
      res,
      500,
      `Error getting and saving playlists: ${error.message}`
    );
  }
};
