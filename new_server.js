const express = require('express');
const ytdl = require('@distube/ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const { PassThrough } = require('stream');

const app = express();

app.get('/audio', async (req, res) => {
  const videoUrl = req.query.url; // YouTube video URL passed as a query parameter
  console.log(videoUrl)
  if (!videoUrl) {
    return res.status(400).send('Please provide a YouTube video URL.');
  }

  try {
    const info = await ytdl.getInfo(videoUrl);
    const format = ytdl.chooseFormat(info.formats, { quality: 'lowestaudio' });
    // console.log(info)
    if (format) {
      const audioStream = ytdl(videoUrl, { format });
      const convertedStream = new PassThrough();

      ffmpeg(audioStream)
        .audioFrequency(48000) // Low sample rate (lowest = 8000)
        .audioBitrate(64) // Low bitrate (lowest = 16)
        .audioChannels(2) // Stereo audio
        .format('webm') // Output format
        .on('start', (commandLine) => {
          console.log('Spawned FFmpeg with command: ' + commandLine);
          res.setHeader('Content-Type', 'audio/webm');
        })
        .on('error', (err, stdout, stderr) => {
          console.error('Error processing audio with FFmpeg:', err.message);
          console.error('FFmpeg stdout:', stdout);
          console.error('FFmpeg stderr:', stderr);
          if (!res.headersSent) {
            res.status(500).send('Error processing audio stream.');
          }
        })
        .on('end', () => {
          console.log('Processing finished!');
        })
        .pipe(convertedStream);

      convertedStream.pipe(res);
    } else {
      res.status(404).send('Audio format not found.');
    }
  } catch (error) {
    console.error('Error fetching YouTube audio stream:', error);
    res.status(500).send('Error fetching YouTube audio stream.');
  }
});


app.get("/",async (req,res)=>{
  let output = await fetch("https://charts.youtube.com/charts/TopVideos/global/daily");

  output = await output.text();
  console.log(output)

  res.send(output);
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
