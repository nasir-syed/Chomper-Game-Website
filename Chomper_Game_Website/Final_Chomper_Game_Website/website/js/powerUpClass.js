import { context } from "./game.js";


// export class for use in other files
export class PowerUp {
    // constructor takes position of the powerUp, passed as an object with x and y properties in game.js
    constructor({position}){
        this.position = position

        // radius of the powerUp
        this.radius = 7;
    }

    drawPowerUp(){

        // begin the path 
        context.beginPath();

        // make a circle with the provided position and dimensions
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)

        // fill colour is white 
        context.fillStyle = 'white';
        context.fill();

        // close the path
        context.closePath();
    }

}