const router = require('express').Router();
const fetch = require('node-fetch');

router.get('/proxy', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ message: 'URL required' });

  try {
    const headers = {};
    if (req.headers.range) headers['Range'] = req.headers.range;

    const response = await fetch(url, { headers });
    if (!response.ok && response.status !== 206) 
      return res.status(502).json({ message: 'Failed to fetch audio' });

    res.status(response.status);
    res.setHeader('Content-Type', response.headers.get('content-type') || 'audio/mpeg');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (response.headers.get('content-length'))
      res.setHeader('Content-Length', response.headers.get('content-length'));
    if (response.headers.get('content-range'))
      res.setHeader('Content-Range', response.headers.get('content-range'));
    if (response.headers.get('accept-ranges'))
      res.setHeader('Accept-Ranges', response.headers.get('accept-ranges'));

    response.body.pipe(res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
