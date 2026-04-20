const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  title: String,
  artist: String,
  album: String,
  duration: Number,
  coverUrl: String,
  audioUrl: String,
});

const playlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tracks: [trackSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Playlist', playlistSchema);
