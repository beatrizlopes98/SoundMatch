const { handleError } = require("../Services/error");
const { users } = require("../Models/user");
const { playlists } = require("../Models/playlist");
const { musics } = require("../Models/music");

exports.getAllPlaylists = async function (req, res) {
  try {
    const allPlaylists = await playlists.find().exec();
    res.status(200).json({ playlists: allPlaylists });
  } catch (error) {
    handleError(res, 500, `Error getting all playlists: ${error}`);
  }
};

exports.getAllUsers = async function (req, res) {
  try {
    const allUsers = await users.find().exec();
    res.status(200).json({ users: allUsers });
  } catch (error) {
    handleError(res, 500, `Error getting all users: ${error}`);
  }
};

exports.getAllMusics = async function (req, res) {
  try {
    const allMusics = await musics.find().exec();
    res.status(200).json({ musics: allMusics });
  } catch (error) {
    handleError(res, 500, `Error getting all musics: ${error}`);
  }
};

exports.deleteAllUsers = async function (req, res) {
  try {
    //await users.deleteMany({});
    res.status(204).end();
  } catch (error) {
    handleError(res, 500, `Error deleting all users: ${error}`);
  }
};

exports.deleteAllMusics = async function (req, res) {
  try {
    //await musics.deleteMany({});
    res.status(204).end();
  } catch (error) {
    handleError(res, 500, `Error deleting all musics: ${error}`);
  }
};

exports.deleteAllPlaylists = async function (req, res) {
  try {
    //await playlists.deleteMany({});
    res.status(204).end();
  } catch (error) {
    handleError(res, 500, `Error deleting all playlists: ${error}`);
  }
};
