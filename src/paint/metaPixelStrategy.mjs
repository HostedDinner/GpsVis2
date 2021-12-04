import PaintStrategy from "./paintStrategy.mjs";

class MetaPixelStrategy extends PaintStrategy {

    constructor(config) {
        super(config);

        this.pixelWidth = config.metaPixel.width;
        this.pixelSpacing = config.metaPixel.spacing;
    }
    
    getMetaPixel(point) {
        const width = this.pixelSpacing + this.pixelWidth;

        const x = Math.floor(point.x / width);
        const y = Math.floor(point.y / width);

        return {x, y};
    };

    getMetaPixelCoords(metaPixel) {
        const width = this.pixelSpacing + this.pixelWidth;
        
        const x = (metaPixel.x * width) + this.pixelSpacing;
        const y = (metaPixel.y * width) + this.pixelSpacing;
        return {x, y};
    };
    
    paint(tracks, ctx) {
        ctx.fillStyle = this.config.strokeColor;

        tracks.forEach((track) => {
            let lastMetaPixel = null;

            for(let i = 0; i < track.length; i++) {
                const point = track[i];
                const metaPixel = this.getMetaPixel(point);

                if(
                    lastMetaPixel != null
                    && metaPixel.x === lastMetaPixel.x
                    && metaPixel.y === lastMetaPixel.y
                ) {
                    continue;
                } else {
                    const coords = this.getMetaPixelCoords(metaPixel);
                    ctx.fillRect(coords.x, coords.y, this.pixelWidth, this.pixelWidth);
                    lastMetaPixel = metaPixel;
                }
            };
        });
    };
};

export default MetaPixelStrategy;