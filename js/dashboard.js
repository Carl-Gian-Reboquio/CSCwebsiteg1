const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
  window.location.href = "loginPage.html";
}

loadDashboard();

// Load dashboard data
async function loadDashboard() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/dashboard/${currentUser.Person_ID}`,
    );

    const result = await response.json();

    if (!result.success) {
      alert("Unable to load dashboard.");
      return;
    }

    const data = result.data;
    const examDate = new Date(data.Date_of_Examination);
    document.getElementById("fullName").textContent = `${data.First_Name} ${data.Last_Name}`;
    document.getElementById("email").textContent = data.Email_Address;
    document.getElementById("applicationNo").textContent = data.Application_No;
    document.getElementById("examType").textContent = data.Examination_Applied_For;
    document.getElementById("examDate").textContent = data.Date_of_Examination;
    document.getElementById("examPlace").textContent = data.Place_of_Examination;
  } catch (error) {
    console.error(error);
  }
}

// Logout functionality
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentUser");

  window.location.href = "loginPage.html";
});

