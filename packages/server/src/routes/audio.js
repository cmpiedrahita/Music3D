const router = require('express').Router();
const fetch = require('node-fetch');

// Proxy para evitar CORS en URLs de audio externas
router.get('/proxy', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ message: 'URL required' });

  try {
    const response = await fetch(url);
    if (!response.ok) return res.status(502).json({ message: 'Failed to fetch audio' });

    res.setHeader('Content-Type', response.headers.get('content-type') || 'audio/mpeg');
    res.setHeader('Access-Control-Allow-Origin', '*');
    response.body.pipe(res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
