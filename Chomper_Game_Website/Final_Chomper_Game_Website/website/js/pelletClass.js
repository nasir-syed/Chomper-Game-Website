// import canvas context
import {context} from "./game.js"

//export class for use in other files
export class Pellet {

    // constructor only takes position of the pellet, passed as an object with x and y properties in game.js
    constructor({position}){
        this.position = position

        //size of the circle
        this.radius = 3;
    }


    //draw the pellet to the canvas
    drawPellet(){

        //begin path
        context.beginPath();

        // making a circle with provided positions and dimensions
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)

        // specifying the colour of the pellet
        context.fillStyle = 'white';
        context.fill();


        // close the path
        context.closePath();
    }


    // no "updatePellet" method since pellets are not a moving object and are static througout the game.

}