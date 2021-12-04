import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const pad = function(number) {
    if (number < 10) {
        return '0' + number;
    }
    return '' + number;
};

const getRootDir = function() {
    const __filename = fileURLToPath(import.meta.url);
    return path.join(path.dirname(__filename), '../..');
};

const getTimestampFilename = function(date) {
    if(date == null) {
        date = new Date();
    }

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}_${pad(date.getMinutes())}_${pad(date.getSeconds())}`;
};

const loadJSON = function(filename) {
    const fullFilename = path.join(getRootDir(), filename);
    const stat = fs.statSync(fullFilename, {throwIfNoEntry: false});

    if(stat !== undefined && stat.isFile()) {
        const rawData = fs.readFileSync(fullFilename);
        return JSON.parse(rawData);
    } else {
        return null;
    }
};

export { getRootDir, getTimestampFilename, loadJSON };