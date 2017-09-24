// Initialize Firebase
var config = {
apiKey: "AIzaSyBKbAkZdzavKenQ9jwfbFNKeDCbGQMoYSg",
authDomain: "never-forgetter.firebaseapp.com",
databaseURL: "https://never-forgetter.firebaseio.com",
projectId: "never-forgetter",
storageBucket: "never-forgetter.appspot.com",
messagingSenderId: "1056019897192"
};
firebase.initializeApp(config);

//Declare html elements
const emailInput = document.getElementById('emailInput');
const passInput = document.getElementById('passInput');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');

//if the login button is pressed
loginBtn.addEventListener('click', ()=>{
    login();
});

//if the sign up button is pressed
signupBtn.addEventListener('click', ()=>{
    signUp();
});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in
      location.href = "dashboard.html";
    } else {
      // No user is signed in
    }
  });


// Functions

function login(){
    const email = emailInput.value;
    const pass = passInput.value;
    const auth = firebase.auth();
    //Sign in user
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
}
function signUp(){
    const email = emailInput.value;
    const pass = passInput.value;
    const auth = firebase.auth();
    //Create user
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
}