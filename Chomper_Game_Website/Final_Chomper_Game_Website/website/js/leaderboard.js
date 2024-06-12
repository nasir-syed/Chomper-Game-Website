
// THE LEADERBOARD TABLE IS SCROLLABLE, IT SHOWS THE SCORES OF ALL THE USERS IN DESCENDING ORDER

// a function to populate the leaderboard with users 
function fillLeaderboardTable(highscores){

    // sort the array passed in descending order as the argument according to the highscores
    highscores.sort((a,b) => b.highScore - a.highScore)

    // get the leaderboard table element
    let leaderboardTable = document.getElementById("leaderboard")

    // iterate through hishscores array and populate the leaderboard table
    for (let i = 0; i < highscores.length; i++){


        // each row ahs the position, username and highscore of the user 
        let row = `<tr>
                        <td style="text-align: center;">${1+i}</td> 
                        <td style="padding: 1rem;">${highscores[i].username}</td>
                        <td style="text-align: center; color: #ffcc00;">${highscores[i].highScore}</td>
                    </tr>`

        // add the row to the table 
        leaderboardTable.innerHTML += row
    }

}

//get users array 
let userArray = JSON.parse(localStorage.getItem("users"))

// if the users array exists, execute the function with the array as the argument 
if (userArray){
    fillLeaderboardTable(userArray)
}
