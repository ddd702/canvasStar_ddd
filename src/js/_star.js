import Conf from './_config';
class Star{
	constructor(obj){
		this.conf=Object.assign({
			x:0,
			y:0,
			r:Conf.star.max_r,//星星半径
			R:255,
			G:255,
			B:255,
			Alpha:1,
			shadowColor:'#fff',
			ctx:null
		},obj);
		if (!this.conf.ctx) {
			console.error('必需传入ctx参数');
			return false;
		}
		this.conf.Alpha=this.conf.r/(Conf.star.max_r-1);//越大的星星透明度也大
		this.cacheCanvas = document.createElement("canvas");
        this.cacheCtx = this.cacheCanvas.getContext("2d");
        this.cacheCtx.width = 6 * this.conf.r;
        this.cacheCtx.height = 6 * this.conf.r;
        this.cache();
        this.draw();
	}
	cache(){
	    this.cacheCtx.save();
        this.cacheCtx.fillStyle = `rgba(${this.conf.R},${this.conf.G},${this.conf.B},${this.conf.Alpha})`;
        this.cacheCtx.shadowColor = this.conf.shadowColor;
        this.cacheCtx.shadowBlur = this.conf.r*2;
        this.cacheCtx.beginPath();
        this.cacheCtx.arc(this.conf.r * 3, this.conf.r * 3, this.conf.r, 0, 2 * Math.PI);
        this.cacheCtx.closePath();
        this.cacheCtx.fill();
        this.cacheCtx.restore();
	}
	draw(){
		this.conf.ctx.drawImage(this.cacheCanvas, this.conf.x, this.conf.y);
	}
	move(){
		this.conf.y -= Conf.star.move_distance;
        if (this.conf.y <= -10) {
            this.conf.y += this.conf.ctx.canvas.height + 10;
        }
        this.draw();
	}

}
export default Star;