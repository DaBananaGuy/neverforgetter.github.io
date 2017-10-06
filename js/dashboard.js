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

// Keyword Array
var searchedKeywords = [];

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

var productArray=[];

// Function to create new project
function createNewProject(){
    productArray=[];
    document.getElementById('headerTxt').innerHTML = "Create A Project";
    document.getElementById('modalTxt').innerHTML = '<input type="text" id="titleTxt" class="form-control form-control-lg float-center mb-2" placeholder="Enter Title"><textarea type="text" id="descTxt" class="form-control form-control-lg float-center mb-2" placeholder="Enter Description (Optional)"></textarea><p class="text-secondary float-right fifty-right"><i class="fa fa-arrow-left"></i> Click X for no due date.</p><input type="date" class="fifty-left float-left mb-3 form-control" id="dateTxt"><input type="text" id="newProductTxt" class="form-control fifty-left" placeholder="Enter Item"><button class="half-right mb-2 btn btn-md btn-primary" id="newProductBtn" onclick="newProduct()">Add</button><ul class="list-group mt-2 mb-3" id="productList"></ul><button id="createBtn" class="btn btn-lg btn-warning mb-3 float-left mt-3" onclick="createBtnAction()">Create!</button>';
    //Set Datepicker's date to today's date
    document.getElementById('dateTxt').valueAsDate = new Date();

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
var date;
var products;

// Create Project
function createBtnAction(){
    title = document.getElementById('titleTxt').value;
    desc = document.getElementById('descTxt').value;
    date = document.getElementById('dateTxt').value;
    products = productArray;

    var newDate = dateConvert(date);
    date = newDate;

    if (desc == "undefined"){
      desc = "";
    }
    if (title != "") {
        createProject(title, desc, date, products);
    }
    
}

//close modal
function closeModal() {
    document.getElementById('modal-bg').style.display = 'none';
}

// Create Project Function
function createProject(title, desc, date, products){
    document.getElementById('titleTxt').value = "";
    document.getElementById('descTxt').value = "";
    document.getElementById('dateTxt').value = "";
    closeModal();
    var newProjectRef = projectRef.push();
    newProjectRef.set({
        title: title,
        desc: desc,
        date: date,
        products: products
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
        var date = projects[k].date;
        var products = projects[k].products;
        if (date != "mm/dd/yyyy" && date != ""&& date != "//"){
          projectList.innerHTML += "<a href='#' id='"+keys[i]+"' onclick='viewProject(this)' class='list-group-item list-group-item-project'><strong class='mr-1 float-left'>"+title+"</strong><span class='ml-2 badge badge-light'> Due: "+date+"</span><span class='desc float-right text-left text-secondary float-left'>"+desc.slice(0,100)+"</span></a>";        
        } else{
          projectList.innerHTML += "<a href='#' id='"+keys[i]+"' onclick='viewProject(this)' class='list-group-item list-group-item-project'><strong class='mr-2 float-left'>"+title+"</strong>  <span class='desc float-right text-left text-secondary'>"+desc.slice(0,100)+"</span></a>";
        }
      }
    } else {
      projectList.innerHTML = "";
    }

    // Make description responsive
    if (window.innerWidth <= 1040){
      var descs = document.getElementsByClassName('desc');

      for (var i=0; i<descs.length; i++){
        if(descs[i].innerHTML.length < 25){
          continue;
        }else {
          descs[i].classList.remove('float-right');
          descs[i].classList.add('float-left');
        }
      }
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
    var date = projects[elmnt.id].date;
    var products = projects[elmnt.id].products;
    displayModal(title, desc, date, products, elmnt.id);
}

  // Display modal with new data
function displayModal(title, desc, date, products, id){
    var headerTxt = document.getElementById('headerTxt');
    var modalTxt = document.getElementById('modalTxt');
    
    headerTxt.innerHTML = title;

    if(date != "" && date != "//"){
      modalTxt.innerHTML = "<h4 class='mb-3'>"+desc+"</h4><h6 class='mb-3 text-secondary'>Due: "+date+"</h6><ul class='list-group mb-3' id='modalProducts'></ul><button class='btn btn-primary btn-md float-left mb-3' id='"+id+"' onclick='edit(this)'>Edit</button><button class='btn btn-md btn-danger float-right' id='"+id+"' onclick='complete(this)'><i class='fa fa-trash'></i> Complete</button>";
    } else {
      modalTxt.innerHTML = "<h4 class='mb-3'>"+desc+"</h4><ul class='list-group mb-3' id='modalProducts'></ul><button class='btn btn-primary btn-md float-left mb-3' id='"+id+"' onclick='edit(this)'>Edit</button><button class='btn btn-md btn-danger float-right' id='"+id+"' onclick='complete(this)'><i class='fa fa-trash'></i> Complete</button>";      
    }
    
    document.getElementById('modal-bg').style.display = 'block';

    // Display Products
    if(products.length >=1){
      for(var i=0;i<products.length;i++){
        var ddId = products[i]+'DD';
        document.getElementById('modalProducts').innerHTML +="<li class='list-group-item "+id+"'>"+products[i]+"<button id='"+products[i]+"' type='button' class='btn-nostyle' onclick='search(this)'><i class='fa fa-search'></i></button><button id='"+id+"' class='float-right btn-nostyle' onclick='deleteProduct(this, "+i+")'><i class='fa fa-times'></i></button></li><div id='"+ddId+"'></div>";
      } 
    }
}

// Complete a project
function complete(elmnt){
  id = elmnt.id;
  firebase.database().ref(userId+'/'+id).remove();
  location.reload();
  closeModal();
}

var editedProducts = [];

// edit the project
function edit(elmnt){
  var headerTxt = document.getElementById('headerTxt');
  var modalTxt = document.getElementById('modalTxt');

  editedProducts = [];

  var title = projects[elmnt.id].title;
  var desc = projects[elmnt.id].desc;
  var date = projects[elmnt.id].date;
  var products = projects[elmnt.id].products;

  headerTxt.innerHTML = "<h3 id='headerTxt'>Create A Project</h3>";
  modalTxt.innerHTML = '<input type="text" id="newTitle" class="form-control mb-2" value="'+title+'"><textarea id="newDesc" class="form-control mb-2">'+desc+'</textarea><input type="date" id="newDate" class="form-control mb-3" value="'+unConvertDate(date)+'"><input type="text" id="newEditProductTxt" class="form-control fifty-left" placeholder="Enter Item"><button class="half-right btn btn-md btn-primary" id="newProductBtn" onclick="newEditProduct()">Add</button><ul class="list-group mt-2 mb-3" id="editModalProducts"></ul><button class="btn btn-primary btn-lg" id="'+elmnt.id+'" onclick="save(this)">Save</button>';

  for(var i=0;i<products.length;i++){
    editedProducts.push(products[i]);
    document.getElementById('editModalProducts').innerHTML +="<li class='list-group-item'><input class='form-control' id='"+i+"' value='"+products[i]+"'></li>";
  } 
}

// save the new version
function save(elmnt) {
  var newTitle = document.getElementById('newTitle');
  var newDesc = document.getElementById('newDesc');
  var newDate = document.getElementById('newDate');
  var newProducts = [];
  for (var i=0; i<editedProducts.length;i++){
    newProducts.push(document.getElementById(i).value);
  }

  var newNewDate = dateConvert(newDate.value);
  
  //Make the new version
  var newProjectRef = projectRef.push();
  newProjectRef.set({
      title: newTitle.value,
      desc: newDesc.value,
      date: newNewDate,
      products: newProducts
  });
  closeModal();
  // Delete the old version
  firebase.database().ref(userId+'/'+elmnt.id).remove();
}

// Format Date

function dateConvert(date) {
  var year = date.substr(0,4)
  var month = date.substr(5,2);
  var day = date.substr(8,2);
  return month+'/'+day+'/'+year;
}

// Un format Date
function unConvertDate(date){
  var year = date.substr(6,4);
  var month = date.substr(0,2);
  var day = date.substr(3,2);
  return year+'-'+month+'-'+day;
}

// Add New Product
function newProduct() {
  var newProductTxt = document.getElementById('newProductTxt');
  var productList = document.getElementById('productList');
  productArray.push(newProductTxt.value);
  productList.innerHTML += '<li class="list-group-item">'+newProductTxt.value+'</li>';
  newProductTxt.value = "";
}

// Add New Product from edit
function newEditProduct() {
  var newEditProductTxt = document.getElementById('newEditProductTxt');
  var editModalProducts = document.getElementById('editModalProducts');
  editedProducts.push(newEditProductTxt.value);
  var i = editedProducts.length - 1;
  editModalProducts.innerHTML += "<li class='list-group-item'><input type='text' id='"+i+"' class='form-control' value='"+editedProducts[i]+"'></li>";
  newEditProductTxt.value = "";
}

// delete Product
function deleteProduct(elmnt, i){
  elmnt.parentElement.style.display="none";

  var project = projects[elmnt.id];
  var title = project.title;
  var desc = project.desc;
  var date = project.date;
  var products = project.products;
  
  products.splice(i,1);
  var newRef = projectRef.push();
  newRef.set({
      title: title,
      desc: desc,
      date: date,
      products: products
  }); 
  firebase.database().ref(userId+'/'+elmnt.id).remove();
}

// Show a search dropdown
function search(elmnt){
  var keyword = elmnt.id;
  var ddId = document.getElementById(keyword+'DD');
  var display;
  
  if (searchedKeywords.length == 0){
    searchedKeywords.push([keyword, 'false']);
  }
  for (var i=0; i<searchedKeywords.length; i++){
    if (searchedKeywords[i][0] == keyword){
      if(searchedKeywords[i][1] == 'false'){
        searchedKeywords[i][1]='true';
        display = searchedKeywords[i][1];
        break;
      } else {
        searchedKeywords[i][1]='false';
        display=searchedKeywords[i][1];
        break;
      }
    } else {
      searchedKeywords.push([keyword, 'false']);
    }
  }
  
  if (display=='true'){
    ddId.style.display = "grid";
    ddId.style.gridTemplateColumns = "1fr 1fr";
    ddId.style.gridGap="1em";
    ddId.innerHTML = "<button id='"+keyword+"' class='btn btn-default mt-2' onclick='searchAmzn(this)'><i class='fa fa-amazon'></i> Amazon</button><button id='"+keyword+"' class='btn btn-success mt-2' onclick='searchGoogle(this)'><i class='fa fa-google'></i> Google</button><button class='btn btn-link more-btn' id='"+keyword+"' onclick='searchMore(this)'><i class='fa fa-plus'></i> More</button>"; 
  } if (display=='false'){
    ddId.innerHTML = "";     
  }
}

// Search Amazon
function searchAmzn(elmnt){
  window.open("https://www.amazon.com/s/ref=nb_sb_noss_2/146-9958639-8760927?url=search-alias%3Daps&field-keywords="+elmnt.id);
}

//Search Google
function searchGoogle(elmnt){
  window.open("https://www.google.com/search?q="+elmnt.id);
}

// Search Michaels
function searchMichaels(elmnt){
  window.open("http://www.michaels.com/search?q="+elmnt.id);
}

// Search Walmart
function searchWalmart(elmnt){
  window.open("https://www.walmart.com/search/?query="+elmnt.id);
}

// Search Etsy
function searchEtsy(elmnt){
  window.open("https://www.etsy.com/search?q="+elmnt.id);
}

// Search Youtube
function searchYoutube(elmnt){
  window.open("https://www.youtube.com/results?search_query="+elmnt.id);
}

var currentKeyword;

// Search More
function searchMore(elmnt){
  currentKeyword = elmnt.id;
  
  elmnt.parentElement.innerHTML += "<button id='"+currentKeyword+"' class='btn btn-danger' onclick='searchYoutube(this)'><i class='fa fa-youtube-play'></i>  YouTube</button><button id='"+currentKeyword+"' class='btn btn-coral' onclick='searchEtsy(this)'><i class='fa fa-etsy'></i>  Etsy</button><button id='"+currentKeyword+"' class='btn btn-warning' onclick='searchWalmart(this)'> Walmart</button><button id='"+currentKeyword+"' class='btn btn-info' onclick='searchMichaels(this)'> Michaels</button>";
  document.getElementsByClassName('more-btn')[0].remove();
  //elmnt.parentNode.removeChild(elmnt);
}
