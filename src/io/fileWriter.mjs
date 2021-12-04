import fs from 'fs';
import path from 'path';
import { getRootDir } from './fileUtils.mjs';

const writePNG = function(filename, canvas) {
    const filePath = path.join(getRootDir(), filename);
    const out = fs.createWriteStream(filePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => console.log(`Saved ${filename}`));
};

export { writePNG };