// getting login and signup buttons from their respective pages 
let loginBtn = document.getElementById("loginBtn");
let signupBtn = document.getElementById("signupBtn")

// getting the signup, login and logout link displayed in the nav bar
let signupLink = document.getElementById('signupLink')
let loginLink = document.getElementById("loginLink")
let logoutBtn = document.getElementById("logoutBtn")

// retrieve checkData from session storage, ahs the username of the user that is currently logged in
let checkData = JSON.parse(sessionStorage.getItem("check"))

// if there are no previous registered users, create a new users array and setItem to local storage
// user sign up details are stored in the array
if (localStorage.getItem("users") == null){
    localStorage.setItem("users", "[]")
}


// a function that adds and removes the class "hide" which is in the css file, it sets the display to none.
// using true and false we can display or hide the element
function display(element, condition){
    if (condition){
        element.classList.remove('hide')
    }
    else{
        element.classList.add('hide')
    }

}

// if user is logged in then checkData will not be null, so we hide the display of the login and signup links
// and show the logout link 
if (checkData){

    display(logoutBtn, true)
    display(loginLink, false)
    display(signupLink, false)

}

// else we do the opposite, hide logout link, show the other two.
else {

    display(logoutBtn, false)
    display(loginLink, true)
    display(signupLink, true)
    
}


// signup function assigned to "onlcick" for the signup button in signup.html
function signup (e) {

    // get the values from all the fields in the signup page 
    // first name, last name, username, password, confirm password fields and sign up error paragraph element 
    let signUpUsername = document.getElementById('singupUserField').value;
    let signUpPassword = document.getElementById('signupPassField').value;
    let signUpConfirmPass = document.getElementById('signupConfirmPassField').value;
    let signUpFirstName = document.getElementById('firstNameField').value;
    let signUpLastName = document.getElementById('lastNameField').value;
    let signupError = document.getElementById('signupError');

    // retrieve users array from local storage
    let usersArray = JSON.parse(localStorage.getItem("users"))


    // variables to which the values of the fields will be assigned if they have no errors
    let first;
    let last;
    let userName;
    let pass;
    
    //regular expressions to check the validity of the fields

    // only alphabets are accepted for first and last name
    let nameRegex = /^[a-zA-Z]+$/;

    // only accepting lower and uppercase letters, along with underscores for username
    let usernameRegex =/^[a-zA-Z0-9_]+$/

    // lower and uppercase letters, numbers, dollar sign, ampersand, and period are accepted for password
    let passRegex =  /^[a-zA-Z0-9$&.]+$/;

    // set text content to empty string, will be used to display error messages 
    signupError.textContent = " ";
    
    // if not all the fields have been filled out or contain empty spaces
    if (![signUpFirstName,signUpLastName, signUpUsername, signUpPassword].every(field => field.trim().length)) {
        signupError.innerText += "Fill out all fields.\n";
        return
    } else {

        // if first and last name only include the specified elements in the RegEx 
        if (signUpFirstName.match(nameRegex) && signUpLastName.match(nameRegex)) {

            // assign the value of the fields to "first" and "last"
            first = signUpFirstName;
            last = signUpLastName;
            
        } 
        // if they don't match, change the text content of signupError element to display the error.
        else {
            signupError.innerText += "First or last name must not contain special characters.\n";
            return
        }

        // if the username includes the acceptable characters and is greater than 3 letters 
        if (signUpUsername.match(usernameRegex) && signUpUsername.length >= 3) {

            // assign the value of the field to "userName" variable
            userName = signUpUsername;


        } 
        // if username includes characters that are not within the regular expression, display error message 
        else if (!signUpUsername.match(usernameRegex)){
            signupError.innerText += "Username contains invalid character(s).\n";
            return
        }
        // else the username is less than 3 letters, display error 
        else {
            signupError.innerText += "Username must be atleast 3 characters long.\n";
            return
        }

        // if password includes characters that within the regex and is longer than 8 characters
        if (signUpPassword.match(passRegex) && signUpPassword.length >= 8) {

            //assign the value to "pass" variable 
            pass = signUpPassword;

        } 
        // else if it includes characters not specified within the regex, display error message.
        else if (!signUpPassword.match(passRegex)) {
            signupError.innerText += "Password contains invalid character(s).\n";
            return
        }

        // else the length of password is shorter than 8 characters
        else {
            signupError.innerText += "Password must be atleast 8 characters long.\n";
            return
        }

        // if the value of confirm password field doesn't match the value of the password field, display error
        if(signUpConfirmPass != signUpPassword){
            signupError.innerText += "Password and Confirm Password do not match.\n";
            return
        }

        // iterate through the users array, and check if the username has already been taken
        // if so, display error message saying the same
        if(usersArray.length){
        for (let i = 0; i < usersArray.length; i++){
            if (usersArray[i].username == signUpUsername){
                signupError.innerText += "Username already taken.\n";
                return
            }
        }

        // there is a return statement at the end of each conditional statements that check for error,
        // so if an error is detected the rest of the function is not executed and error message is shown
    }


    }


    // when all the requirements are met, a "user" object is made with properties that store the value of all the fields

    let user = {
        firstName: first,
        lastName: last,
        username: userName,
        password: pass,
        highScore: 0
    }

    // this "user" object is then pushed to the array of users
    usersArray.push(user)

    // and the users array is set to the local storage with the new users data 
    localStorage.setItem("users",JSON.stringify(usersArray))


    // display message to tell user the sign up process is over 
    signupError.innerText = "signed up successfully, you can now login."

    // redirect user to login section after 2 seconds 
    setTimeout(() => {window.location.href = '../html/login.html'}, 2000)


};


// login function assigned to "onclick" for the login button in the login page
function login(e) {

    // getting the values of the fields in the login page, and the login error paragraph element 
    let loginUsername = document.getElementById('loginUserField').value;
    let loginPassword = document.getElementById('loginPassField').value;
    let loginError = document.getElementById('loginError');


    // set to an empty string initially 
    loginError.textContent = " ";


    
    // all the fields have not been filled out, display error message 
    if (![loginUsername,loginPassword].every(field => field.trim().length)) {
        loginError.innerText += "Fill out all fields.\n";
        return
    } 
    
    // else statement executed if fields are not empty 
    else {

        // get the users array from the local storage 
        let usersArray = JSON.parse(localStorage.getItem("users"))


        // boolean values to check for conditions
        // if user exists (initially false)
        let userExists = false

        // if the password entered matches the one that is stored 
        let correctPassword = false

        // iterate through users array, 
        if(usersArray.length){
        for (let k = 0; k < usersArray.length; k++){

            // if the entered username is within the array set variable "userExists" to true
            if(usersArray[k].username == loginUsername.trim()){
                userExists = true

                // once we verify the user exists, check if entered password is correct and set the variable to trie
                if (usersArray[k].password == loginPassword){
                    correctPassword = true
                }
            }
        }
        }


        // if the user was not found in the stored users array, display error message 
        if(userExists == false){
            loginError.innerText += "User doesn't exist."
        }

        // if incorrect password was entered, display error message
        else if (!correctPassword){
            loginError.innerText += "passwords don't match."
        }

        else{

            // if all requirements are met, tell the user they have logged in successfully
            loginError.innerText += "logged in successfully."
            

            // create check object that stores the username of the user that just logged in 
            let check = {
                user: loginUsername
            }
    
            // create a new item "check" in session storage that stores the username of the currently logged in user
            sessionStorage.setItem("check", JSON.stringify(check))

            // redirect user to about page after 500ms
            setTimeout(() => {window.location.href = "../html/index.html"},500)

        }

    }


}


// the function executed by the logout button that appears after the user has logged in 
function logout (e){

    // remove the check item from the session storage 
    sessionStorage.removeItem("check")

    // hide the logout button, show the login and signup links 
    display(logoutBtn, false)
    display(loginLink, true)
    display(signupLink, true)



}








