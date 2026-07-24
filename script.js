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

// ------------------------------------------------------ function to render all acounts
function renderAccounts() {
    // clear existing entries; avoid duplicated entries on rerender
    container.innerHTML = "";

    // iterate thru each array entry
    savedAccounts.forEach(entry => {
        // create div element
        const row = document.createElement("div");

        // add text
        row.textContent = `Site: ${entry.site} Username: ${entry.username} Password: ${entry.password}`;

        // append div element to parent html div
        container.appendChild(row);
        });
}

// ------------------------------------------------------ initial render on page load
renderAccounts();

// ------------------------------------------------------ render account form on button click
// link vars to button and form
const showFormBtn = document.getElementById("show-form-btn");
const form = document.getElementById("add-account-form");

// remove hidden class from form on click event
showFormBtn.addEventListener("click", () => {
    form.classList.remove("hidden");
});

// ------------------------------------------------------ save and render new entry on button click
const saveAccount = document.getElementById("save-new-account")
saveAccount.addEventListener("click", () => {
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