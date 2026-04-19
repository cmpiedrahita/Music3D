const router = require('express').Router();
const Playlist = require('../models/Playlist');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  const playlists = await Playlist.find({ owner: req.user.id });
  res.json(playlists);
});

router.post('/', async (req, res) => {
  try {
    const playlist = await Playlist.create({ ...req.body, owner: req.user.id });
    res.status(201).json(playlist);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user.id });
  if (!playlist) return res.status(404).json({ message: 'Not found' });
  res.json(playlist);
});

router.post('/:id/tracks', async (req, res) => {
  const playlist = await Playlist.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    { $push: { tracks: req.body } },
    { new: true }
  );
  if (!playlist) return res.status(404).json({ message: 'Not found' });
  res.json(playlist);
});

router.delete('/:id/tracks/:trackId', async (req, res) => {
  const playlist = await Playlist.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    { $pull: { tracks: { _id: req.params.trackId } } },
    { new: true }
  );
  if (!playlist) return res.status(404).json({ message: 'Not found' });
  res.json(playlist);
});

router.delete('/:id', async (req, res) => {
  await Playlist.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  res.json({ message: 'Deleted' });
});

module.exports = router;
