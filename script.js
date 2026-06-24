// ==========================================
// HOMECREW ADMIN V2.0
// PART 1
// ==========================================

import { db } from "./firebase.js";

import {
collection,
getDocs,
doc,
updateDoc,
addDoc   
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ==========================================
// LOGIN
// ==========================================

window.adminLogin = async function () {

    const username = document
        .getElementById("adminUsername")
        .value
        .trim();

    const password = document
        .getElementById("adminPassword")
        .value
        .trim();

    if (username === "admin" && password === "1234") {

        localStorage.setItem("adminLoggedIn", "true");

        document.getElementById("adminLogin").style.display = "none";

        document.getElementById("adminDashboard").style.display = "flex";

        await loadBookings();
        await loadComplaints();
        await loadCustomers();
        await loadWorkers();
        await updateDashboardStats();

    } else {

        document.getElementById("loginError").textContent =
            "Invalid username or password.";

    }

};

// ==========================================
// LOGOUT
// ==========================================

window.adminLogout = function () {

    localStorage.removeItem("adminLoggedIn");

    location.reload();

};

// ==========================================
// AUTO LOGIN
// ==========================================

window.onload = async function () {

    if (localStorage.getItem("adminLoggedIn") === "true") {

        document.getElementById("adminLogin").style.display = "none";

        document.getElementById("adminDashboard").style.display = "flex";

        await loadBookings();
        await loadComplaints();
        await updateDashboardStats();

    }

};
// ==========================================
// LOAD BOOKINGS
// ==========================================

window.loadBookings = async function () {

    const bookingTable = document.getElementById("bookingTable");

    bookingTable.innerHTML = "";

    const snapshot = await getDocs(collection(db, "bookings"));

    snapshot.forEach((bookingDoc) => {

        const booking = bookingDoc.data();

        const status = booking.status || "Pending";

        bookingTable.innerHTML += `

<tr>

<td>${booking.name || ""}</td>

<td>
<a href="tel:${booking.mobile || ""}">
${booking.mobile || ""}
</a>
</td>

<td>${booking.service || ""}</td>

<td>${booking.date || ""}</td>

<td>${booking.time || ""}</td>

<td>

<span class="status ${status.toLowerCase()}">

${status}

</span>

</td>

<td>

<button
class="acceptBtn"
onclick="updateStatus('${bookingDoc.id}','Accepted')">

Accept

</button>

<button
class="rejectBtn"
onclick="updateStatus('${bookingDoc.id}','Rejected')">

Reject

</button>

<button
class="completeBtn"
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

};

// ==========================================
// UPDATE BOOKING STATUS
// ==========================================

window.updateStatus = async function (id, status) {

    await updateDoc(
        doc(db, "bookings", id),
        {
            status: status
        }
    );

    alert("Booking updated successfully.");

    await loadBookings();

    await updateDashboardStats();

};
// ==========================================
// DASHBOARD STATISTICS
// ==========================================

window.updateDashboardStats = async function () {

    const snapshot = await getDocs(collection(db, "bookings"));

    let total = 0;
    let pending = 0;
    let accepted = 0;
    let completed = 0;
    let rejected = 0;

    snapshot.forEach((bookingDoc) => {

        total++;

        const booking = bookingDoc.data();

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

            default:
                pending++;
                break;
        }

    });

    document.getElementById("totalBookings").textContent = total;
    document.getElementById("pendingBookings").textContent = pending;
    document.getElementById("acceptedBookings").textContent = accepted;
    document.getElementById("completedBookings").textContent = completed;
    document.getElementById("rejectedBookings").textContent = rejected;

};

// ==========================================
// SEARCH BOOKINGS
// ==========================================

function filterBookings() {

    const searchText = document
        .getElementById("searchBox")
        .value
        .toLowerCase();

    const selectedDate = document
        .getElementById("dateFilter")
        .value;

    const rows = document.querySelectorAll("#bookingTable tr");

    rows.forEach((row) => {

        const rowText = row.innerText.toLowerCase();

        let show = true;

        if (searchText !== "" && !rowText.includes(searchText)) {
            show = false;
        }

        if (selectedDate !== "" && !rowText.includes(selectedDate)) {
            show = false;
        }

        row.style.display = show ? "" : "none";

    });

}

// ==========================================
// SEARCH EVENTS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const searchBox = document.getElementById("searchBox");
    const dateFilter = document.getElementById("dateFilter");

    if (searchBox) {
        searchBox.addEventListener("keyup", filterBookings);
    }

    if (dateFilter) {
        dateFilter.addEventListener("change", filterBookings);
    }

});
// ==========================================
// LOAD COMPLAINTS
// ==========================================

window.loadComplaints = async function () {

    const complaintList = document.getElementById("complaintList");

    if (!complaintList) return;

    complaintList.innerHTML = "";

    try {

        const snapshot = await getDocs(collection(db, "complaints"));

        if (snapshot.empty) {

            complaintList.innerHTML = `
                <div class="bookingCard">
                    <p>No complaints found.</p>
                </div>
            `;

            return;
        }

        snapshot.forEach((complaintDoc) => {

            const complaint = complaintDoc.data();

            complaintList.innerHTML += `

            <div class="bookingCard">

                <h3>${complaint.name || "Customer"}</h3>

                <p><strong>Mobile:</strong> ${complaint.mobile || "-"}</p>

                <p><strong>Complaint:</strong></p>

                <p>${complaint.complaint || "-"}</p>

            </div>

            `;

        });

    } catch (error) {

        console.error(error);

        complaintList.innerHTML = `
            <div class="bookingCard">
                <p>Unable to load complaints.</p>
            </div>
        `;

    }

};

// ==========================================
// REFRESH DASHBOARD
// ==========================================

window.refreshDashboard = async function () {

    await loadBookings();

    await loadComplaints();

    await updateDashboardStats();

};

console.log("✅ HomeCrew Admin Loaded Successfully");
// ===============================
// LOAD CUSTOMERS
// ===============================

window.loadCustomers = async function () {

    const customerTable =
        document.getElementById("customerTable");

    if (!customerTable) return;

    customerTable.innerHTML = "";

    const snapshot =
        await getDocs(collection(db, "bookings"));

    const customers = {};

    snapshot.forEach((doc) => {

        const booking = doc.data();

        if (!customers[booking.mobile]) {

            customers[booking.mobile] = {
                name: booking.name,
                mobile: booking.mobile,
                bookings: 0
            };

        }

        customers[booking.mobile].bookings++;

    });

    Object.values(customers).forEach((customer) => {

        customerTable.innerHTML += `

<tr>

<td>${customer.name}</td>

<td>${customer.mobile}</td>

<td>${customer.bookings}</td>

<td>

<a href="tel:${customer.mobile}">
<button class="acceptBtn">
📞 Call
</button>
</a>

<a href="https://wa.me/91${customer.mobile}"
target="_blank">

<button class="completeBtn">
💬 WhatsApp
</button>

</a>

</td>

</tr>

`;

    });

}
// =====================================
// WORKERS MODULE
// =====================================

window.loadWorkers = async function () {

    const table =
        document.getElementById("workersTable");

    if (!table) return;

    table.innerHTML = "";

    const snapshot =
        await getDocs(collection(db, "workers"));

    snapshot.forEach((workerDoc) => {

        const worker = workerDoc.data();

        table.innerHTML += `

        <tr>

        <td>${worker.name || "-"}</td>

        <td>${worker.mobile || "-"}</td>

        <td>${worker.skill || "-"}</td>

        <td>
        <span class="status accepted">
        ${worker.status || "Available"}
        </span>
        </td>

        <td>

        <a href="tel:${worker.mobile}">
        <button class="acceptBtn">
        📞 Call
        </button>
        </a>

        <a href="https://wa.me/91${worker.mobile}"
        target="_blank">
        <button class="completeBtn">
        💬 WhatsApp
        </button>
        </a>

        </td>

        </tr>

        `;

    });

}
window.addWorker = async function () {

    const name =
        document.getElementById("workerName").value.trim();

    const mobile =
        document.getElementById("workerMobile").value.trim();

    const skill =
        document.getElementById("workerSkill").value;

    if (!name || !mobile || !skill) {

        alert("Please fill all fields");

        return;
    }

    await addDoc(collection(db, "workers"), {

        name: name,
        mobile: mobile,
        skill: skill,
        status: "Available"

    });

    alert("Worker Added Successfully");

    document.getElementById("workerName").value = "";
    document.getElementById("workerMobile").value = "";
    document.getElementById("workerSkill").value = "";

    loadWorkers();

}
