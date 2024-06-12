// importing all the necessary classes
import {Chomper} from "./chomperClass.js"
import {Boundary} from "./boundaryClass.js"
import {Pellet} from "./pelletClass.js"
import {PowerUp} from "./powerUpClass.js"
import { Ghost } from "./ghostClass.js"

//getting the canvas element
const canvas  = document.querySelector("canvas");

// get the 2d context which allows us to draw on the canvas
const context = canvas.getContext('2d');

// export the context so it can be used by other classes 
export {context}

// getting other HTML paragrapgh elements such as score, lives, the current user, and their highscore
let scoreText = document.getElementById("score");
let livesText = document.getElementById("lives");
let userTag = document.getElementById('userTag')
let highScore = document.getElementById('HS')


// fix canvas height and width
canvas.width = 550;
canvas.height = 550


// function to update the highscore of the registered user
function updateHS(chomper){

    // fetch the "check" object, that indicates there is a user logged in and stores their username
    let check = JSON.parse(sessionStorage.getItem("check"))

    // usertag is set to "guest" by default when there are no registered users
    // if there is a user "guest" is replaced by the username of the user    
    if(userTag.innerText !== "GUEST"){    
       
        // fetch the user array that stores all the details the user filled in on the sign up page, as well as their highscore.
        let userArray = JSON.parse(localStorage.getItem("users"))

        // iterate through the array and find the registered user within the array of user objects
        userArray.forEach((user) => {
            // if the username in the array matched the name of teh registered user
            if (user.username == check.user){
                if(user.highScore < chomper.score){
                    user.highScore = chomper.score
                    // update the highscore of the user if it is less that what they currently scored.
                }
            }
        })
    
        // set the user array again with the updated highscore of the user
        localStorage.setItem("users", JSON.stringify(userArray))


    }

}


// the map that will be generated for the game, 1 -> boundary, 0 -> pellets and 2 -> power up.
// an array of arrays
const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ,1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

];

// initialize variables that will be used within the game
const pellets = []
const boundaries = []
const powerUps = []
let eatenGhosts = []
let ghosts = []

//colours of the ghosts that will be in the game
const colours = ["red","purple","green","blue","pink","brown","orange"]

// keeps track of the last key the user pressed, allows for more fluid movement
let keyPressed = ' ';

// initially all keys are set to false
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
}

// create a new chomper object, this will be controlled by the user 
const chomper = new Chomper({
    pos: {
        // the chomper object spawns at the top left corner right after the borders
        x : Boundary.width  + Boundary.width/2,
        y : Boundary.height  + Boundary.height/2
    },
    vel: {
        //initially the velocity is set to 0, this will change according to the keys pressed by the user
        x: 0,
        y: 0
    }
})


// the below function is to make the ghosts for the game
function makeGhosts(ghosts){

    //iterate through the colours array, these will be the colours of the ghosts
    for (let i = 0; i < colours.length ; i++){
        // make a new ghost object and push it to the ghosts array 
        ghosts.push(new Ghost({
            // setting the position of the ghost
            pos: {
                    // the position of the ghost is randomly generated
                    x : Boundary.width * Math.max(Math.random() * 12, 3) + Boundary.width/2,
                    y : Boundary.height *  Math.max(Math.random() * 12, 3) + Boundary.height/2
                    },
                    vel: {

                        // the velocity is randomly generated as well, adds to the unpredicatability of the ghost.
                        x: Math.max(Math.random() * 5, 1),
                        y: Math.max(Math.random() * 5, 1)
                    },
                    img: `../imgs/${colours[i]}_ghost.png`
        }))
    }
}

// call the makeGhosts function and pass the ghosts array as the argument
makeGhosts(ghosts)


// the below code is to generate the map
// iterate through the rows/arrays within the "map" array
map.forEach((row, j) => {
    //iterate through the elements of the array
    row.forEach((num, k) => {

        // if num is 1, generate boundary
        if (num === 1){

            // make a new boundary object and push it to the boundaries array 
            boundaries.push(new Boundary({ position: {

                // k and j are indexes of the array and elements accordingly,
                // multiply the indexes with the set boundary height and width for the correct position
                x: k * Boundary.width, y: j * Boundary.height

            }}));
        }


        // if num is 0, generate pellet
        else if (num === 0){

            // make a new pellet object and push it to the array
            pellets.push(new Pellet({
                position: {
                    // set the position of the pellet, we add boundary.width/2 and boundary.height/2 to ensure
                    // the pellets position is within the walls
                    x: k * Boundary.width + Boundary.width / 2 , y: j * Boundary.height + Boundary.height / 2
                }
                
            }))          
        }

        // if num is 2, generate power up 
        else if (num === 2){
            // make a new powerup object and push it to the powerups array 
            powerUps.push(new PowerUp({
                position: {
                    // the position is set similar to pellets
                    x: k * Boundary.width + Boundary.width / 2 , y: j * Boundary.height + Boundary.height / 2
                }
                
            }))
        }

})
})

// the collide function checks for collision between a circle and rectangle
export function collide({circle, rectangle}){
    return ( 

        // TOP COLLISION 

        // for the circle, the x and y position is at the center, and so to check for collision 
        // at the top, we subtract the radius from the y position of the circle to get its highest point
        // we then check if the y position of highest point of the circle, is less than the y position of the rectangle 
        // adding the height of the rectangle to get the bottom of the rectangle.
        // which would mean the circle is overlapping or pass the rectangle and the top of the map
        // velocity is added just for padding, so that the function is executed right before the two overlap

        circle.pos.y -  circle.radius +  circle.vel.y <= rectangle.position.y  + rectangle.height&& 


        // RIGHT COLLISION 

        // we add the radius to x position of the circle to get it's right most point, and see if this point is greater than the 
        // x poistion of the rectangle, if so the it overlaps with the rectangle
        circle.pos.x +  circle.radius +  circle.vel.x >= rectangle.position.x && 

        // BOTTOM COLLISION 

        // we add the radius to the circle's y position to get the lowest point of the circle, 
        // we then check this is greater than the y position of rectangle, if so then it overlapping with the rectangle
        circle.pos.y +  circle.radius +  circle.vel.y >= rectangle.position.y &&

        // LEFT COLLISION 

        // we subtract the radius from the circle's x position to get the left most point of the circle, 
        // we then check this is lesser than the x position of rectangle + its width (to get the right side of the rectangle), if so then it overlapping with the rectangle
        circle.pos.x -  circle.radius +  circle.vel.x <= rectangle.position.x + rectangle.width 
    )

}


// this function is excuted when the player collides with the ghost
function hit(chomper, ghosts){


    // if the player is not on his last life 
    if(chomper.lives > 0){

        // deduct life upon collision 
        chomper.lives -= 1


        // reset the position of chomper to the top left, rotation = 0 to make the animation face towards the right
        chomper.pos.x = Boundary.width + Boundary.width/2
        chomper.pos.y = Boundary.height + Boundary.height/2
        chomper.rotation = 0


        // restrict the user from moving chomper 
        chomper.movementRestricted = true


        // set the velocity of the ghost to 0 to stop them from moving
        ghosts.forEach((ghost) => {
            ghost.vel.x = 0
            ghost.vel.y = 0
            })


        // after 3 seconds, randomly set the velocitys of the ghosts and allow the user to move chomper again
        setTimeout(() => {
            ghosts.forEach((ghost) => {
                ghost.vel.x = Math.max(Math.random() * 5 - 1, 2);
                ghost.vel.y = Math.max(Math.random() * 5 - 1, 2);
                })

            chomper.movementRestricted = false
        }, 3000)



    }

    // if the last life is lost 
    else if (chomper.lives === 0){

        // cancel the animation frame and stop the game
        cancelAnimationFrame(gameAnimation)

        // update the highscore of the user 
        updateHS(chomper)


        // display game over, allow the user to play again
        context.font = "bold 50px helvetica"
        context.fillStyle = '#ffcc00'
        context.fillText("GAME OVER", canvas.width/5.5, canvas.height/2)

        context.font = "bold 20px helvetica"
        context.fillText("press enter to play again",  canvas.width/4.2, canvas.height/1.8)

        // resets the position of chomper and ghosts, repopulates the map with pellets
        resetGame()

        // if the user presses enter, the game begins once again
        play()

       
    }
    
}



// function to reset the game
function resetGame(){

    // reset position and animation of chomper 
    chomper.pos.x = Boundary.width + Boundary.width/2
    chomper.pos.y = Boundary.height + Boundary.height/2
    chomper.rotation = 0

    // rest ghosts array and make new ones 
    ghosts = []
    makeGhosts(ghosts)
    

    // reset the length of the pellets array to repopulate it
    pellets.length = 0

    // reset the lives of the player 
    chomper.lives = 2

    // reset the score     
    chomper.score = 0


        // repopulate the map with the pellets and powerup
        map.forEach((row, j) => {
            row.forEach((num, k) => {
                if (num === 0) {
                    pellets.push(new Pellet({
                        position: {
                            x: k * Boundary.width + Boundary.width / 2,
                            y: j * Boundary.height + Boundary.height / 2
                        }
                    }));
                }

                else if (num === 2){
                    powerUps.push(new PowerUp({
                        position: {
                            x: k * Boundary.width + Boundary.width / 2 , y: j * Boundary.height + Boundary.height / 2
                        }
                        
                    }))
                }
            });
        });


    

}


// used to reference the animation 
let gameAnimation;

// animates the game 
function animateGame() {


    // requestAnimationFrame tell the window that we are performing an animation, frequency of the function
    // matches the refresh rate 
    gameAnimation = requestAnimationFrame(animateGame); // creates an infinite loop 


    // show lives on the screen
    livesText.innerText = `${chomper.lives}`

    //clear the canvas so we can update it
    context.clearRect(0,0,canvas.width, canvas.height)




    // get the "check" object from the session storage
    let check = JSON.parse(sessionStorage.getItem("check"))    

    // if not null, then change the userTag from "GUEST" to the current user's name
    if (check){
        userTag.innerText = check.user.toUpperCase()

        // get userArray which stores the data of all the users
        let usersArray = JSON.parse(localStorage.getItem("users"))

        // iterate through the user array and find the logged in user 
        usersArray.forEach((user) => {
            if (check.user == user.username){

                // after finding user, set the highscore paragraph to show the highscore of the user
                highScore.innerText = user.highScore
            }
        })
        
        
    }


    // if the user clicks logout in the middle of the game 
    if(check == null && userTag.innerText != "GUEST"){

        // display "logged out" on the canvas
        context.font = "bold 50px helvetica"
        context.fillStyle = '#ffcc00'
        context.fillText("LOGGED OUT", canvas.width/5.5, canvas.height/2)

       // cancel/stop the game by cancelling the animation frame.  
        cancelAnimationFrame(gameAnimation)
        updateHS(chomper)

        
    }


// if the user is allowed to move chomper, change the velocity of chomper according to key pressed
if(!chomper.movementRestricted){

    // if "W" is being pressed down, make y velocity negative so it moves up
    if (keys.w.pressed && keyPressed === 'w') {

                chomper.vel.x = 0;

                chomper.vel.y = -4;
            }
        

     // if "A" is being pressed down, make x velocity negative so it moves left
     else if (keys.a.pressed && keyPressed === 'a') {

                chomper.vel.y = 0;

                chomper.vel.x = -4;
     }
            
    // if "S" is being pressed down, make y velocity positive so it moves down
     else if (keys.s.pressed && keyPressed === 's') {

                chomper.vel.x = 0;

                chomper.vel.y = 4;
            
    // if "D" is being pressed down, make X velocity positive so it moves right 
    } else if (keys.d.pressed && keyPressed === 'd') {

                chomper.vel.y = 0;

                chomper.vel.x = 4;
            }
        
    
}
   // iterate through pellets array
    for (let l = pellets.length - 1; l > 0; l--) {

         // draw the pellets to canvas, they have already been assigned positions above
        const pellet = pellets[l]
        pellet.drawPellet()

        // checking for collision between two circles (chomper and pellets)


        // if the distance between the x and y points of the circles is less than the sum of the radius of both the pellet and chomper,
        // it means the circles are overlapping or colliding,
        if (Math.hypot(
            pellet.position.x - chomper.pos.x, 
            pellet.position.y - chomper.pos.y) < 
            pellet.radius + chomper.radius
            ) {
                // splice the pellet from the array
                pellets.splice(l, 1)

                // increment the score 
                chomper.score += 10

                // display new score
                scoreText.innerText = `${chomper.score}`
                }


        // if the player clears all the pellets on the map
        if (pellets.length === 1){

            // reset length of the pellets array
            pellets.length = 0


            //repopulate all the pellets and powerups
            map.forEach((row, j) => {
                row.forEach((num, k) => {
                    if (num === 0) {
                        pellets.push(new Pellet({
                            position: {
                                x: k * Boundary.width + Boundary.width / 2,
                                y: j * Boundary.height + Boundary.height / 2
                            }
                        }));
                    }

                    else if (num === 2){
                        powerUps.push(new PowerUp({
                            position: {
                                x: k * Boundary.width + Boundary.width / 2 , y: j * Boundary.height + Boundary.height / 2
                            }
                            
                        }))
                    }
                });
            });


            // reset position of the chomper to the top left
            chomper.pos.x = Boundary.width + Boundary.width/2
            chomper.pos.y = Boundary.height + Boundary.height/2

            // restrict the user from moving
            chomper.movementRestricted = true

            //reset ghosts array
            ghosts = []

            // repopulate ghost array
            makeGhosts(ghosts)

            // iterate through the ghost array, set their velocity to 0 initially, and increase their speedmultiplier by 2
            // from the previous level
            ghosts.forEach((ghost) => {
                ghost.vel.x = 0
                ghost.vel.y = 0
                ghost.speedMultiplier += 2 
                })

            // after 3 seconds, make the velocity of the ghosts random 
            setTimeout(() => {
                ghosts.forEach((ghost) => {
                    ghost.vel.x = Math.random() * ghost.speedMultiplier - 1;
                    ghost.vel.y = Math.random() * ghost.speedMultiplier - 1;
                    })

                //allow the user to move
                chomper.movementRestricted = false

            }, 3000)
            }
        
    }


    // iterate throught the powerUps array
    for (let n = 0; n < powerUps.length; n++) {

        //draw the powerup
        const powerUp = powerUps[n];
        powerUp.drawPowerUp();


        // if chomper collides with the powerUp, splice it and execute the "eat" function for ghosts
        if (Math.hypot(
            powerUp.position.x - chomper.pos.x, 
            powerUp.position.y - chomper.pos.y) < 
            powerUp.radius + chomper.radius
            ) {
                powerUps.splice(n, 1);
                ghosts.forEach((ghost) => {
                    ghost.eat()

                })
        }
    }
    
    
    // for each boundary object, draw the boundary
    boundaries.forEach((boundary) => {
        boundary.drawBoundary()

        // check for collision with boundary, if it returns true set the velocity of chomper to 0
        // to prevent it from moving further
        if(collide({
            circle: chomper,
            rectangle: boundary,
        })){
            chomper.vel.x = 0;
            chomper.vel.y = 0;
        }

     
    });


    
    // iterate through the ghosts array 
    for (let k = ghosts.length-1; k >= 0; k--) {

        const ghost = ghosts[k]
        
        
        
        // check for circular collision between chomper and ghost, similar to powerups and pellets
        // the hitbox of the ghosts is circular
        if (Math.hypot(
            ghost.pos.x - chomper.pos.x, 
            ghost.pos.y - chomper.pos.y) < 
            ghost.radius + chomper.radius
            ) {

                // if the ghosts are not scared, call the hit function 
                if(!ghost.scared){
                    hit(chomper, ghosts)
                }

                // if the ghosts are scared (if chomper ate powerup), 
                else if (ghost.scared){
                    

                    //splice the ghost that chomper collided with and add it to the eatenghosts array
                    eatenGhosts.push(ghosts.splice(k, 1)[0])
                

                    //increment chomper score since he ate a ghost
                    chomper.score += 100

                    //update score 
                    scoreText.innerText = `${chomper.score}`

                }
                }

                // add the eaten ghosts back to the ghosts array after 8 seconds if all the ghosts are not in the ghosts array,

                if (ghosts.length < 7) {

                    // add the ghosts back 7 seconds later
                    setTimeout(() => {
                        // Check if chomper can move before adding the eaten ghosts back
                        if (!chomper.movementRestricted) {

                            for(let i = 0; i < eatenGhosts.length; i++){

                                // set position so the ghosts spawn near the middle of the map
                                eatenGhosts[i].pos.x = 235
                                eatenGhosts[i].pos.y = 235

                                // add the eaten ghost back to the ghosts array  and splice it from the eatenghosts array
                               ghosts.push(eatenGhosts.splice(i,1)[0])
                            }
                            
                        }
                    }, 7000);
                    

                }

                // if all the ghosts are alive/ no ghosts are eaten, reset teh eaten ghosts array
                if (ghosts.length == 7){
                    eatenGhosts = []
                }
            

                // update the ghost 
                ghost.updateGhost(boundaries)

            }
            
            

        
        
        
        

    
    //update chomper 
    chomper.updateChomper();

    // for the chomping animation 
 
    // if chomper is facing right
    if(chomper.vel.x > 0){
        chomper.rotation = 0
    }

    //if chomper is facing left
    else if (chomper.vel.x < 0){
        chomper.rotation = Math.PI
    }

    //if chomper is facing down
    else if (chomper.vel.y > 0){
        chomper.rotation = Math.PI / 2 
    }

    //if chomper is facing upwards
    else if (chomper.vel.y < 0){
        chomper.rotation = Math.PI * 1.5
    }


    //set chomper velocity to 0 
    chomper.vel.x = 0;
    chomper.vel.y = 0;
}

// after the user lets go of the key, set key pressed to false
// this is done so pacman only moves when the user is holding down the key
window.addEventListener("keyup", ({key}) => {

    switch(key){
        case "w":
            keys.w.pressed = false
            break;

        case "a":
            keys.a.pressed = false
            break;

        case "s":
            keys.s.pressed = false
            break;

        case "d": 
            keys.d.pressed = false 
            break;


    }

})

// when a key is pressed, it is set to true which will allow pacman to move
window.addEventListener("keydown",({key}) => {



    switch(key){
        case "w":
            keys.w.pressed = true
            keyPressed = 'w'
            break;

        case "a":
            keys.a.pressed = true
            keyPressed = 'a'
            break;

        case "s":
            keys.s.pressed = true
            keyPressed = 's'
            break;

        case "d": 
            keys.d.pressed = true
            keyPressed = 'd'
            break;

    }
})


// display "press enter to play"
context.font = "40px helvetica"
context.fillStyle = '#ffcc00'
context.fillText('PRESS "ENTER" TO PLAY', canvas.width/20, canvas.height/2)


// play function that starts the animation again
function play() {
    // default set to false
    let gameInPlay = false;

    // when user presses "enter", and game is not playing, set gameInPlay to true and start animation
    window.addEventListener("keydown", ({ key }) => {
        if (key === "Enter" && !gameInPlay) {
            gameInPlay = true;
            animateGame();
        }
    });
}


//calling the play function
play()


