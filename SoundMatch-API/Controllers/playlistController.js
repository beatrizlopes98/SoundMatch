const { handleError } = require("../Services/error");
const { playlists } = require("../Models/playlist").playlists; // Assuming you have a playlist model

exports.createPlaylist = async function (req, res) {
  try {
    const { title, imageCover } = req.body;
    const user = req.user; // Assuming the user information is stored in req.user

    // Create a new playlist
    const newPlaylist = new playlists({
      title,
      imageCover,
      userId: user._id,
    });

    // Save the new playlist
    const createdPlaylist = await newPlaylist.save();

    res.status(201).json({ playlist: createdPlaylist });
  } catch (error) {
    handleError(res, 500, `Error creating playlist: ${error}`);
  }
};

exports.editPlaylist = async function (req, res) {
  try {
    const { playlistId } = req.params;
    const { title, imageCover } = req.body;

    // Check if the playlistId is valid
    const foundPlaylist = await playlists.findById(playlistId).exec();
    if (!foundPlaylist) {
      return handleError(res, 404, "Playlist not found");
    }

    // Update playlist information
    foundPlaylist.title = title;
    foundPlaylist.imageCover = imageCover;

    // Save the updated playlist
    const updatedPlaylist = await foundPlaylist.save();

    res.status(200).json({ playlist: updatedPlaylist });
  } catch (error) {
    handleError(res, 500, `Error editing playlist: ${error}`);
  }
};

exports.deletePlaylist = async function (req, res) {
  try {
    const { playlistId } = req.params;

    // Check if the playlistId is valid
    const foundPlaylist = await playlists.findById(playlistId).exec();
    if (!foundPlaylist) {
      return handleError(res, 404, "Playlist not found");
    }

    // Delete the playlist
    await foundPlaylist.remove();

    res.status(204).end();
  } catch (error) {
    handleError(res, 500, `Error deleting playlist: ${error}`);
  }
};
