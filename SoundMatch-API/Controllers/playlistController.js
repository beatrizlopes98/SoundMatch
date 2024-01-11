const { handleError } = require("../Services/error");

const playlists = require("../Models/playlist").playlists;
const users = require("../Models/user").users;

exports.createPlaylist = async function (req, res) {
  try {
    const { title } = req.body;

    const user = await users.findOne({ email: req.user });

    const foundPlaylist = await playlists.findOne({
      title,
      userId: user._id,
    });

    if (foundPlaylist) {
      return handleError(res, 406, "Duplicated Playlist Name");
    }
    const newPlaylist = new playlists({
      title,
      imageCover: "",
      userId: user._id,
    });

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

    const foundPlaylist = await playlists.findById(playlistId).exec();
    if (!foundPlaylist) {
      return handleError(res, 404, "Playlist not found");
    }

    const user = await users.findOne({ email: req.user });
    if (foundPlaylist.userId.toString() !== user._id.toString()) {
      return handleError(res, 403, "Forbidden: You don't have permission to edit this playlist");
    }

    const existingPlaylist = await playlists.findOne({
      title,
      userId: user._id,
      _id: { $ne: playlistId },
    });

    if (existingPlaylist) {
      return handleError(res, 406, "Duplicated Playlist Name");
    }

    foundPlaylist.title = title;
    foundPlaylist.imageCover = imageCover;

    const updatedPlaylist = await foundPlaylist.save();

    res.status(200).json({ playlist: updatedPlaylist });
  } catch (error) {
    handleError(res, 500, `Error editing playlist: ${error}`);
  }
};

exports.deletePlaylist = async function (req, res) {
  try {
    const { playlistId } = req.params;

    const user = await users.findOne({ email: req.user });
    const loggedInUserId = user._id.toString()

    const foundPlaylist = await playlists.findById(playlistId).exec();
    if (!foundPlaylist) {
      return handleError(res, 404, "Playlist not found");
    }

    if (foundPlaylist.userId.toString() !== loggedInUserId) {
      return handleError(res, 403, "Forbidden: You can only delete your own playlists");
    }

    await playlists.findByIdAndDelete(loggedInUserId);

    res.status(204).end();
  } catch (error) {
    handleError(res, 500, `Error deleting playlist: ${error}`);
  }
};
