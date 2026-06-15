const currentUser = JSON.parse(localStorage.getItem("currentUser"));
let applicantData = {};
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
    applicantData = data;
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

// Assign IDs to the Update buttons based on their section order
const updateBtns = document.querySelectorAll(".update-btn");
updateBtns[0].id = "updatePersonalBtn";
updateBtns[1].id = "updateEducationBtn";
updateBtns[2].id = "updateEmploymentBtn";

// Replace a value element with an editable input
function makeEditable(elementId, inputType = "text") {
  const el = document.getElementById(elementId);
  const currentValue = el.textContent;
  const input = document.createElement("input");
  input.type = inputType;
  input.value = currentValue;
  input.className = "edit-input";
  input.dataset.originalId = elementId;
  el.replaceWith(input);
  return input;
}

// Replace an input back to a value element with updated text
function makeReadOnly(input, newValue) {
  const el = document.createElement("div");
  el.className = "value";
  el.id = input.dataset.originalId;
  el.textContent = newValue !== undefined ? newValue : input.value;
  input.replaceWith(el);
}

// Set a button to loading state and back
function setButtonLoading(btn, isLoading) {
  btn.disabled = isLoading;
  btn.textContent = isLoading ? "Saving..." : "Update";
}
// Cancel button
document.querySelectorAll(".cancel-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    window.location.reload();
  });
});

// Update Personal Information
document.getElementById("updatePersonalBtn").addEventListener("click", async function () {
  const btn = this;

  // If not in edit mode, switch fields to inputs
  if (btn.dataset.editing !== "true") {
    btn.dataset.editing = "true";
    btn.textContent = "Save";
    //Cancel Button show
    const cancelBtn = btn.nextElementSibling;
    cancelBtn.classList.remove("hidden");

    // Split Full Name back into First/Last for editing
    const fullNameEl = document.getElementById("modalFullName");
    const firstName = applicantData.First_Name || "";
    const lastName = applicantData.Last_Name || "";

    // Replace Full Name display with a wrapper div containing two inputs (stays in one grid cell)
    const nameWrapper = document.createElement("div");
    nameWrapper.id = "nameInputWrapper";
    nameWrapper.style.display = "flex";
    nameWrapper.style.gap = "0.5rem";

    const firstInput = document.createElement("input");
    firstInput.type = "text";
    firstInput.value = firstName;
    firstInput.className = "edit-input";
    firstInput.id = "editFirstName";
    firstInput.placeholder = "First Name";
    firstInput.style.flex = "1";

    const lastInput = document.createElement("input");
    lastInput.type = "text";
    lastInput.value = lastName;
    lastInput.className = "edit-input";
    lastInput.id = "editLastName";
    lastInput.placeholder = "Last Name";
    lastInput.style.flex = "1";
    
    nameWrapper.appendChild(firstInput);
    nameWrapper.appendChild(lastInput);
    fullNameEl.replaceWith(nameWrapper);

    makeEditable("modalBirthdate", "date");
    makeEditable("modalSex");
    makeEditable("modalCitizenship");
    makeEditable("modalAddress");

    return;
  }

  // Save mode: collect values and call API
  const firstNameInput = document.getElementById("editFirstName");
  const lastNameInput = document.getElementById("editLastName");
  const birthdateInput = document.querySelector("input[data-original-id='modalBirthdate']");
  const sexInput = document.querySelector("input[data-original-id='modalSex']");
  const citizenshipInput = document.querySelector("input[data-original-id='modalCitizenship']");
  const addressInput = document.querySelector("input[data-original-id='modalAddress']");

  const payload = {
    First_Name: firstNameInput.value,
    Last_Name: lastNameInput.value,
    Birthdate: birthdateInput.value,
    Sex: sexInput.value,
    Citizenship: citizenshipInput.value,
    Permanent_Address: addressInput.value,
  };

  setButtonLoading(btn, true);

  try {
    const response = await fetch(
      `http://localhost:3000/api/dashboard/update/personal/${currentUser.Person_ID}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!result.success) {
      alert("Failed to update personal information.");
      setButtonLoading(btn, false);
      return;
    }

    // Restore display: replace the wrapper div with a single value element
    const fullNameDiv = document.createElement("div");
    fullNameDiv.className = "value";
    fullNameDiv.id = "modalFullName";
    fullNameDiv.textContent = `${payload.First_Name} ${payload.Last_Name}`;
    document.getElementById("nameInputWrapper").replaceWith(fullNameDiv);

    makeReadOnly(birthdateInput, payload.Birthdate);
    makeReadOnly(sexInput, payload.Sex);
    makeReadOnly(citizenshipInput, payload.Citizenship);
    makeReadOnly(addressInput, payload.Permanent_Address);

    // Also update the dashboard header name
    document.getElementById("fullName").textContent = `${payload.First_Name} ${payload.Last_Name}`;

    btn.dataset.editing = "false";
    btn.textContent = "Update";
    btn.disabled = false;
    const cancelBtn = btn.nextElementSibling;
    cancelBtn.classList.add("hidden");
  } catch (error) {
    console.error(error);
    alert("An error occurred while updating personal information.");
    setButtonLoading(btn, false);
  }
});

// Update Education Information
document.getElementById("updateEducationBtn").addEventListener("click", async function () {
  const btn = this;

  if (btn.dataset.editing !== "true") {
    btn.dataset.editing = "true";
    btn.textContent = "Save";
    //Cancel Button show
    const cancelBtn = btn.nextElementSibling;
    cancelBtn.classList.remove("hidden");

    makeEditable("modalSchoolName");
    makeEditable("modalCourse");
    makeEditable("modalMajor");
    makeEditable("modalEducation");

    return;
  }

  const schoolInput = document.querySelector("input[data-original-id='modalSchoolName']");
  const courseInput = document.querySelector("input[data-original-id='modalCourse']");
  const majorInput = document.querySelector("input[data-original-id='modalMajor']");
  const educationInput = document.querySelector("input[data-original-id='modalEducation']");

  const payload = {
    School_Name: schoolInput.value,
    Course_Title: courseInput.value,
    Major: majorInput.value,
    Level_of_Education: educationInput.value,
  };

  setButtonLoading(btn, true);

  try {
    const response = await fetch(
      `http://localhost:3000/api/dashboard/update/education/${currentUser.Person_ID}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!result.success) {
      alert("Failed to update education information.");
      setButtonLoading(btn, false);
      return;
    }

    makeReadOnly(schoolInput, payload.School_Name);
    makeReadOnly(courseInput, payload.Course_Title);
    makeReadOnly(majorInput, payload.Major);
    makeReadOnly(educationInput, payload.Level_of_Education);

    btn.dataset.editing = "false";
    btn.textContent = "Update";
    btn.disabled = false;
    const cancelBtn = btn.nextElementSibling;
    cancelBtn.classList.add("hidden");
  } catch (error) {
    console.error(error);
    alert("An error occurred while updating education information.");
    setButtonLoading(btn, false);
  }
});

// Update Employment Information
document.getElementById("updateEmploymentBtn").addEventListener("click", async function () {
  const btn = this;

  if (btn.dataset.editing !== "true") {
    btn.dataset.editing = "true";
    btn.textContent = "Save";
    // Cancel Button Show
    const cancelBtn = btn.nextElementSibling;
    cancelBtn.classList.remove("hidden");
    makeEditable("modalEmploymentSector");
    makeEditable("modalAgency");
    makeEditable("modalPosition");
    makeEditable("modalEmploymentStatus");

    return;
  }

  const sectorInput = document.querySelector("input[data-original-id='modalEmploymentSector']");
  const agencyInput = document.querySelector("input[data-original-id='modalAgency']");
  const positionInput = document.querySelector("input[data-original-id='modalPosition']");
  const statusInput = document.querySelector("input[data-original-id='modalEmploymentStatus']");

  const payload = {
    Employment_Sector: sectorInput.value,
    Agency_Office: agencyInput.value,
    Job_Title: positionInput.value,
    Employment_Status: statusInput.value,
  };

  setButtonLoading(btn, true);

  try {
    const response = await fetch(
      `http://localhost:3000/api/dashboard/update/employment/${currentUser.Person_ID}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!result.success) {
      alert("Failed to update employment information.");
      setButtonLoading(btn, false);
      return;
    }

    makeReadOnly(sectorInput, payload.Employment_Sector);
    makeReadOnly(agencyInput, payload.Agency_Office);
    makeReadOnly(positionInput, payload.Job_Title);
    makeReadOnly(statusInput, payload.Employment_Status);

    btn.dataset.editing = "false";
    btn.textContent = "Update";
    btn.disabled = false;
    const cancelBtn = btn.nextElementSibling;
    cancelBtn.classList.add("hidden");
  } catch (error) {
    console.error(error);
    alert("An error occurred while updating employment information.");
    setButtonLoading(btn, false);
  }
});

// Delete Application Button
document
  .getElementById("deleteApplicationBtn")
  .addEventListener("click", async () => {
    const confirmed = confirm(
      "This will permanently delete your account and application. Continue?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/dashboard/update/${currentUser.Person_ID}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!result.success) {
        alert(result.message);
        return;
      }

      alert("Application deleted successfully.");

      localStorage.removeItem("currentUser");

      window.location.href = "loginPage.html";
    } catch (error) {
      console.error(error);
      alert("Error deleting application.");
    }
  });