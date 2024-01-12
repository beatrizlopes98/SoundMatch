const bcrypt = require("bcrypt");

const { handleError } = require("../Services/error");
const users = require("../Models/user").users;
const musics = require("../Models/music").musics;

const saltRounds = 10;

exports.getUserProfile = async function (req, res) {
  try {
    const user = await users.findOne({ email: req.user });

    if (!user) {
      return handleError(res, 404, "User not found");
    }

    if (user.email !== req.user) {
      return handleError(
        res,
        403,
        "Forbidden: You can only view your own profile"
      );
    }

    res.status(200).json({ user });
  } catch (error) {
    handleError(res, 500, `Error getting user profile: ${error}`);
  }
};

exports.editUserProfile = async function (req, res) {
  try {
    const { name, password } = req.body;

    const user = await users.findOne({ email: req.user });

    if (!user) {
      return handleError(res, 404, "User not found");
    }

    if (user.email !== req.user) {
      return handleError(
        res,
        403,
        "Forbidden: You don't have permission to edit this profile"
      );
    }

    if (name !== undefined) {
      user.name = name;
    }

    // if (email !== undefined) {
    //   const existingUser = await users.findOne({
    //     email,
    //     _id: { $ne: user._id },
    //   });
    //   if (existingUser) {
    //     return handleError(res, 406, "Email already in use");
    //   }
    //   user.email = email;
    // }

    if (password !== undefined) {
      const hashedPassword = bcrypt.hashSync(password, saltRounds);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    handleError(res, 500, `Error editing user profile: ${error}`);
  }
};

exports.addMusicToSeen = async function (req, res) {
  try {
    const { musicId } = req.params;

    //TODO Impement when music is implemented
    // const foundMusic = await musics.findById(musicId).exec();
    // if (!foundMusic) {
    //   return handleError(res, 404, "Music not found");
    // }

    const user = await users.findOne({ email: req.user });

    if (!user) {
      return handleError(res, 404, "User not found");
    }

    if (!user.seens.includes(musicId)) {
      user.seens.push(musicId);
      await user.save();
    }

    res.status(200).json({ user });
  } catch (error) {
    handleError(res, 500, `Error adding music to seen: ${error}`);
  }
};

exports.addMusicToLikes = async function (req, res) {
  try {
    const { musicId } = req.params;

    //TODO Impement when music is implemented
    // const foundMusic = await musics.findById(musicId).exec();
    // if (!foundMusic) {
    //   return handleError(res, 404, "Music not found");
    // }

    const user = await users.findOne({ email: req.user });

    if (!user) {
      return handleError(res, 404, "User not found");
    }

    const musicIndex = user.likes.indexOf(musicId);

    if (musicIndex === -1) {
      user.likes.push(musicId);
    } else {
      user.likes.splice(musicIndex, 1);
    }

    await user.save();

    res.status(200).json({ user });
  } catch (error) {
    handleError(
      res,
      500,
      `Error adding/removing music to/from likes: ${error}`
    );
  }
};
