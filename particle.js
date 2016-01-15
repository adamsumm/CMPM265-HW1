"use strict";
class Particle{
    constructor(xx, yy, vx, vy,game) {
        this.xx = xx;
        this.yy = yy;
        this.vx = vx;
        this.vy = vy;
        this.ax = 0;
        this.ay = 9;
        this.life = 5;
        this.lifetime = this.life;
        this.game = game;
        this.sprite = game.add.sprite(xx, yy, 'spark');
        this.sprite.visible = false;
    }
    update(dt){
        this.vx += this.ax*dt;
        this.vy += this.ay*dt;
        this.xx += this.vx*dt;
        this.yy += this.vy*dt;
        this.sprite.x = this.xx;
        this.sprite.y = this.yy;
        this.lifetime -= dt;
        this.sprite.alpha *= 0.99;
        this.sprite.rotation = 2*Math.PI-Math.atan2(this.vx,this.vy);
    }
    render(){
      //  this.game.context.fillStyle = 'rgb(255,255,255)';
    //    this.game.context.fillRect(this.xx, this.yy, 1, 1);
    }
}
class Attractor{
    constructor(xx,yy,strength){
        this.xx = xx;
        this.yy = yy;
        this.strength = strength;
    }
}
class ParticleEmitter{
    constructor(xx,yy,rate,anglemin,anglemax,minvel,maxvel,minlife,maxlife,initialAmount,game,color){
        this.xx = xx;
        this.yy = yy;
        this.rate = rate;
        this.period = 1.0/rate;
        this.anglemin = anglemin;
        this.anglemax = anglemax;
        this.activeParticles = [];
        this.pooledParticles = [];
        this.timeSinceLastParticle = 0;
        this.game = game;
        this.maxvel = maxvel;
        this.minvel = minvel;
        this.minlife = minlife;
        this.maxlife = maxlife;
        this.color = color;
        for (var ii = 0; ii < initialAmount; ii++){
            this.pooledParticles.push(new Particle(0,0,0,0,game));
        }
        console.log((this.period));
    }
    update(dt){
        this.timeSinceLastParticle += dt;
        while(this.timeSinceLastParticle > 0){
            this.timeSinceLastParticle -= this.period;
            if (this.pooledParticles.length > 0){
                var particle = this.pooledParticles.shift();
            }
            else { 
                var particle = new Particle(0,0,0,0,this.game);
            }
            particle.xx = this.xx;
            particle.yy = this.yy;
            var life = Math.random() * (this.maxlife - this.minlife) + this.minlife;
            
            var angle = Math.random() * (this.anglemax - this.anglemin) + this.anglemin;
            var speed = Math.random() * (this.maxvel - this.minvel) + this.minvel;
            particle.vx = Math.cos(angle)*speed;
            particle.vy = Math.sin(angle)*speed;
            particle.lifetime = life;
            particle.sprite.visible = true;
            particle.sprite.tint = this.color;
            particle.sprite.alpha = 1.0;
            this.activeParticles.push(particle);
        }
        for (var ii = 0; ii < this.activeParticles.length; ii++){
            this.activeParticles[ii].update(dt);
            if (this.activeParticles[ii].lifetime <= 0){
                this.pooledParticles.push(this.activeParticles[ii]);
                this.activeParticles[ii].visible = false;
                this.activeParticles.splice(ii, 1);
                
            }
        }
    }
}