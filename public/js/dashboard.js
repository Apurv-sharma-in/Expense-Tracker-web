const addBtn = document.getElementById("addExpense");
const buyPremium = document.getElementById("byPremium");
const leaderboardBtn = document.getElementById("learderBoard");
const token = localStorage.getItem("token");
const leaderboardSection = document.getElementById('leaderboardSection');
const leaderboardList = document.getElementById('leaderboardList');
const backToExpensesBtn = document.getElementById('backToExpensesBtn');
const expenseSection = document.getElementById('expenseSection');

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
window.addEventListener("DOMContentLoaded", display);
