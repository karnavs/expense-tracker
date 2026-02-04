//modeled transactions as objects, managed state in JS, rendered dynamic UI using DOM manipulations, and implemented validation and structured updates.

const startingBalance = 2000000; // Initial balance
let transactions = [];
function getTotalExpenses(){
    let sum = 0;

    for(let tx of transactions){
        sum += tx.amount;   
    }
    return sum;
}
function getTransactionCount(){
    return transactions.length;
}
function getAverageExpense(){
    if(transactions.length === 0) return 0;
    return  Math.round((getTotalExpenses() / transactions.length) * 100) / 100;
}
function getBalance(){
    return startingBalance - getTotalExpenses();
}


const addBtn = document.getElementById("add-expense-btn");

    if(addBtn){
        addBtn.addEventListener("click", function () {
    let inputBox = document.getElementById("expense-input");
    let input = inputBox.value.trim();
    let amount = Number(input);
    let title = document.getElementById("expense-title").value.trim();
        
    

    if (title === "" || input === "" || amount <= 0 || isNaN(amount)) {

        const card = document.querySelector(".add-expense");
        card.classList.add("shake");

        setTimeout(() => {
            card.classList.remove("shake");
        }, 300);
        inputBox.value = "";
        document.getElementById("expense-title").value = "";

        return; 
    }

    transactions.push({
        id: Date.now(),
        title: title,
        amount: amount,
        time: new Date()
    });
    DataService.saveTransactions(transactions);
    updateUI(); //function to update the UI
    
    inputBox.value = "";        //clear input box
    console.log("Expense Added: " + amount);
    });
}

const amountInput = document.getElementById("expense-input");
const titleInput = document.getElementById("expense-title");

if(amountInput && titleInput){
    amountInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("expense-title").focus();
    }
        titleInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            document.getElementById("add-expense-btn").click();
        }
        });
    });
}



function updateUI() {
    const balanceEl = document.getElementById("total-balance");
    const totalSpentEl = document.getElementById("total-spent");
    const countEl = document.getElementById("transaction-count");
    const avgEl = document.getElementById("average-expense");

    if (balanceEl) {
        balanceEl.textContent = getBalance().toLocaleString("en-IN", {
            style: "currency",
            currency: "INR"
        });
    }

    if (totalSpentEl) {
        totalSpentEl.textContent = getTotalExpenses().toLocaleString("en-IN", {
            style: "currency",
            currency: "INR"
        });
    }

    if (countEl) {
        countEl.textContent = `${getTransactionCount()}`;
    }

    if (avgEl) {
        avgEl.textContent = getAverageExpense().toLocaleString("en-IN", {
            style: "currency",
            currency: "INR"
        });
    }

    renderTransactions();
}



function renderTransactions() {
    const list = document.getElementById("transaction-list");
    const emptyState = document.getElementById("empty-state");
    if(!list || !emptyState) return;
    list.innerHTML = "";

    if(transactions.length === 0) {
        emptyState.style.display = "block";
        return;
    }
    emptyState.style.display = "none";

    for (let i = transactions.length - 1; i >= 0; i--) {
    let tx = transactions[i];

    let li = document.createElement("li");
    li.classList.add("tx-item");
    let formattedTime = new Date(tx.time).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
    });

    li.innerHTML = `
        <div class="tx-left">
            <div class="tx-title">${tx.title}</div>
            <div class="tx-time">${formattedTime}</div>
        </div>

        <div class="tx-right">
            <span class="tx-amount">
                ${tx.amount.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
            </span>
            <button class="tx-delete" onclick="deleteTransaction(${tx.id})">✕</button>
        </div>
    `;

    list.appendChild(li);
}

}

//function to delete a transaction

function deleteTransaction(id){
    transactions = transactions.filter(tx => tx.id !== id);
    DataService.saveTransactions(transactions);
    updateUI();
}

//reset button logic
const resetBtn = document.getElementById("reset-btn");

if (resetBtn) {
    resetBtn.addEventListener("click", function () {
        const confirmReset = confirm("This will delete all transactions. Are you sure?");
        if (!confirmReset) return;

        transactions = [];
        DataService.saveTransactions(transactions);
        updateUI();
    });
}


//export and import logic
const exportBtn = document.getElementById("export-btn");

if (exportBtn) {
    exportBtn.addEventListener("click", function () {
        const data = JSON.stringify(transactions, null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "transactions.json";
        a.click();
        URL.revokeObjectURL(url);
    });
}
//import logic
const importBtn = document.getElementById("import-btn");
const importFile = document.getElementById("import-file");

if (importBtn && importFile) {

    importBtn.addEventListener("click", function () {
        importFile.click();
    });

    importFile.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (event) {
            try {
                const parsed = JSON.parse(event.target.result);

                if (!Array.isArray(parsed)) {
                    alert("Invalid file format");
                    return;
                }

                transactions = parsed;
                DataService.saveTransactions(transactions);
                updateUI();
            } catch {
                alert("Invalid JSON file");
            }
        };

        reader.readAsText(file);
    });

}

const DataService ={
    getTransactions(){
        const saved = localStorage.getItem("transactions");
        if(!saved) return [];

        try{
            const parsed = JSON.parse(saved);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    },
    
    saveTransactions(transactions){
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }
};

// Initial load
transactions = DataService.getTransactions();
updateUI();