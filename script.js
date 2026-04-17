/* ---------- LOGIN ---------- */
function login(){
let u = document.getElementById("user").value;
let p = document.getElementById("pass").value;

if(u && p){
window.location = "dashboard.html";
} else {
alert("Enter username and password");
}
}

/* ---------- ADD BOOK ---------- */
function addBook(){
let name = document.getElementById("name").value;
let author = document.getElementById("author").value;

if(!name || !author){
alert("All fields required");
return;
}

let books = JSON.parse(localStorage.getItem("books")) || [];

books.push({
name,
author,
available: true,
issueDate: null,
returnDate: null
});

localStorage.setItem("books", JSON.stringify(books));

alert("Book Added Successfully");
}

/* ---------- LOAD BOOKS FOR ISSUE ---------- */
let allBooks = [];

function loadBooks(){
  allBooks = JSON.parse(localStorage.getItem("books")) || [];
  renderBooks(allBooks);
}

function renderBooks(list){
  let html = "";

  let availableBooks = list.filter(b => b.available);

  if(availableBooks.length === 0){
    document.getElementById("noBooks").style.display = "block";
  } else {
    document.getElementById("noBooks").style.display = "none";
  }

  availableBooks.forEach((b, i)=>{
    html += `
      <label class="book-item">
        <input type="radio" name="book" onclick="selectBook(${i})">
        <span>${b.name} - ${b.author}</span>
      </label>
    `;
  });

  document.getElementById("bookList").innerHTML = html;
}

function filterBooks(){
  let search = document.getElementById("search").value.toLowerCase();

  let filtered = allBooks.filter(b =>
    b.name.toLowerCase().includes(search) ||
    b.author.toLowerCase().includes(search)
  );

  renderBooks(filtered);
}

/* ---------- ISSUE BOOK ---------- */
function issueBook(){
let books = JSON.parse(localStorage.getItem("books")) || [];

if(selectedBook === -1){
  document.getElementById("error").innerText = "Please select a book";
  return;
}


let issue = document.getElementById("issue").value;
let ret = document.getElementById("return").value;

if(!issue || !ret){
alert("Fill all fields");
return;
}

let today = new Date().toISOString().split("T")[0];

if(issue < today){
alert("Issue date cannot be in past");
return;
}

books[selectedBook].available = false;
books[selectedBook].issueDate = issue;
books[selectedBook].returnDate = ret;

localStorage.setItem("books", JSON.stringify(books));

alert("Book Issued Successfully");
}

/* ---------- RETURN BOOK ---------- */
function returnBook(){
let name = document.getElementById("bookName").value;

let books = JSON.parse(localStorage.getItem("books")) || [];

let found = books.find(b => b.name === name);

if(!found){
alert("Book not found");
return;
}

let today = new Date();
let returnDate = new Date(found.returnDate);

let fine = 0;

if(today > returnDate){
let diff = Math.ceil((today - returnDate) / (1000*60*60*24));
fine = diff * 5; // ₹5 per day
}

found.available = true;

localStorage.setItem("books", JSON.stringify(books));

if(fine > 0){
alert("Late return! Fine = ₹" + fine);
} else {
alert("Book Returned Successfully");
}
}
