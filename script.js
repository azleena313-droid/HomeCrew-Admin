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

function showDashboard() {

    document.getElementById("adminLogin").classList.remove("active");
    document.getElementById("adminDashboard").classList.add("active");

    loadBookings();

    loadComplaints();

    updateDashboardStats();

}

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

window.loadBookings = async function () {

    const table = document.getElementById("bookingTable");

    table.innerHTML = "";

    const snapshot = await getDocs(collection(db, "bookings"));

    snapshot.forEach((bookingDoc) => {

        const booking = bookingDoc.data();

        table.innerHTML += `

<tr>

<td>${booking.name}</td>

<td>
<a href="tel:${booking.mobile}">
${booking.mobile}
</a>
</td>

<td>${booking.service}</td>

<td>${booking.date}</td>

<td>${booking.time}</td>

<td>

<span class="status ${booking.status.toLowerCase()}">

${booking.status}

</span>

</td>

<td>

<button class="acceptBtn"
onclick="updateStatus('${bookingDoc.id}','Accepted')">

Accept

</button>

<button class="rejectBtn"
onclick="updateStatus('${bookingDoc.id}','Rejected')">

Reject

</button>

<button class="completeBtn"
onclick="updateStatus('${bookingDoc.id}','Completed')">

Complete

</button>

<a
href="https://wa.me/91${booking.mobile}"
target="_blank">

<button class="acceptBtn">

WhatsApp

</button>

</a>

</td>

</tr>

`;

    });

}

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
async function updateDashboardStats() {

    const snapshot = await getDocs(collection(db, "bookings"));

    let total = 0;
    let pending = 0;
    let accepted = 0;
    let completed = 0;
    let rejected = 0;

    snapshot.forEach((doc) => {

        total++;

        const booking = doc.data();

        switch (booking.status) {

            case "Pending":
                pending++;
                break;

            case "Accepted":
                accepted++;
                break;

            case "Completed":
                completed++;
                break;

            case "Rejected":
                rejected++;
                break;

        }

    });

    document.getElementById("totalBookings").textContent = total;
    document.getElementById("pendingBookings").textContent = pending;
    document.getElementById("acceptedBookings").textContent = accepted;
    document.getElementById("completedBookings").textContent = completed;
    document.getElementById("rejectedBookings").textContent = rejected;
document.getElementById("searchBox")
.addEventListener("keyup", filterBookings);
document.getElementById("dateFilter")
.addEventListener("change", filterBookings);
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
function filterBookings() {

    const search = document
        .getElementById("searchBox")
        .value
        .toLowerCase();

    const selectedDate = document
        .getElementById("dateFilter")
        .value;

    const rows = document.querySelectorAll("#bookingTable tr");

    rows.forEach(row => {

        const text = row.innerText.toLowerCase();

        let show = true;

        if (search !== "" && !text.includes(search))
            show = false;

        if (selectedDate !== "" && !text.includes(selectedDate))
            show = false;

        row.style.display = show ? "" : "none";

    });

}
// ===============================
// ADMIN LOGIN
// ===============================

window.adminLogin = function () {

    const username = document.getElementById("adminUsername").value.trim();
    const password = document.getElementById("adminPassword").value.trim();

    if (username === "admin" && password === "1234") {

        document.getElementById("adminLogin").style.display = "none";

        document.getElementById("adminDashboard").style.display = "flex";

        loadBookings();
        loadComplaints();
        updateDashboardStats();

    } else {

        document.getElementById("loginError").innerHTML =
            "❌ Invalid Username or Password";

    }

}
