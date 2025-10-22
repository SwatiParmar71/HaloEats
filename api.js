import fs from 'fs';
import open from 'open';
fetch('https://api.freeapi.app/api/v1/public/randomusers')
  .then(res => res.json())     // convert response to JS
  .then(res => {
    console.log("JSON data:", res);
  })
  .catch(err => console.error("Error Message:", err));

async function downloadAndShow() {
  try {
    const res = await fetch('https://picsum.photos/200');
    const buffer = await res.arrayBuffer();

    const filename = 'random-image.jpg';
    fs.writeFileSync(filename, Buffer.from(buffer));
    console.log('✅ Image downloaded:', filename);

    await open(filename);
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

downloadAndShow();



