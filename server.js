
const express = require('express');
const ytdl = require('ytdl-core');

const app = express();
const PORT = 3000;

// Endpoint to stream audio from YouTube
app.get('/audio', async (req, res) => {
  const videoUrl = req.query.url; // YouTube video URL passed as a query parameter

  if (!videoUrl) {
    return res.status(400).send('Please provide a YouTube video URL.');
  }

  try {
    const info = await ytdl.getInfo(videoUrl);
    const format = ytdl.chooseFormat(info.formats, { quality: 'lowestaudio' });

    if (format) {
      res.setHeader('Content-Type', 'audio/webm'); // or 'audio/mp4' depending on format
      ytdl(videoUrl, { format }).pipe(res);
    } else {
      res.status(404).send('Audio format not found.');
    }
  } catch (error) {
    res.status(500).send('Error fetching YouTube audio stream.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
