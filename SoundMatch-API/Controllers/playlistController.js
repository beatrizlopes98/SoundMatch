const { handleError } = require("../Services/error");

const playlists = require("../Models/playlist").playlists;
const users = require("../Models/user").users;
const musics = require("../Models/music").musics;

exports.getPlaylistById = async function (req, res) {
  try {
    const { playlistId } = req.params;

    const foundPlaylist = await playlists.findById(playlistId).exec();
    if (!foundPlaylist) {
      return handleError(res, 404, "Playlist not found");
    }

    const user = await users.findOne({ email: req.user });
    if (foundPlaylist.userId.toString() !== user._id.toString()) {
      return handleError(
        res,
        403,
        "Forbidden: You can only view your own playlists"
      );
    }

    res.status(200).json({ playlist: foundPlaylist });
  } catch (error) {
    handleError(res, 500, `Error getting playlist by ID: ${error}`);
  }
};

exports.getAllPlaylists = async function (req, res) {
  try {
    const user = await users.findOne({ email: req.user });
    const loggedInUserId = user._id.toString();

    const userPlaylists = await playlists
      .find({ userId: loggedInUserId })
      .exec();

    res.status(200).json({ playlists: userPlaylists });
  } catch (error) {
    handleError(res, 500, `Error getting all playlists: ${error}`);
  }
};

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
      imageCover: "../assets/sound.png",
      userId: user._id,
    });

    const createdPlaylist = await newPlaylist.save();

    user.playlistId.push(createdPlaylist._id);
    await user.save();

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
      return handleError(
        res,
        403,
        "Forbidden: You don't have permission to edit this playlist"
      );
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
    const loggedInUserId = user._id.toString();

    const foundPlaylist = await playlists.findById(playlistId).exec();
    if (!foundPlaylist) {
      return handleError(res, 404, "Playlist not found");
    }

    if (foundPlaylist.userId.toString() !== loggedInUserId) {
      return handleError(
        res,
        403,
        "Forbidden: You can only delete your own playlists"
      );
    }

    const index = user.playlistId.indexOf(playlistId);
    if (index !== -1) {
      user.playlistId.splice(index, 1);
    }

    await user.save();
    await playlists.findOneAndDelete({ userId: loggedInUserId });

    res.status(204).end();
  } catch (error) {
    handleError(res, 500, `Error deleting playlist: ${error}`);
  }
};

exports.addRemoveMusicFromPlaylist = async function (req, res) {
  try {
    const { playlistId, musicId } = req.params;

    const user = await users.findOne({ email: req.user });
    const loggedInUserId = user._id.toString();

    const foundPlaylist = await playlists.findById(playlistId).exec();
    if (!foundPlaylist) {
      return handleError(res, 404, "Playlist not found");
    }

    if (foundPlaylist.userId.toString() !== loggedInUserId) {
      return handleError(
        res,
        403,
        "Forbidden: You can only modify your own playlists"
      );
    }

    //TODO Impement when music is implemented
    // const foundMusic = await musics.findById(musicId).exec();
    // if (!foundMusic) {
    //   return handleError(res, 404, "Music not found");
    // }

    const musicIndex = foundPlaylist.music.indexOf(musicId);

    if (musicIndex === -1) {
      foundPlaylist.music.push(musicId);
    } else {
      foundPlaylist.music.splice(musicIndex, 1);
    }

    const updatedPlaylist = await foundPlaylist.save();

    res.status(200).json({ playlist: updatedPlaylist });
  } catch (error) {
    handleError(
      res,
      500,
      `Error adding/removing music from playlist: ${error}`
    );
  }
};
