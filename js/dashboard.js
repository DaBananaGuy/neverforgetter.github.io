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

//firebase variables
var projectRef;
var userId;

//Reference HTML Elements
const addProjectBtn = document.getElementById('addProjectBtn');
const createBtn = document.getElementById('createBtn');

// Redirect user if not signed in
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in
      userId = user.uid;
      projectRef = firebase.database().ref(userId);
      displayProjects();
    } else {
      // No user is signed in
      location.href="login.html";
    }
});

// Create New Project
addProjectBtn.addEventListener('click', ()=>{
    createNewProject();
});

// Function to create new project
function createNewProject(){
    document.getElementById('m-header').innerHTML = "<span id='closeBtn'><i class='fa fa-times'></i></span><h3 id='headerTxt'>Create A Project</h3>";
    document.getElementById('modalTxt').innerHTML = '<input type="text" id="titleTxt" class="form-control form-control-lg float-center mb-2" placeholder="Enter Title"><textarea type="text" id="descTxt" class="form-control form-control-lg float-center mb-3" placeholder="Enter Description"></textarea><button id="createBtn" class="btn btn-lg btn-warning mb-3" onclick="createBtnAction()">Create!</button>';

    document.getElementById('modal-bg').style.display = 'block';
}

// Modal to input information for new project
var modal = document.getElementById('modal-bg');
var closeBtn = document.getElementById('closeBtn');

closeBtn.addEventListener('click', () => {
  closeModal();
}); 

window.addEventListener('click', (e) => {
  if (e.target == modal) {
    closeModal();
  }
});

var title;
var desc;

// Create Project
function createBtnAction(){
    title = document.getElementById('titleTxt').value;
    desc = document.getElementById('descTxt').value;
    if (title != "" && desc != "") {
        createProject(title, desc);
    }
    
}

//close modal
function closeModal() {
    document.getElementById('modal-bg').style.display = 'none';
}

// Create Project Function
function createProject(title, desc){
    document.getElementById('titleTxt').value = "";
    document.getElementById('descTxt').value = "";
    closeModal();
    var newProjectRef = projectRef.push();
    newProjectRef.set({
        title: title,
        desc: desc
    });
}

// Display Projects
function displayProjects(){
    projectRef.on('value', gotData, errData);
}

var k;
var keys;
var projectList;
var projects;

//Display projects
function gotData(data) {
    projects = data.val();
    keys = Object.keys(projects);
    projectList = document.getElementById('projectList');  
    if (keys.length > 0){
      projectList.innerHTML = "";
      for (var i=0; i<keys.length; i++){
        k = keys[i];
        var title = projects[k].title;
        var desc = projects[k].desc;
        projectList.innerHTML += "<a href='#' id='"+keys[i]+"' onclick='viewProject(this)' class='list-group-item'>"+title.slice(0,30)+"<span class='float-right text-right text-secondary'>"+desc.slice(0,45)+"</span></a>";        
      }
    } else {
      projectList.innerHTML = "";
    }
  }
  
  function errData(err) {
    console.log('Error!');
    console.log(err);
  }

  // Display project in modal
function viewProject(elmnt){
    var title = projects[elmnt.id].title;
    var desc = projects[elmnt.id].desc;
    displayModal(title, desc, elmnt.id);
}

  // Display modal with new data
function displayModal(title, desc, id){
    var headerTxt = document.getElementById('headerTxt');
    var modalTxt = document.getElementById('modalTxt');

    headerTxt.innerHTML = title;
    modalTxt.innerHTML = "<p class='text-secondary mb-3'>"+desc+"</p><button class='btn btn-md btn-primary' id='"+id+"' onclick='complete(this)'>Complete</button>";

    document.getElementById('modal-bg').style.display = 'block';
}

// Complete a project
function complete(elmnt){
  id = elmnt.id;
  firebase.database().ref(userId+'/'+id).remove();
  location.reload();
  closeModal();
}
