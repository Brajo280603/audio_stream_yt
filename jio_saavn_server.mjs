
import express from 'express'
import crypto from 'crypto';
const app = express();
const PORT = 3000;


import {Readable} from 'stream'

// Endpoint to stream audio from YouTube
app.get('/audioStream', async (req, res) => {
  const videoUrl = req.query.url; // YouTube video URL passed as a query parameter

  if (!videoUrl) {
    return res.status(400).send('Please provide a valid URL.');
  }

  try {
    let output= await fetch(videoUrl)

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

app.get('/songDetails',async(req,res)=>{
    const id = req.query.id;
    

    console.log(JSON.stringify(req.query))

    let res_text = await fetch(`https://www.jiosaavn.com/api.php?__call=song.getDetails&cc=in&_marker=0%3F_marker%3D0&_format=json&pids=${id}`)

    res_text = await res_text.json()

    res_text = res_text[id]

    



    res.send(res_text)
})

app.get('/search',async(req,res)=>{
  const query = req.query.q; 

  let res_text = await fetch(`https://www.jiosaavn.com/api.php?__call=autocomplete.get&_format=json&_marker=0&cc=in&includeMetaTags=1&query=${query}`)

  res_text = await res_text.json()
  res.send(res_text)
})

app.get('/albumDetails',async(req,res)=>{

})

app.get('/playlistDetails',async(req,res)=>{

})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



function decryptUrl(url,quality='Good') {
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
