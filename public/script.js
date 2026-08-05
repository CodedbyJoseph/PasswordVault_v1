// file purpose:
// behaviour
// render to html
// STAGE 1: store temporary data
// STAGE 2: fetch account data from python

// save user accounts into array, mutable
const savedAccounts = [
    { site: "Gmail", username: "test@gmail.com", password: "hunter2" },
    { site: "Netflix", username: "testuser", password: "letmein123" },
    { site: "GitHub", username: "test-dev", password: "password1" },
];

// link var to parent html div element
const container = document.getElementById("saved-accounts");

// ------------------------------------------------------ FUNCTION TO RENDER ALL ACCOUNTS
function renderAccounts() {
    // clear existing entries; avoid duplicated entries on rerender
    // innerHTML property allows us to change inner elements/contents and have them reflect immediately
    // container still points to same object
    container.innerHTML = "";

    // iterate thru each array entry and index
    // forEach can have three potential parameters (element, index, array)
    savedAccounts.forEach((entry, index) => {
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

        // add delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        // add corresponding classes to style each part
        site.classList.add("style-site");
        username.classList.add("style-username");
        password.classList.add("style-password");
        deleteBtn.classList.add("style-delete");

        // append each text/button to row (forms as one line), append row to parent div
        row.appendChild(site);
        row.appendChild(username);
        row.appendChild(password);
        row.appendChild(deleteBtn);
        container.appendChild(row);

        // new event listener on each iteration, each button gets own listener and captured index
        deleteBtn.addEventListener("click", () => {
            savedAccounts.splice(index, 1); // starting at position 'index', remove 1 item (removes corresponding entry)
            renderAccounts();
        });
    });
}

// ------------------------------------------------------ INITIAL RENDER ON PAGE LOAD
renderAccounts();

// ------------------------------------------------------ UNHIDE ACCOUNT FORM ON BUTTON CLICK
// link vars to button and form
const showFormBtn = document.getElementById("show-form-btn");
const form = document.getElementById("add-account-form");

// remove hidden class from form on click event
showFormBtn.addEventListener("click", () => {
    form.classList.remove("hidden");
});

// ------------------------------------------------------ FUNCTION TO VALIDATE ENTRY INPUTS
// link var to html error message
const errorMessage = document.getElementById("err-msg")

function validateEntry() {
    // hide error message if not already hidden
    errorMessage.classList.add("hidden");

    // link vars to input forms
    const websiteInput = document.getElementById("website-input");
    const emailInput = document.getElementById("email-input");
    const passwordInput = document.getElementById("password-input");

    // check if any input form was not filled
    if (websiteInput.value === "" || emailInput.value === "" || passwordInput.value === "") {
        return [false];
    }

    return [true, websiteInput.value, emailInput.value, passwordInput.value];
}


// ------------------------------------------------------ SAVE AND RENDER NEW ENTRY ON BUTTON CLICK
// link var to button
const saveAccount = document.getElementById("save-new-account-btn")

// button click event
saveAccount.addEventListener("click", () => {
    // link var to boolean and input values
    // in case of inValid === false, next three elements of array === undefined
    const [isValid, site, username, password] = validateEntry()

    // check is valid
    if (isValid === true) {
        // append new entry into saved accounts
        savedAccounts.push(
            {site: site, username: username, password: password}
        );
    }

    // check is invalid
    else {
        // unhide error message
        errorMessage.classList.remove("hidden");
    }

    // rerender to show the new entry
    renderAccounts();
});
