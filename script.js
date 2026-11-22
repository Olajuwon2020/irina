
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
    "loadingPage",
    "successPage",
    "transferPage",
    "promptPage",
    "paymentPage",
    "noticePage"
];


function showPage(pageName) {

    pages.forEach(function(page) {

        document.getElementById(page)
            .classList.add("d-none");

    });

    document.getElementById(pageName)
        .classList.remove("d-none");

}


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

function startVerification() {

    let frontID =
        document.getElementById("frontID").files[0];

    let backID =
        document.getElementById("backID").files[0];

    if (!frontID || !backID) {

        alert("Please select both sample images.");

        return;

    }

    showPage("loadingPage");

    setTimeout(function() {

        transaction.verificationStatus = "Demo completed";

        saveTransaction();

        showPage("successPage");

    }, 2000);

}


// ======================================
// 6. TRANSFER AMOUNT
// ======================================

function showPrompt() {

    let amount = Number(
        document.getElementById("transferAmount").value
    );

    if (!Number.isFinite(amount) || amount <= 0) {

        alert("Enter a valid demonstration amount.");

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

    fee: "5000",

    chime: {

        name: "Chime Gateway",

        reference: "CHIME-AML-102",

        account: "SAMPLE-CHIME-001",

        accountName: "Demo Recipient",

        description: "Fictional Chime demonstration details."

    },

    olajuwon: {

        name: "Olajuwon Demo Gateway",

        reference: "OLJ-DEMO-205",

        account: "SAMPLE-OLJ-002",

        accountName: "Demo Recipient",

        description: "Fictional Olajuwon demonstration details."

    },

    crypto: {

        name: "Cryptocurrency Demo Gateway",

        reference: "CRYPTO-DEMO-309",

        account: "SAMPLE-WALLET-003",

        accountName: "Demo Wallet",

        description: "Fictional cryptocurrency demonstration details."

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

    let fee =
        document.getElementById("editFee").value;

    if (fee === "" || !Number.isFinite(Number(fee)) || Number(fee) < 0) {

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
