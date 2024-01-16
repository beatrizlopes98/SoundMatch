const spotify = require("../Services/spotify");
const { handleError } = require("../Services/error");

const { playlists } = require("../Models/playlist");
const { users } = require("../Models/user"); // Add this line
const { musics } = require("../Models/music"); // Add this line

exports.getSpotifyPlaylists = async function (req, res) {
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
            : "https://static.thenounproject.com/png/1459221-200.png",
          externalUrl: playlist.external_urls.spotify,
          spotifyId: playlist.id,
          userId: user._id,
        };

        playlistsToSave.push(playlistToSave);
      }
    }

    if (playlistsToSave.length > 0) {
      const savedPlaylists = await playlists.insertMany(playlistsToSave);

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

exports.getSpotifyPlaylistById = async function (req, res) {
  const user = await users.findOne({ email: req.user });

  try {
    const { playlistId } = req.params;

    const existingPlaylist = await playlists.findOne({
      spotifyId: playlistId,
      userId: user._id,
    });

    const spotifyPlaylist = await spotify.getPlaylistById(
      playlistId,
      req.spotifyPayload.data.user.access_token
    );

    if (existingPlaylist) {
      existingPlaylist.title = spotifyPlaylist.name;
      existingPlaylist.imageCover = spotifyPlaylist.images[0]
        ? spotifyPlaylist.images[0].url
        : "https://static.thenounproject.com/png/1459221-200.png";
      existingPlaylist.externalUrl = spotifyPlaylist.external_urls.spotify;

      await existingPlaylist.save();
    } else {
      const playlistToSave = {
        music: [],
        title: spotifyPlaylist.name,
        imageCover: spotifyPlaylist.images[0]
          ? spotifyPlaylist.images[0].url
          : "..&#x2F;assets&#x2F;sound.png",
        externalUrl: spotifyPlaylist.external_urls.spotify,
        spotifyId: playlistId,
        userId: user._id
      };

      const savedPlaylist = await playlists.create(playlistToSave);
      existingPlaylist = savedPlaylist;
    }

    for (const item of spotifyPlaylist.tracks.items) {
      const track = item.track;

    //   console.log(track.artists.id)
    //   console.log(track.artists.name)
    //   console.log(track.artists.genres)

      const musicDetails = {
        name: track.name,
        artist: track.artists.map((artist) => artist.name).join(", "),
        album: track.album.name,
        imageURL: track.album.images[0] ? track.album.images[0].url : null,
        previewURL: track.preview_url,
        duration: track.duration_ms,
        genres: track.artists.reduce((acc, artist) => {
          if (artist.genres && artist.genres.length > 0) {
            acc.push(...artist.genres);
          }
          return acc;
        }, []),
        spotifyId: track.id,
      };
      

      //console.log(musicDetails)

      const existingMusic = await musics.findOne({
        spotifyId: musicDetails.spotifyId,
      });
      if (!existingMusic) {
        await musics.create(musicDetails);
      }

      if (!existingPlaylist.music.includes(musicDetails.spotifyId)) {
        existingPlaylist.music.push(musicDetails.spotifyId);
      }
    }

    await existingPlaylist.save();

    res.status(200).json({ playlist: existingPlaylist });
  } catch (error) {
    handleError(
      res,
      500,
      `Error getting and saving Spotify playlist: ${error.message}`
    );
  }
};
