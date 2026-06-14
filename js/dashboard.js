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
    // Modal Part
    document.getElementById("modalApplicationNo").textContent = data.Application_No;
    document.getElementById("modalExamType").textContent = data.Examination_Applied_For;
    document.getElementById("modalExamDate").textContent = data.Date_of_Examination;
    document.getElementById("modalExamPlace").textContent = data.Place_of_Examination;
    document.getElementById("modalFullName").textContent = `${data.First_Name} ${data.Last_Name}`;
    document.getElementById("modalBirthdate").textContent = data.Birthdate;
    document.getElementById("modalSex").textContent = data.Sex;
    document.getElementById("modalCitizenship").textContent = data.Citizenship;
    document.getElementById("modalAddress").textContent = data.Permanent_Address;
    document.getElementById("modalSchoolName").textContent = data.School_Name;
    document.getElementById("modalCourse").textContent = data.Course_Title;
    document.getElementById("modalMajor").textContent = data.Major;
    document.getElementById("modalEducation").textContent = data.Level_of_Education;
    document.getElementById("modalEmploymentSector").textContent = data.Employment_Sector;
    document.getElementById("modalAgency").textContent = data.Agency_Office;
    document.getElementById("modalPosition").textContent = data.Job_Title;
    document.getElementById("modalEmploymentStatus").textContent = data.Employment_Status;

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

const modal = document.getElementById("applicationModal");

document.getElementById("viewApplicationBtn").addEventListener("click", () => {
  modal.classList.remove("hidden");
});

document.getElementById("closeModalBtn").addEventListener("click", () => {
  modal.classList.add("hidden");
});
