import PaintStrategy from "./paintStrategy.mjs";

class LineStrategy extends PaintStrategy {
    paint(tracks, ctx) {
        ctx.strokeStyle = this.config.strokeColor;
        
        tracks.forEach((track) => {
            if(track.length > 1) {
                ctx.beginPath();
                ctx.moveTo(track[0].x, track[0].y);
            
                for(let i = 1; i < track.length; i++) {
                    ctx.lineTo(track[i].x, track[i].y);
                }
            
                ctx.stroke();
                ctx.closePath();
            }
        });
    };
};

export default LineStrategy;