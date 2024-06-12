// import the canvas context, collide function and the boundary class
import { context, collide } from "./game.js";
import { Boundary } from "./boundaryClass.js";

// export variable to allow the class to be imported in another file
export class Ghost {

    // constructor takes 3 arguments, position velocity and image,
    // the position and velocity arguments are passed as objects, both containing "x" and "y" properties in game.js

    constructor({pos, vel, img}){

        //assigning the values to the class variables
        this.pos = pos;
        this.vel = vel;

        // hitbox of the ghost is circular, circle radius is 15
        this.radius = 15;

        // scared variable is used to check if the behaviour of ghost is to be changed in case chomper eats the power up
        this.scared = false 

        // speed multiplier is used while setting the velocities of the ghosts,
        // increments by 2 every time the user clears all the pellets in the map, making the ghosts faster
        this.speedMultiplier = 5

        // sprite variable with used to track the x and y position of the sprite in the sprite sheet
        this.sprite = {
            x: 0,
            y: 0
        }

        // create new image object 
        this.image = new Image()

        // assign the image argument passed to the object made previously
        this.image.src = img
    }


    // draws the ghost on the canvas
    drawGhost(){

        // begin the path
        context.beginPath();

        // THE BELOW CODE CAN BE UNCOMMENTED TO CHECK THE HITBOX OF THE GHOST IF NEEDED

        // context.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2)
        // context.fillStyle = "red";
        // context.fill();


        
        // each sprite is around 16x16 pixels
        // this.sprite.x can be changed to change sprites by incrementing by 32, 
        // in the sprite sheet, there is are no columns so only this.sprite.x is required to be changed

        // draw the image of the ghost according to image provided, and location of sprite in the image
        // radius is subtracted from the position of the ghosts hitbox to draw the image correctly, its a circle so (x,y) are in the middle
        context.drawImage(this.image, this.sprite.x, this.sprite.y, 16, 16, this.pos.x - this.radius, this.pos.y - this.radius, 30, 30)


        // close the path
        context.closePath();
    }

    // eat function is called when chomper eats the powerup
    eat() {

        // set scared to true
        this.scared = true

        // use temporary variable to store the current sprite
        let tempX = this.sprite.x

        // use other temp variable to store the image source 
        let tempImg = this.image.src

        // change source to "scared"
        this.image.src = '../imgs/scared.png'

        //sprite.x is set to 0 to show the first sprite on the "scared" sprite sheet
        this.sprite.x = 0

        //reverse the current velocities of the ghosts, to show their scared
        this.vel.x = -this.vel.x
        this.vel.y = -this.vel.y


        // after 3 seconds set scared to false, and go back to previous image src and sprite
        setInterval(() => {
            this.scared = false
            this.image.src = tempImg
            this.sprite.x = tempX
        }, 3000)
    }
    
    
    // called to update the ghost and draw it in canvas
    updateGhost(boundaries) {

        //iterate through the boundaries
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];


            // check if there is collision with any of the boundaries in the array
            if (
                 collide({
                    circle: { pos: { x: this.pos.x, y: this.pos.y }, 
                            vel:{x: this.vel.x, y: this.vel.y},
                            radius: this.radius},
                    rectangle: boundary

                 })) {



                // TOP AND BOTTOM COLLISION 


                // TOP COLLISION 
                // If the ghost is colliding with the top boundary and the y velocity is negative, 
                if (this.pos.y  - this.radius + this.vel.y <= boundary.position.y + boundary.height && this.vel.y < 0){

                    // set new positive y velocity, minimum is 1
                    this.vel.y = Math.max(Math.random() * this.speedMultiplier, 1);
                }

                // BOTTOM COLLISION 
                // If the ghost is colliding with the bottom boundary and y velocity is positive
                else if (this.pos.y +  this.radius +  this.vel.y >= boundary.position.y  && this.vel.y > 0){

                    // change y velocity to a negative number 
                    this.vel.y = -Math.max(Math.random() * this.speedMultiplier, 1);

                    // change x velocity to add to the unpredictability
                    this.vel.x = Math.random() * this.speedMultiplier - 1


                }


                //LEFT AND RIGHT COLLISION 

                
                // RIGHT COLLISION 
                // if the ghost is colliding with the left boundary, and x velocity is negative
                if(this.pos.x +  this.radius +  this.vel.x >= boundary.position.x  && this.vel.x > 0){

                    // change x velocity to a random negative number 
                    this.vel.x = -Math.max(Math.random() * this.speedMultiplier, 1);

                }

                //LEFT COLLISION 
                // if the ghost is colliding with the left boundary, and x velocity is negative 
                else if (this.pos.x -  this.radius +  this.vel.x <= boundary.position.x + boundary.width && this.vel.x < 0){

                    // set x velocity to a random positive number 
                    this.vel.x = Math.max(Math.random() * this.speedMultiplier, 1);

                    // change y velocity to a positive number, to make the bounce random 
                    this.vel.y = Math.random() * this.speedMultiplier - 1
                }

                // else{
                //     this.vel.x = 4;
                //     this.vel.y = 4;
 
                // }



        }


        // if the ghost is not scared, cycle through the different sprites in the sprite sheet (up, down, left, right)
        // according to the velocity of the ghost
        if (!this.scared){

            // if the ghost is moving diagonally downwards
            if(this.vel.x > 0 && this.vel.y > 0){

                // sprite set to ghost with eyes looking down
                this.sprite.x = 112
            }

            // if sprite moving diagonally up
            else if (this.vel.x < 0 && this.vel.y < 0){

                // sprite set to ghost with eyes looking up
                this.sprite.x = 80
            }

            // if ghost moving right
            else if (this.vel.x > 0 && this.vel.y < 0){
                //sprite set to ghost with eyes looking right 
                this.sprite.x = 0
            }

            // else set sprite to ghost with eyes looking left
            else{
                this.sprite.x = 48
            }
        
        }

        // finally calling the draw ghost function to draw it on the canvas
        this.drawGhost();
    }

    // offset the position with x and y velocities 
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    }


}