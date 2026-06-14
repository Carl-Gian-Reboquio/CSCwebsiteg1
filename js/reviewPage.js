const data = JSON.parse(localStorage.getItem("applicationData"));

if (!data) {
  alert("No application data found.");
  window.location.href = "application.html";
}

Object.keys(data).forEach((key) => {
  const element = document.getElementById(key);

  if (element && !Array.isArray(data[key]) && typeof data[key] !== "object") {
    element.textContent = data[key] || "N/A";
  }
});

const disabilitiesElement = document.getElementById("disabilities");

if (disabilitiesElement) {
  disabilitiesElement.textContent = data.disabilities?.length
    ? data.disabilities.join(", ")
    : "None";
}

const examResultsBody = document.getElementById("examResultsBody");

if (examResultsBody && Array.isArray(data.examinations)) {
  examResultsBody.innerHTML = "";

  data.examinations.forEach((exam) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${exam.title || ""}</td>
      <td>${exam.rating || ""}</td>
      <td>${exam.dateGranted || ""}</td>
      <td>${exam.placeOfExamination || ""}</td>
    `;
    examResultsBody.appendChild(row);
  });
}

// Account Creation
const confirmBtn = document.getElementById("confirmBtn");

const accountSection = document.getElementById("accountSection");
confirmBtn.addEventListener("click", () => {
  accountSection.style.display = "block";
  accountSection.scrollIntoView({
    behavior: "smooth",
  });
});
// Account Validation
function showError(inputId, errorId, message) {
  document.getElementById(inputId).classList.add("input-error");

  document.getElementById(errorId).textContent = message;
}

function clearError(inputId, errorId) {
  document.getElementById(inputId).classList.remove("input-error");

  document.getElementById(errorId).textContent = "";
}
//Remove error message when Input is detected
["email", "password", "confirmPassword"].forEach((id) => {
  document.getElementById(id).addEventListener("input", () => {
    document.getElementById(id).classList.remove("input-error");

    document.getElementById(id + "Error").textContent = "";
  });
});

function generateApplicationNo(region) {
  const year = new Date().getFullYear();

  const regionCodes = {
    NCR: "NCR",
    CAR: "CAR",
    I: "RI",
    II: "RII",
    III: "RIII",
    "IV-A": "IVA",
    "IV-B": "IVB",
    V: "RV",
    VI: "RVI",
    VII: "RVII",
    VIII: "RVIII",
    IX: "RIX",
    X: "RX",
    XI: "RXI",
    XII: "RXII",
    XIII: "CARAGA",
    BARMM: "BARMM",
  };
  const regionCode = regionCodes[region] || "NCR";
  let counter = parseInt(localStorage.getItem("applicationCounter") || "0");
  counter++;
  localStorage.setItem("applicationCounter", counter);
  const sequence = String(counter).padStart(4, "0");
  return `${year}-${regionCode}-CSE-${sequence}`;
}

const createAccountBtn = document.getElementById("createAccountBtn");
createAccountBtn.addEventListener("click", async () => {
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");

  let valid = true;

  clearError("email", "emailError");
  clearError("password", "passwordError");
  clearError("confirmPassword", "confirmPasswordError");

  if (!email.value.trim()) {
    showError("email", "emailError", "Email address is required.");
    valid = false;
  }

  if (password.value.length < 8) {
    showError(
      "password",
      "passwordError",
      "Password must be at least 8 characters.",
    );
    valid = false;
  }

  if (password.value !== confirmPassword.value) {
    showError(
      "confirmPassword",
      "confirmPasswordError",
      "Passwords do not match.",
    );
    valid = false;
  }
  if (!valid) return;
  //Generate application number
  data.applicationNo = generateApplicationNo(data.region);
  // Generate Examination Date
  const examDates = ["2026-07-25", "2026-08-09", "2026-08-29"];

  data.dateOfExamination = examDates[Math.floor(Math.random() * examDates.length)];

  //temporary save before sending to backend
  data.email = email.value.trim();
  data.password = password.value;

  try {
    const response = await fetch(
      "http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

    const result = await response.json();
    console.log(result);
    if (result.success) {
      localStorage.setItem(
        "successData",
        JSON.stringify({
          applicationNo: data.applicationNo,
          examDate: data.dateOfExamination,
          email: data.email,
        }),
      );

      localStorage.removeItem("applicationData");

      window.location.href = "successPage.html";
    } else {
      showError("email", "emailError", result.message || "Submission failed.");
    }
  } catch (error) {
    console.error(error);
    alert("Cannot connect to server.");
  }
});