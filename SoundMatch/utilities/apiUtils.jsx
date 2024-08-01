import axios from 'axios';

const handleAddPlaylist = async (playlistTitle, token) => {
  try {
    const response = await axios.post(
      'https://soundmatch-api.onrender.com/playlist/create',
      {
        title: playlistTitle,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Additional logic if needed

    return response.data;
  } catch (error) {
    console.log('Error adding a new playlist:', error);
    throw error;
  }
};

export { handleAddPlaylist };
