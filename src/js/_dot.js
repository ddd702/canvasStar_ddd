 import Conf from './_config'
class Dot{
	constructor(obj){
		this.show=true;
		this.conf=Object.assign({
			x:0,
			y:0,
			r:Conf.dot.max_r,//半径
			R:255,
			G:255,
			B:255,
			Alpha:1,
			v:1,
			shadowColor:'#fff',
			ctx:null
		},obj);
		this.conf.Alpha=this.conf.r/(Conf.dot.max_r-1)>0?this.conf.r/(Conf.dot.max_r-1):0.5;//越大的星星透明度也大
		if (!this.conf.ctx) {
			console.error('必需传入ctx参数');
			return false;
		}
		if (this.conf.r<Conf.dot.min_r) {
			this.conf.r=Conf.dot.min_r
		}
		this.move_angle=(Math.random()*Conf.dot.max_angle)
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
		if (!this.show) {
			return false;
		}
		this.conf.ctx.drawImage(this.cacheCanvas, this.conf.x-this.conf.r * 3, this.conf.y-this.conf.r * 3);
	}
	remove(){
		this.show=false;
	}
	move(){
        if (this.conf.Alpha <= 0) {
            this.remove();
            return false;
        }else{
        	this.conf.x+=Conf.dot.move_max_distance*Math.cos(this.move_angle);
			this.conf.y-= Conf.dot.move_max_distance*Math.sin(this.move_angle);
			this.conf.Alpha-=Conf.dot.a_reduce;
			this.conf.v+=0.1;
			this.conf.v=this.conf.v>3?3:this.conf.v;
        	this.draw();
        }
        
	}

}
export default Dot;