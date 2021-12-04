import fs from 'fs';
import path from 'path';
import { transform } from 'camaro';
import { getRootDir } from '../io/fileUtils.mjs';

class Point {
    constructor(parser, x, invY) {
        this.parser = parser;
        this._x = x;
        this.invY = invY;
    }

    get x() {
        return Math.round(this.parser.padding + this._x);
    }

    get y() {
        return Math.round(this.parser.padding + (this.parser.maxY - this.invY));
    }
}

class MinMaxCoords {
    constructor() {
        this.minLat = 180;
        this.maxLat = -180;
        this.minLon = 180;
        this.maxLon = -180;
    }

    add(lat, lon) {
        if(lat < this.minLat) {
            this.minLat = lat;
        }
        if(lat > this.maxLat) {
            this.maxLat = lat;
        }
        if(lon < this.minLon) {
            this.minLon = lon;
        }
        if(lon > this.maxLon) {
            this.maxLon = lon;
        }
        return this;
    }

    get deltaLon() {
        return this.maxLon - this.minLon;
    }
}

class GpxParser {
    mapWidth = 0;
    padding = 0;

    #minMaxValues = new MinMaxCoords();
    #rawTracks = [];

    #dirty = false;
    #tracks = [];
    #maxY = 0;
    #numberOfFiles = 0;

    constructor(mapWidth, padding) {
        this.mapWidth = mapWidth;
        this.padding = padding;
    };

    async #parseFile(filename) {
        this.#dirty = true;
        this.#numberOfFiles++;

        const xml = fs.readFileSync(filename, 'utf-8');

        const template = [
            'gpx/trk/trkseg', {
                'points': ['trkpt', {
                    lat: '@lat',
                    lon: '@lon'//,
                    //ele: 'ele'
                }]
            }
        ];

        const transformed = await transform(xml, template);

        transformed.forEach((trackObj) => {
            // find the min/max values
            const rawTrack = trackObj.points;
            rawTrack.reduce((acc, cur) => {
                return acc.add(cur.lat, cur.lon);
            }, this.#minMaxValues);

            this.#rawTracks.push(rawTrack);
        });
    };

    async parseFiles(pathFromRoot) {
        const folderName = path.join(getRootDir(), pathFromRoot);
        
        let promises = [];

        fs.readdirSync(folderName, {withFileTypes: true}).forEach(file => {
            if(file.isFile() && file.name.endsWith('.gpx')) {
                promises.push(this.#parseFile(path.join(folderName, file.name)));
            }
        });

        return Promise.all(promises);
    };

    get maxY() {
        if(this.#dirty) {
            this.transformData();
        }

        return this.#maxY;
    }

    get mapHeight() {
        if(this.#dirty) {
            this.transformData();
        }

        return this.#maxY + (2 * this.padding);
    }

    get tracks() {
        if(this.#dirty) {
            this.transformData();
        }

        return this.#tracks;
    }

    get numberOfTracks() {
        return this.#rawTracks.length;
    }

    get numberOfFiles() {
        return this.#numberOfFiles;
    }

    transformData() {
        this.#tracks = [];
        this.#maxY = 0;

        this.#rawTracks.forEach((track) => {
            const points = track.map((coord) => {
                return this.coordinateToPoint(coord);
            });

            this.#tracks.push(points);
        });

        this.#dirty = false;
    };

    coordinateToPoint(coordinate){
        const totalWidth = this.mapWidth - (2 * this.padding);
        
        const deltaLon = this.#minMaxValues.deltaLon;

        const worldMapWidth = ((totalWidth / deltaLon) * 360) / (2 * Math.PI);

        const latRad = coordinate.lat * Math.PI / 180;
        const minLatRad = this.#minMaxValues.minLat * Math.PI / 180;

        const mapOffsetY = (worldMapWidth / 2 * Math.log((1 + Math.sin(minLatRad)) / (1 - Math.sin(minLatRad))));

        const x = Math.round((coordinate.lon - this.#minMaxValues.minLon) * (totalWidth / deltaLon));
        const invY = Math.round((worldMapWidth / 2 * Math.log((1 + Math.sin(latRad)) / (1 - Math.sin(latRad)))) - mapOffsetY);

        // actually modifiing the state in a calc/getter is dirty...
        if(this.#dirty) {
            if(invY > this.#maxY) {
                this.#maxY = invY;
            }
        }

        return new Point(this, x, invY);
    };
};

export default GpxParser;