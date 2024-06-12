// import canvas context
import { context } from "./game.js";

// export class for use in other files
export class Boundary{


    // fixed width and height of each boundary component
    static width = 30;
    static height = 30;

    // constructor takes position, height, and width and assigns them accordingly, 
    // position argument is passed as an object with x and y properties
    constructor({position, height=30, width=30}) {
        this.position = position;
        this.width = width;
        this.height = height; 
    }


    drawBoundary() {
        
        // colour of the boundary is specified
        context.fillStyle = 'rgb(13,163,139)'; 
        
        // draw a square boundary at the provided positions with provided dimensions
        context.fillRect(this.position.x, this.position.y, this.width, this.height)
        // this draws the square boundary 
    }
}