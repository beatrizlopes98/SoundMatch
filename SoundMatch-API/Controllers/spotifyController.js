const spotify = require("../Services/spotify");
const { handleError } = require("../Services/error");

const playlists = require("../Models/playlist").playlists;
const users = require("../Models/user").users;

exports.getPlaylists = async function (req, res) {
  const user = await users.findOne({ email: req.user });

  try {
    const playlistsData = await spotify.getPlaylists(
      req.spotifyPayload.data.user.access_token
    );

    const playlistsToSave = [];

    for (const playlist of playlistsData) {
      const existingPlaylist = await playlists.findOne({
        spotifyId: playlist.id,
        userId: user._id,
      });

      if (!existingPlaylist) {
        const playlistToSave = {
          music: [],
          title: playlist.name,
          imageCover: playlist.images[0]
            ? playlist.images[0].url
            : "..&#x2F;assets&#x2F;sound.png",
          externalUrl: playlist.external_urls.spotify,
          spotifyId: playlist.id,
          userId: user._id,
        };

        playlistsToSave.push(playlistToSave);
      }
    }

    if (playlistsToSave.length > 0) {
      const savedPlaylists = await playlists.insertMany(playlistsToSave);

      // Update user's playlistId array with the new playlist IDs
      const newPlaylistIds = savedPlaylists.map((playlist) => playlist._id);
      user.playlistId = user.playlistId.concat(newPlaylistIds);
      await user.save();

      res.status(200).json(savedPlaylists);
    } else {
      res.status(200).json({ message: "No new playlists to save" });
    }
  } catch (error) {
    handleError(
      res,
      500,
      `Error getting and saving playlists: ${error.message}`
    );
  }
};
