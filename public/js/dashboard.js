const addBtn = document.getElementById("addExpense");
const buyPremium = document.getElementById("byPremium");
const leaderboardBtn = document.getElementById("learderBoard");
const token = localStorage.getItem("token");
const leaderboardSection = document.getElementById('leaderboardSection');
const leaderboardList = document.getElementById('leaderboardList');
const backToExpensesBtn = document.getElementById('backToExpensesBtn');
const expenseSection = document.getElementById('expenseSection');
const descriptionInput = document.getElementById("description");
const category = document.getElementById("category");

if (!token) {
  window.location.href = "index.html";
}
const config = {
  headers: { Authorization: token },
};

function showPremiumUI() {
  buyPremium.textContent = "You are a Premium User";
  buyPremium.disabled = true;
  buyPremium.style.backgroundColor = "#16a34a";
  buyPremium.style.cursor = "default";
  leaderboardBtn.style.display='inline-block'
}

if (localStorage.getItem("isPremium") === "true") {
  showPremiumUI();
}

buyPremium.addEventListener("click", async () => {
  try {
    const cashfree = Cashfree({ mode: "sandbox" });
    const response = await axios.post(
      "http://localhost:3000/purchase/premiummembership",
      {},
      config,
    );
    const { payment_session_id, order_id } = response.data;

    await cashfree.checkout({
      paymentSessionId: payment_session_id,
      redirectTarget: "_modal",
    });

    await verifyTransaction(order_id);
  } catch (error) {
    alert("TRANSACTION FAILED");
  }
});

async function verifyTransaction(orderId) {
  try {
    const response = await axios.post(
      "http://localhost:3000/purchase/updatetransactionstatus",
      { order_id: orderId },
      config,
    );
    if (response.data.success) {
      localStorage.setItem("isPremium", "true");
      showPremiumUI();
      alert("Transaction successful");
    } else {
      alert("TRANSACTION FAILED");
    }
  } catch (error) {
    alert("TRANSACTION FAILED");
  }
}

addBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const amount = document.getElementById("amount").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  const form = document.querySelector("form");

  try {
    await axios.post(
      "http://localhost:3000/user/",
      {
        amount,
        description,
        category,
      },
      config,
    );
    form.reset();
    display();
  } catch (error) {
    console.error("Error Submitting data", error);
    alert("Faild to Add");
  }
});

const aiStatus =document.getElementById('aiStatus');
let typingTimer;


descriptionInput.addEventListener("input", async () => {
  clearTimeout(typingTimer);
  const description = descriptionInput.value.trim();

  if (description.length < 3) {
    aiStatus.textContent ="";
    return;
    }
    aiStatus.textContent = "✨ AI thinking...";
  aiStatus.style.color = "#2563eb";
  typingTimer = setTimeout (async()=>{

  
  try {
    const response = await axios.post(
      "http://localhost:3000/user/suggestCategory",
      { description },
      config
    );

      console.log("AI Response:", response.data); 
    const suggestedCategory = response.data.category;

    const validOptions = ["movie", "fuel", "food", "grocery", "electronic"];
    if (validOptions.includes(suggestedCategory)) {
      category.value = suggestedCategory;
      aiStatus.textContent = `✨ AI selected: ${suggestedCategory.toUpperCase()}`;
        aiStatus.style.color = "#16a34a";
    }
  } catch (error) {
    console.error("AI category suggestion failed:", error);
  } finally {
      addBtn.disabled = false;
      addBtn.style.opacity = "1";
    }
},600);
});


async function display() {
  try {
    const ul = document.getElementById("list");
    ul.innerHTML = "";
    const response = await axios.get("http://localhost:3000/user/", config);
    response.data.forEach((user) => {
      const li = document.createElement("li");
      li.textContent =
        user.amount + " " + user.description + " " + user.category;

      const addDeleteButton = document.createElement("button");
      addDeleteButton.type = "button";
      addDeleteButton.textContent = " Delete ";

      addDeleteButton.addEventListener("click", async () => {
        try {
          await axios.delete(`http://localhost:3000/user/${user.id}`, config);
          display();
        } catch (error) {
          console.error("Delete Error", error);
        }
      });

      li.appendChild(addDeleteButton);
      ul.appendChild(li);
    });

leaderboardBtn.addEventListener('click', async () => {
    try {
        const response = await axios.get('http://localhost:3000/premium/leaderboard', config);

        expenseSection.style.display = 'none';
        leaderboardSection.style.display = 'block';
        leaderboardList.innerHTML = '';

        response.data.forEach((entry, index) => {
            const li = document.createElement('li');
            li.style.padding = '12px 16px';
            li.style.marginBottom = '10px';
            li.style.background = '#f9f9f9';
            li.style.borderLeft = '5px solid #2563eb';
            li.style.borderRadius = '4px';
            li.textContent = `#${index + 1} - ${entry.name} : Total Expense ₹${entry.totalExpense ||0}`;
            leaderboardList.appendChild(li);
        });
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        alert('Could not load leaderboard');
    }
}); 






// Switch back to Expense Dashboard view
backToExpensesBtn.addEventListener('click', () => {
    leaderboardSection.style.display = 'none';
    expenseSection.style.display = 'block';
});
  } catch (error) {
    console.error("Form is not working");
  }
}

// --- Day to Day Expenses Report & CSV Download Functionality ---
const showReportBtn = document.getElementById("showReportBtn");
const reportSection = document.getElementById("reportSection");
const backFromReportBtn = document.getElementById("backFromReportBtn");
const reportFilter = document.getElementById("reportFilter");
const downloadReportBtn = document.getElementById("downloadReportBtn");
const reportTableBody = document.getElementById("reportTableBody");
const reportTableFoot = document.getElementById("reportTableFoot");
const yearlyReportBody = document.getElementById("yearlyReportBody");
const notesReportBody = document.getElementById("notesReportBody");

let cachedExpenses = [];

function updateDownloadButtonState() {
  const isPremium = localStorage.getItem("isPremium") === "true";
  downloadReportBtn.disabled = !isPremium;
  downloadReportBtn.style.opacity = isPremium ? "1" : "0.5";
  downloadReportBtn.style.cursor = isPremium ? "pointer" : "not-allowed";
}
updateDownloadButtonState();

showReportBtn.addEventListener("click", async () => {
  try {
    const response = await axios.get("http://localhost:3000/user/", config);
    cachedExpenses = response.data;

    const now = new Date();
    document.getElementById("reportTimestamp").textContent = now.toLocaleString("en-IN");
    document.getElementById("reportYear").textContent = now.getFullYear();
    document.getElementById("reportMonth").textContent = now.toLocaleString("en-IN", {
      month: "long",
      year: "numeric",
    });
    document.getElementById("notesReportHeading").textContent = `Notes Report ${now.getFullYear()}`;

    expenseSection.style.display = "none";
    leaderboardSection.style.display = "none";
    reportSection.style.display = "block";

    updateDownloadButtonState();
    renderReportTables(reportFilter.value);
  } catch (error) {
    console.error("Failed to load report:", error);
  }
});

backFromReportBtn.addEventListener("click", () => {
  reportSection.style.display = "none";
  expenseSection.style.display = "block";
});

reportFilter.addEventListener("change", (e) => {
  renderReportTables(e.target.value);
});

function renderReportTables(filter) {
  const now = new Date();

  const filtered = cachedExpenses.filter((item) => {
    const itemDate = new Date(item.createdAt);
    if (filter === "daily") {
      return itemDate.toDateString() === now.toDateString();
    }
    if (filter === "weekly") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return itemDate >= sevenDaysAgo && itemDate <= now;
    }
    if (filter === "monthly") {
      return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  reportTableBody.innerHTML = "";
  notesReportBody.innerHTML = "";

  let totalIncome = 0;
  let totalExpense = 0;

  filtered.forEach((item, index) => {
    const dateStr = new Date(item.createdAt).toLocaleDateString("en-GB");
    const cat = item.category.toLowerCase();
    const isIncome = cat === "salary" || cat === "income";
    const incomeVal = isIncome ? Number(item.amount) : 0;
    const expenseVal = !isIncome ? Number(item.amount) : 0;

    totalIncome += incomeVal;
    totalExpense += expenseVal;

    const rowBg = index % 2 === 0 ? "#ffffff" : "#f3f4f6";
    const tr = document.createElement("tr");
    tr.style.backgroundColor = rowBg;
    tr.innerHTML = `
      <td style="padding: 6px 8px;">${dateStr}</td>
      <td style="padding: 6px 8px;">${item.description}</td>
      <td style="padding: 6px 8px;">${item.category}</td>
      <td style="padding: 6px 8px; text-align: right;">${incomeVal ? incomeVal.toFixed(2) : ""}</td>
      <td style="padding: 6px 8px; text-align: right;">${expenseVal ? expenseVal.toFixed(2) : ""}</td>
    `;
    reportTableBody.appendChild(tr);

    const noteTr = document.createElement("tr");
    noteTr.style.backgroundColor = rowBg;
    noteTr.innerHTML = `
      <td style="padding: 6px 8px;">${dateStr}</td>
      <td style="padding: 6px 8px;">${item.description}</td>
    `;
    notesReportBody.appendChild(noteTr);
  });

  const savings = totalIncome - totalExpense;

  reportTableFoot.innerHTML = `
    <tr>
      <td colspan="3" style="padding: 6px 8px;">Total</td>
      <td style="padding: 6px 8px; text-align: right; color: #16a34a;">₹ ${totalIncome.toFixed(2)}</td>
      <td style="padding: 6px 8px; text-align: right; color: #dc2626;">₹ ${totalExpense.toFixed(2)}</td>
    </tr>
    <tr>
      <td colspan="5" style="padding: 6px 8px; text-align: right; color: #0284c7;">Savings = ₹ ${savings.toFixed(2)}</td>
    </tr>
  `;

  const monthName = now.toLocaleString("en-IN", { month: "long" });
  yearlyReportBody.innerHTML = `
    <tr>
      <td style="padding: 6px 8px;">${monthName}</td>
      <td style="padding: 6px 8px; text-align: right; color: #16a34a;">₹ ${totalIncome.toFixed(2)}</td>
      <td style="padding: 6px 8px; text-align: right; color: #dc2626;">₹ ${totalExpense.toFixed(2)}</td>
      <td style="padding: 6px 8px; text-align: right; color: #0284c7;">₹ ${savings.toFixed(2)}</td>
    </tr>
  `;
}

downloadReportBtn.addEventListener("click", () => {
  if (localStorage.getItem("isPremium") !== "true") return;

  let csvContent = "Date,Description,Category,Amount\n";
  cachedExpenses.forEach((item) => {
    const dateStr = new Date(item.createdAt).toLocaleDateString("en-GB");
    csvContent += `"${dateStr}","${item.description}","${item.category}",${item.amount}\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Day-to-Day-Expenses.csv";
  a.click();
  URL.revokeObjectURL(url);
});


window.addEventListener("DOMContentLoaded", display);
