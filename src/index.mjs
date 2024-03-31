import canvas from 'canvas';
import { mergeDefaultConfig, modes } from './conf/config.mjs';
import GpxParser from './gpx/gpxParser.mjs';
import { loadJSON, getTimestampFilename } from './io/fileUtils.mjs';
import { writePNG } from './io/fileWriter.mjs';
import LineStrategy from './paint/lineStrategy.mjs';
import MetaPixelStrategy from './paint/metaPixelStrategy.mjs';
import PaintStrategy from './paint/paintStrategy.mjs';
import PixelStrategy from './paint/pixelStrategy.mjs';
const { createCanvas } = canvas;

let userConfig = loadJSON('config.json');
if(userConfig == null) {
  userConfig = {};
}

const config = mergeDefaultConfig(userConfig);

const gpxParser = new GpxParser(config.mapWidth, config.padding);

console.log('Parse files...');
await gpxParser.parseFiles('./input/');
console.log(`Parsed ${gpxParser.numberOfTracks} Tracks in ${gpxParser.numberOfFiles} files.`);

const width = gpxParser.mapWidth;
const height = gpxParser.mapHeight;

console.log('Size of the picture: ' + width + 'x' + height);

const cvs = createCanvas(width, height);
const ctx = cvs.getContext('2d');

ctx.fillStyle = config.backgroundColor;
ctx.fillRect(0, 0, cvs.width, cvs.height);

let paintStrategy;
switch(config.mode) {
  case modes.line:
    paintStrategy = new LineStrategy(config);
    break;
  case modes.pixel:
    paintStrategy = new PixelStrategy(config);
    break;
  case modes.metaPixel:
    paintStrategy = new MetaPixelStrategy(config);
    break;
  default:
    paintStrategy = new PaintStrategy(config);
}

paintStrategy.paint(gpxParser.tracks, ctx);

writePNG(`./output/${getTimestampFilename()}.png`, cvs);