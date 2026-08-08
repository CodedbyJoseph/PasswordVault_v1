// file purpose:
// behaviour
// render to html
// STAGE 1: store hardcoded nonpersisting data
// STAGE 2: fetch account data from python

// fetch: starts the retrieval request and immediately returns a Promise (empty placeholder) and continues code execution
// await: do not move on until real data substitutes the promise
// await must be used within async function
// calling the function w/o await will return a promise and move on

// save user accounts into array, mutable
let savedAccounts = [];

// link vars to each input box element
const websiteInput = document.getElementById("website-input");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");

// ------------------------------------------------------ FUNCTION TO FETCH SUPABASE DATA INTO savedAccounts
async function loadAccounts() {
    const response = await fetch("/api/accounts");
    savedAccounts = await response.json();  // [{id: 1, site: __, username: __, password: __}]
}

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
    savedAccounts.forEach((entry) => {
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

        // new event listener that persists on each iteration, each button gets own listener
        deleteBtn.addEventListener("click", async () => {
            // delete row from database by id
            await fetch(`/api/accounts/${entry.id}`, {method: "DELETE"});

            // re-load accounts, then re-render
            await loadAccounts();
            renderAccounts();
        });
    });
}

// ------------------------------------------------------ INITIAL RENDER ON PAGE LOAD
// loadaccounts and await real values (has promise due to async func above), then renderaccounts
loadAccounts().then(renderAccounts);

// note: can't use await here b/c we are calling async func

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
saveAccount.addEventListener("click", async () => {
    // link vars to boolean and input values
    // in case of isValid === false, next three elements of array === undefined
    const [isValid, site, username, password] = validateEntry()

    // check is valid
    if (isValid === true) {
        // post new entry into database
        await fetch("/api/accounts", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({site: site, username: username, password: password})
        });

        websiteInput.value = "";
        emailInput.value = "";
        passwordInput.value = "";

        // re-load accounts and do not move on until response fills promise
        await loadAccounts();

        // re-render
        renderAccounts();
    }

    // check is invalid
    else {
        // unhide error message
        errorMessage.classList.remove("hidden");
    }
});
