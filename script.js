// file purpose:
// behaviour
// render to html
// store temporary data
// fetch from python

// save user accounts into array, mutable
const savedAccounts = [
    { site: "Gmail", username: "test@gmail.com", password: "hunter2" },
    { site: "Netflix", username: "testuser", password: "letmein123" },
    { site: "GitHub", username: "test-dev", password: "password1" }
];

// link var to parent html div element
const container = document.getElementById("saved-accounts");

// ------------------------------------------------------ function to render all accounts
function renderAccounts() {
    // clear existing entries; avoid duplicated entries on rerender
    // innerHTML property allows us to change inner elements/contents and have them reflect immediately
    // container still points to same object
    container.innerHTML = "";

    // iterate thru each array entry
    savedAccounts.forEach(entry => {
        // create div element
        const row = document.createElement("div");

        // add text as three individual elements
        // use span as a container that doesn't create new line
        const site = document.createElement("span");
        site.textContent = `Site: ${entry.site}`;

        const username = document.createElement("span");
        username.textContent = `Username: ${entry.username}`;

        const password = document.createElement("span");
        password.textContent = `Password: ${entry.password}`;

        // append each text to row as one line, append row to parent div
        row.appendChild(site);
        row.appendChild(username);
        row.appendChild(password);
        container.appendChild(row);
        });
}

// ------------------------------------------------------ initial render on page load
renderAccounts();

// ------------------------------------------------------ unhide account form on button click
// link vars to button and form
const showFormBtn = document.getElementById("show-form-btn");
const form = document.getElementById("add-account-form");

// remove hidden class from form on click event
showFormBtn.addEventListener("click", () => {
    form.classList.remove("hidden");
});


// link var to html error message
const errorMessage = document.getElementById("err-msg")

// ------------------------------------------------------ function to validate entry inputs
function validateEntry() {
    // hide error message if not already hidden
    form.classList.add("hidden");

    // check if any input box is empty
    // if empty, return false, else return true
    // update button click to only act on true
}


// ------------------------------------------------------ save and render new entry on button click
// link var to button
const saveAccount = document.getElementById("save-new-account")
saveAccount.addEventListener("click", () => {
    // link vars to input forms
    const websiteInput = document.getElementById("website-input");
    const emailInput = document.getElementById("email-input");
    const passwordInput = document.getElementById("password-input");

    // append new entry values into saved accounts array
    savedAccounts.push({
        site: websiteInput.value,
        username: emailInput.value,
        password: passwordInput.value
    });

    // rerender to show the new entry
    renderAccounts();
});

// ------------------------------------------------------ unhide error message on invalid entry

