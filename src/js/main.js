import Conf from './_config';
import Star from './_star';
import Dot from './_dot';
window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
let isMobile = !!navigator.userAgent.match(/AppleWebKit.*Mobile.*/);
class App {
    constructor(id = 'j-canvas') {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = document.documentElement.clientWidth;
        this.canvas.height = document.documentElement.clientHeight;
        this.stars = [];
        this.dots = [];
        this.animateId = null;
        for (let i = 0; i < Conf.star.max_num; i++) { //创建星星背景
            this.stars.push(
                new Star({
                    id: i,
                    ctx: this.ctx,
                    x: Math.floor(Math.random() * this.canvas.width),
                    y: Math.floor(Math.random() * this.canvas.height),
                    r: Math.floor(Math.random() * Conf.star.max_r)
                })
            )
        }
        this.moveEvent();
        this.animate();
    }
    stopAnimate() {
        cancelAnimationFrame(this.animateId)
        this.animateId = null;
    }
    clear() {
        let context = this.ctx;
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    animate() {
        this.clear();
        for (let i in this.stars) {
            this.stars[i].move();
        }
        for (let i in this.dots) {
            this.dots[i].move();
            this.linkDots(this.dots[i])
        }
        this.animateId = requestAnimationFrame(() => this.animate());
    }
    drawDots(obj) {
        obj = Object.assign({
            id: this.dots.length,
            ctx: this.ctx,
            x: Math.floor(Math.random() * this.canvas.width / 2),
            y: Math.floor(Math.random() * this.canvas.height / 2),
            r: Math.floor(Math.random() * Conf.dot.max_r)
        }, obj);
        this.dots.push(
            new Dot({
                id: obj.id,
                ctx: this.ctx,
                x: obj.x,
                y: obj.y,
                r: Math.floor(Math.random() * Conf.dot.max_r)
            })
        )
    }
    moveEvent() {
        if (!isMobile) {
            document.addEventListener('mousemove', (e) => {
                if (this.dots.length > 0 && !this.dots[this.dots.length - 1].show) {
                    this.dots = [];
                }
                let mouseX = e.clientX + Math.random() * Conf.dot.max_gap;
                let mouseY = e.clientY + Math.random() * Conf.dot.max_gap;
                this.drawDots({ x: mouseX, y: mouseY })
            })
        } else {
            document.addEventListener('touchmove', (e) => {
                e.preventDefault();
                if (this.dots.length > 0 && !this.dots[this.dots.length - 1].show) {
                    this.dots = [];
                }
                let mouseX = e.touches[0].pageX + Math.random() * Conf.dot.max_gap;
                let mouseY = e.touches[0].pageY + Math.random() * Conf.dot.max_gap;
                this.drawDots({ x: mouseX, y: mouseY })
            })
        }


    }
    getPreviousDot(id, stepback) {
        if (id == 0 || id - stepback < 0) {
            return false
        }
        if (typeof this.dots[id - stepback] !== "undefined" && this.dots[id - stepback].show) {
            return this.dots[id - stepback]
        } else {
            return false
        }
    }
    linkDots(dot) {
        var ctx = this.ctx;
        if (dot.conf.id == 0) return false;
        var previousDot1 = this.getPreviousDot(dot.conf.id, 1);
        var previousDot2 = this.getPreviousDot(dot.conf.id, 2);
        var previousDot3 = this.getPreviousDot(dot.conf.id, 3);
        var previousDot4 = this.getPreviousDot(dot.conf.id, 4);
        if (!previousDot1) return false;
        ctx.strokeStyle = Conf.dot.linkColor;
        ctx.moveTo(previousDot1.conf.x, previousDot1.conf.y);
        ctx.beginPath();
        ctx.lineTo(dot.conf.x, dot.conf.y);
        if (previousDot2) ctx.lineTo(previousDot2.conf.x, previousDot2.conf.y);
        if (previousDot3) ctx.lineTo(previousDot3.conf.x, previousDot3.conf.y);
        if (previousDot4) ctx.lineTo(previousDot4.conf.x, previousDot4.conf.y);
        ctx.stroke();
        ctx.closePath();
    }
    drawPolygon(n = 3) { //这个是我测试画一个多边形的方法，仅供我测试用
        this.stopAnimate();
        let context = this.ctx;
        let [dx, dy, s] = [150, 150, 100]; //中心点和半径
        context.beginPath();
        context.fillStyle = 'white';
        context.strokeStyle = '#fff';
        var dig = 2 * Math.PI / n;
        for (var i = 0; i < n; i++) {
            context.lineTo(dx + Math.sin(i * dig) * s, dy + Math.cos(i * dig) * s);
        }
        context.closePath();
        context.stroke();
    }
}
window.app = new App();