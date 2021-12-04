import PaintStrategy from "./paintStrategy.mjs";

class PixelStrategy extends PaintStrategy {
    paint(tracks, ctx) {
        ctx.fillStyle = this.config.strokeColor;

        tracks.forEach((track) => {
            track.forEach((point) => {
                ctx.fillRect(point.x, point.y, 1, 1);
            });
        });
    };
};

export default PixelStrategy;