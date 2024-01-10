const { handleError } = require("../Services/error");
const { musics } = require("../Models/music").musics; // Updated import

exports.addSeenMusic = async function (req, res) {
  try {
    const { musicId } = req.params;
    const user = req.user; // Assuming the user information is stored in req.user

    // Check if the musicId is valid
    const foundMusic = await musics.findById(musicId).exec();
    if (!foundMusic) {
      return handleError(res, 404, "Music not found");
    }

    // Add the musicId to the user's seen list
    user.seens.push(musicId);

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Music added to seen list" });
  } catch (error) {
    handleError(res, 500, `Error adding seen music: ${error}`);
  }
};

exports.addLikedMusic = async function (req, res) {
  try {
    const { musicId } = req.params;
    const user = req.user; // Assuming the user information is stored in req.user

    // Check if the musicId is valid
    const foundMusic = await musics.findById(musicId).exec();
    if (!foundMusic) {
      return handleError(res, 404, "Music not found");
    }

    // Add the musicId to the user's liked list
    user.likes.push(musicId);

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Music added to liked list" });
  } catch (error) {
    handleError(res, 500, `Error adding liked music: ${error}`);
  }
};
