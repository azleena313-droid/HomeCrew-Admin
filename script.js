import { db } from "./firebase.js";

import {
collection,
getDocs,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ---------------------------
// Admin Login
// ---------------------------

window.adminLogin = function(){

const username = document.getElementById("adminUser").value;
const password = document.getElementById("adminPass").value;

if(username==="admin" && password==="1234"){

localStorage.setItem("adminLoggedIn","true");

showDashboard();

}else{

alert("Invalid Login");

}

}

// ---------------------------
// Dashboard
// ---------------------------

function showDashboard(){

document.getElementById("adminLogin").classList.remove("active");
document.getElementById("adminDashboard").classList.add("active");

loadBookings();

}

// ---------------------------
// Logout
// ---------------------------

window.adminLogout=function(){

localStorage.removeItem("adminLoggedIn");

location.reload();

}

// ---------------------------
// Auto Login
// ---------------------------

window.onload=function(){

if(localStorage.getItem("adminLoggedIn")=="true"){

showDashboard();

}

}

// ---------------------------
// Load Bookings
// ---------------------------

window.loadBookings=async function(){

const bookingList=document.getElementById("bookingList");

bookingList.innerHTML="Loading...";

const snapshot=await getDocs(collection(db,"bookings"));

let html="";

snapshot.forEach((documentData)=>{

const booking=documentData.data();

html+=`

<div class="bookingCard">

<h4>${booking.service}</h4>

<p><b>Name:</b> ${booking.name}</p>

<p><b>Mobile:</b> ${booking.mobile}</p>

<p><b>Address:</b> ${booking.address}</p>

<p><b>Status:</b> ${booking.status}</p>

<div class="bookingActions">

<button class="acceptBtn"
onclick="updateStatus('${documentData.id}','Accepted')">

Accept

</button>

<button class="rejectBtn"
onclick="updateStatus('${documentData.id}','Rejected')">

Reject

</button>

<button class="completeBtn"
onclick="updateStatus('${documentData.id}','Completed')">

Completed

</button>

</div>

</div>

`;

});

bookingList.innerHTML=html;

}

// ---------------------------
// Update Booking Status
// ---------------------------

window.updateStatus=async function(id,status){

await updateDoc(doc(db,"bookings",id),{

status:status

});

alert("Updated Successfully");

loadBookings();

}

// ---------------------------
// Complaints
// ---------------------------

window.loadComplaints=async function(){

const complaintList=document.getElementById("complaintList");

const snapshot=await getDocs(collection(db,"complaints"));

let html="";

snapshot.forEach((docData)=>{

const c=docData.data();

html+=`

<div class="bookingCard">

<p><b>Name:</b> ${c.name}</p>

<p><b>Complaint:</b> ${c.complaint}</p>

</div>

`;

});

complaintList.innerHTML=html;

}
