
import express from 'express'
import crypto from 'crypto';
const app = express();
const PORT = 3000;

import {DOMParser , parseHTML, toJSON} from 'linkedom'

import {Readable} from 'stream'

// Endpoint to stream audio from YouTube
app.get('/audio', async (req, res) => {
  const videoUrl = req.query.url; // YouTube video URL passed as a query parameter

  if (!videoUrl) {
    return res.status(400).send('Please provide a YouTube video URL.');
  }

  try {
    let output= await fetch('https://aac.saavncdn.com/113/e45f070840651198253b3170b556d802_12.mp4')

    output = output.body    
    if (output) {
      res.setHeader('Content-Type', 'audio/mp4'); // or 'audio/mp4' depending on format

        console.log(output)
        
        output = Readable.fromWeb(output)
        output.pipe(res)
        
    } else {
      res.status(404).send('Audio format not found.');
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error fetching YouTube audio stream.');
  }
});

app.get('/',async (req,res)=>{
    let output = await fetch('https://www.jiosaavn.com/featured/english-india-superhits-top-50/aXoCADwITrUCObrEMJSxEw__')

    output = await output.text();
    console.log(output)
    res.send(output)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



function decryptUrl(url,quality) {
    const key = Buffer.from('38346591', 'utf-8');
    const iv = Buffer.alloc(8, 0); // Equivalent to b"\0\0\0\0\0\0\0\0"
    const decipher = crypto.createDecipheriv('DES-ECB', key, iv);
    decipher.setAutoPadding(true);
    
    const encUrl = Buffer.from(url.trim(), 'base64');
    let decUrl = Buffer.concat([decipher.update(encUrl), decipher.final()]).toString('utf-8');
    
    //this was for audio quality
    quality_options = {
        'Low':'_12.mp4',
        'Fair':'_48.mp4',
        'Good':'_96.mp4',
        'Best':'_160.mp4',
        'Extreme':'_320.mp4',
    }
    decUrl = decUrl.replace("_96.mp4", quality_options[quality]);
    return decUrl;
}

export default decryptUrl;
