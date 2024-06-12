// import canvas context
import {context} from "./game.js"

// export class so it can be used in other files 
export class Chomper {

    // constructor takes position and velocity as arguments, arguments are provided as objects with x and y properties in gmae.js

    constructor({pos, vel}){

        //assign arguments to the class variables 
        this.pos = pos;
        this.vel = vel;

        // radius of the chomper, determines the size
        this.radius = 11;

        // 2 lives by default 
        this.lives = 2

        // movement not restricted by default 
        this.movementRestricted = false

        // animation related variables 
        this.rad = 0.8
        this.openRate = 0.05
        this.rotation = 0

        //score keeps track of the users score
        this.score = 0
    }


    // draws chomper on the canvas
    drawChomper(){

        // save the current state
        context.save()

        // animate the chomper to open and close his mouth
        //move to current x and y coordinates of chomper 
        context.translate(this.pos.x, this.pos.y)

        // rotate canvas accordingly (left, right, up, down)
        context.rotate(this.rotation)

        // return to orginal position
        context.translate(-this.pos.x, -this.pos.y)

        // begin the path
        context.beginPath();

        // make chomper as a circle with mouth open
        context.arc(this.pos.x, this.pos.y, this.radius, this.rad, Math.PI * 2 - this.rad)
        context.lineTo(this.pos.x, this.pos.y)

        //fill the circle with the chosen yellow colour 
        context.fillStyle = '#ffcc00';
        context.fill();

        // close path
        context.closePath();

        //restore the state that was stored in "save" previously
        context.restore()
    }

    // update the chomper object, including drawing it
    updateChomper(){

        // draw chomper in the canvas 
        this.drawChomper()

        // offset the position by x and y velocities 
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y

        // when the mouth closes, reverse the animation so it opens 
        if(this.rad < 0 || this.rad > .75) this.openRate = -this.openRate
        this.rad += this.openRate

    }

}
