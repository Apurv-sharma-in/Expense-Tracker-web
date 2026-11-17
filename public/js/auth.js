// login and signup showing and hide functionality
const signupBox = document.getElementById("signupBox");
const loginBox = document.getElementById("loginBox");
const showLogin = document.getElementById("showLogin");
const showSignup = document.getElementById("showSignup");

showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  signupBox.style.display = "none";
  loginBox.style.display = "block";
});

showSignup.addEventListener("click", (e) => {
  e.preventDefault();
  loginBox.style.display = "none";
  signupBox.style.display = "block";
});

// login functionality

//signup page
const form = document.querySelector(".singup form");
const submtBtn = document.getElementById("submit");

const message = document.createElement("p");
message.style.fontSize = "14px";
message.style.textAlign = "center";
message.style.marginBottom = "10px";
form.insertBefore(message, submtBtn);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await axios.post("http://localhost:3000/user/signup", {
      name: name,
      email: email,
      password: password,
    });
    message.textContent = response.data.message || "User added successfully!";
    message.style.color = "#16a34a";
    form.reset();
  } catch (error) {
    console.error(error);

    if (error.response && error.response.data && error.response.data.message) {
      message.textContent = error.response.data.message;
    } else {
      message.textContent = "Something went wrong. Please try again.";
    }
    message.style.color = "#dc2626";
  }
});
//signup page

//login page

const loginForm = document.querySelector(".login form");
const loginBtn = document.getElementById("loginSubmit");

const loginMessageError = document.createElement("p");

loginMessageError.style.fontSize = "14px";
loginMessageError.style.textAlign = "center";
loginMessageError.style.marginBottom = "10px";
loginForm.insertBefore(loginMessageError, loginBtn);

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const loginResponse = await axios.post("http://localhost:3000/user/login", {
      email: email,
      password: password,
    });

    loginMessageError.textContent =
      loginResponse.data.message || "User Login successfully!";
    loginMessageError.style.color = "#16a34a";
   localStorage.setItem('token', loginResponse.data.token);
   localStorage.setItem('isPremium', loginResponse.data.isPremium);
window.location.href = 'dashboard.html';
    loginForm.reset();
  } catch (error) {
    console.log(error);
    if (error.response && error.response.data && error.response.data.message) {
      loginMessageError.textContent = error.response.data.message;
    } else {
      loginMessageError.textContent = "Invalid email or password.";
    }
    loginMessageError.style.color = "#dc2626";
  }
});
