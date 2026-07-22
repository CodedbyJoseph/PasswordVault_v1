// js renders data into html
// UI behaviour
// manage calls to backend (fetch)

// save user passwords into array, mutable
// use fake data for stage 1
const savedPasswords = [
    { site: "Gmail", username: "test@gmail.com", password: "hunter2" },
    { site: "Netflix", username: "testuser", password: "letmein123" },
    { site: "GitHub", username: "test-dev", password: "password1" }
];

// reference to parent html div element
const container = document.getElementById("saved-passwords");

// iterate thru each entry
savedPasswords.forEach(entry => {
    // create div element
    const row = document.createElement("div");
    // add text
    row.textContent = `Site: ${entry.site} Username: ${entry.username} Password: ${entry.password}`;
    // append element to parent div
    container.appendChild(row);
});
