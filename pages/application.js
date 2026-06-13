// Current step tracker
let currentStep = 1;

// Step titles for footer
const stepTitles = [
  "Examination Details",
  "Personal Information",
  "Education & Employment Information",
];

// Required fields for each step
const stepRequiredFields = {
  1: ["region", "examType", "examPlace", "firstTimeTaker"],
  2: [
    "lastName",
    "firstName",
    "sex",
    "dateOfBirth",
    "age",
    "placeOfBirth",
    "civilStatus",
    "mobileNumber",
    "permanentAddress",
    "zipCode",
  ],
  3: ["highestEducation", "courseDegree", "schoolName", "schoolAddress"],
};

// Initialize on page load
function initializeForm() {
  // Initialize first step as active
  const firstStep = document.getElementById("step-1");
  if (firstStep) {
    firstStep.classList.add("active");
    firstStep.classList.remove("hidden");
  }


  setupFieldValidation();

  // Initial check to see if any buttons should be enabled
  checkStepCompletion(1);
  checkStepCompletion(2);
  checkStepCompletion(3);
}

// Try to initialize on DOMContentLoaded, or if document is already loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeForm);
} else {
  initializeForm();
}

// Setup validation listeners for all form fields
function setupFieldValidation() {
  // Step 1 fields
  const region = document.getElementById("region");
  const examType = document.getElementById("examType");
  const examPlace = document.getElementById("examPlace");

  if (region) {
    region.addEventListener("change", () => {
      checkStepCompletion(1);
    });
  }

  if (examType) {
    examType.addEventListener("change", () => {
      checkStepCompletion(1);
    });
  }

  if (examPlace) {
    examPlace.addEventListener("change", () => {
      checkStepCompletion(1);
    });
  }

  // First time taker radio button
  document.querySelectorAll("input[name='firstTimeTaker']").forEach((radio) => {
    radio.addEventListener("change", () => {
      checkStepCompletion(1);
    });
  });

  // Step 2 fields
  const step2Fields = [
    "lastName",
    "firstName",
    "sex",
    "dateOfBirth",
    "age",
    "placeOfBirth",
    "civilStatus",
    "mobileNumber",
    "permanentAddress",
    "zipCode",
  ];
  step2Fields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener("change", () => checkStepCompletion(2));
      field.addEventListener("input", () => checkStepCompletion(2));
    }
  });

  // Step 3 fields
  const step3Fields = [
    "highestEducation",
    "courseDegree",
    "schoolName",
    "schoolAddress",
  ];
  step3Fields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener("change", () => checkStepCompletion(3));
      field.addEventListener("input", () => checkStepCompletion(3));
    }
  });

  // Completion status radios for step 3
  document
    .querySelectorAll("input[name='completionStatus']")
    .forEach((radio) => {
      radio.addEventListener("change", () => checkStepCompletion(3));
    });
}

// Check if all required fields in a step are completed
function checkStepCompletion(stepNumber) {
  const requiredFields = stepRequiredFields[stepNumber];
  let allFilled = true;
  let missingField = null;

  for (const fieldId of requiredFields) {
    if (fieldId === "firstTimeTaker" || fieldId === "completionStatus") {
      // Check radio buttons
      const radioChecked = document.querySelector(
        `input[name="${fieldId}"]:checked`,
      );
      if (!radioChecked) {
        allFilled = false;
        missingField = fieldId;
        break;
      }
    } else {
      // Check regular input/select fields
      const field = document.getElementById(fieldId);
      if (!field || !field.value || !field.value.trim()) {
        allFilled = false;
        missingField = fieldId;
        break;
      }
    }
  }

  // Enable or disable the appropriate button
  const stepElement = document.getElementById(`step-${stepNumber}`);
  if (stepElement) {
    // For step 3, get the submit button; for others get the next button
    const buttons =
      stepNumber === 3
        ? stepElement.querySelectorAll("button[onclick*='submitApplication']")
        : stepElement.querySelectorAll(".btn-next");

    buttons.forEach((button) => {
      button.disabled = !allFilled;
    });
  }
}

// Alternative way to get button - more reliable
function updateButtonState(stepNumber, isEnabled) {
  const stepElement = document.getElementById(`step-${stepNumber}`);
  if (stepElement) {
    const buttons = stepElement.querySelectorAll("button[type='button']");
    buttons.forEach((btn) => {
      if (
        btn.classList.contains("btn-next") ||
        btn.textContent.includes("Submit")
      ) {
        btn.disabled = !isEnabled;
      }
    });
  }
}

// Navigate to a specific step with slide animation
function goToStep(stepNumber) {
  // Validate current step before proceeding
  if (stepNumber > currentStep && !validateCurrentStep()) {
    return;
  }

  const currentStepElement = document.getElementById(`step-${currentStep}`);
  const targetStepElement = document.getElementById(`step-${stepNumber}`);

  if (!currentStepElement || !targetStepElement) return;

  // Determine slide direction
  const isForward = stepNumber > currentStep;

  // Remove active class from current step
  currentStepElement.classList.remove("active");

  // Apply slide-out animation to current step
  if (isForward) {
    currentStepElement.classList.add("slide-out-left");
  } else {
    currentStepElement.classList.add("slide-out-right");
  }

  // Prepare target step for slide-in
  targetStepElement.classList.remove("hidden");

  if (isForward) {
    targetStepElement.classList.add("slide-in-right");
  } else {
    targetStepElement.classList.add("slide-in-left");
  }

  // Force reflow to ensure animation plays
  targetStepElement.offsetHeight;

  // Start slide-in animation
  setTimeout(() => {
    targetStepElement.classList.remove("slide-in-left", "slide-in-right");
    targetStepElement.classList.add("active");

    // Clean up current step after animation
    setTimeout(() => {
      currentStepElement.classList.add("hidden");
      currentStepElement.classList.remove("slide-out-left", "slide-out-right");
    }, 400);
  }, 10);

  // Update step indicator
  updateStepIndicator(stepNumber);

  // Update current step
  currentStep = stepNumber;

  // Update footer text
  updateFooterText(stepNumber);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Update step indicator UI
function updateStepIndicator(activeStep) {
  for (let i = 1; i <= 3; i++) {
    const circle = document.getElementById(`step-circle-${i}`);
    const title = document.getElementById(`step-title-${i}`);
    const line = document.getElementById(`step-line-${i}`);

    if (circle && title) {
      if (i < activeStep) {
        // Completed step
        circle.classList.add("completed");
        circle.classList.remove("active");
        circle.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                `;
        title.classList.add("active");
      } else if (i === activeStep) {
        // Active step
        circle.classList.add("active");
        circle.classList.remove("completed");
        circle.textContent = i;
        title.classList.add("active");
      } else {
        // Upcoming step
        circle.classList.remove("active", "completed");
        circle.textContent = i;
        title.classList.remove("active");
      }
    }

    if (line) {
      if (i < activeStep) {
        line.classList.add("completed");
      } else {
        line.classList.remove("completed");
      }
    }
  }
}
const examCenters = {
  NCR: [
    "Quezon City",
    "Makati City",
    "Pasay City",
    "Taguig City",
    "Manila",
    "Caloocan City",
  ],
  CAR: [
    "Baguio City",
    "La Trinidad",
    "Bangued",
    "Tabuk City",
    "Bontoc",
    "Lamut",
  ],
  "Region I": [
    "San Fernando City",
    "Vigan City",
    "Candon City",
    "Laoag City",
    "Urdaneta City",
    "Lingayen",
  ],
  "Region II": ["Tuguegarao City", "Cauayan City", "Bayombong", "Diffun"],
  "Region III": [
    "City of San Fernando",
    "Malolos City",
    "Cabanatuan City",
    "Balanga City",
    "Baler",
    "Tarlac City",
  ],
  "Region IV-A / IV-B": [
    "Imus City",
    "Sta. Cruz",
    "Batangas City",
    "Morong",
    "Lucena City",
    "Puerto Princesa City",
  ],
  "Region V": [
    "Legazpi City",
    "Daet",
    "Naga City",
    "Pili",
    "Sorsogon City",
    "Virac",
  ],
  "Region VI": [
    "Iloilo City",
    "Bacolod City",
    "Roxas City",
    "Kalibo",
    "San Jose",
    "Jordan",
  ],
  "Region VII": [
    "Cebu City",
    "Lapu-Lapu City",
    "Dumaguete City",
    "Bayawan City",
    "Tagbilaran City",
    "Larena",
  ],
  "Region VIII": [
    "Tacloban City",
    "Maasin City",
    "Catbalogan City",
    "Borongan City",
    "Catarman",
    "Naval",
  ],
  "Region IX": ["Zamboanga City", "Pagadian City", "Dipolog City"],
  "Region X": [
    "Cagayan de Oro City",
    "Iligan City",
    "Valencia City",
    "Mambajao",
  ],
  "Region XI": [
    "Davao City",
    "Digos City",
    "Tagum City",
    "Mati City",
    "Nabunturan",
  ],
  "Region XII": [
    "Koronadal City",
    "General Santos City",
    "Kidapawan City",
    "Tacurong City",
  ],
  Caraga: ["Butuan City", "Cabadbaran City", "Surigao City", "Tandag City"],
  BARMM: ["Cotabato City", "Jolo", "Bongao"],
};


const regions = {
  NCR: "NCR",
  CAR: "CAR",
  I: "Region I",
  II: "Region II",
  III: "Region III",
  "IV-A": "Region IV-A / IV-B",
  "IV-B": "Region IV-A / IV-B",
  V: "Region V",
  VI: "Region VI",
  VII: "Region VII",
  VIII: "Region VIII",
  IX: "Region IX",
  X: "Region X",
  XI: "Region XI",
  XII: "Region XII",
  XIII: "Caraga",
  BARMM: "BARMM",
};

const region = document.getElementById("region");
const examType = document.getElementById("examType");
const examPlace = document.getElementById("examPlace");

/* ---------------------------
   REGION → CITY DROPDOWN
---------------------------- */
if (region && examPlace) {
  region.addEventListener("change", function () {
    examPlace.innerHTML =
      '<option value="">Select Place of Examination</option>';

    if (!this.value) return;

    // Map the HTML value to the examCenters key
    const mappedRegion = regions[this.value];

    if (mappedRegion && examCenters[mappedRegion]) {
      examCenters[mappedRegion].forEach((city) => {
        const opt = document.createElement("option");
        opt.value = city;
        opt.textContent = city;
        examPlace.appendChild(opt);
      });
    }
  });
}
/* ---------------------------
   First Time Taker → Show/Hide Last Exam Section
---------------------------- */

const firstYes = document.getElementById("firstYes");
const firstNo = document.getElementById("firstNo");
const lastExam = document.getElementById("lastExam");
const lastExamDate = document.getElementById("dateofLastExam");
firstYes.addEventListener("change", () => {
  lastExam.style.display = "none";
  lastExamDate.value = "";
});

firstNo.addEventListener("change", () => {
  lastExam.style.display = "block";
});

/* ---------------------------
   Age Update Based on Birth Date
---------------------------- */
const dateOfBirth = document.getElementById("dateOfBirth");
const age = document.getElementById("age");

dateOfBirth.addEventListener("change", () => {
  const dob = new Date(dateOfBirth.value);
  const today = new Date();
  let years = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    years--;
  }
  age.value = years;
});

/* ---------------------------
   PWD → Show/Hide Disability Section
---------------------------- */
const pwdYes = document.getElementById("pwdYes");
const pwdNo = document.getElementById("pwdNo");
const pwdSection = document.getElementById("pwdSection");

pwdYes.addEventListener("change", () => {
  pwdSection.style.opacity = "1";
  pwdSection.style.pointerEvents = "auto";
});

pwdNo.addEventListener("change", () => {
  pwdSection.style.opacity = ".5";
  pwdSection.style.pointerEvents = "none";

  document
    .querySelectorAll(".pwd-checkbox")
    .forEach((cb) => (cb.checked = false));

  document.querySelectorAll(".otherPwd").forEach((box, index) => {
    if (index === 0) {
      box.value = "";
    } else {
      box.remove();
    }
  });
});

// Add "Other" disability input
const addOtherPwd = document.getElementById("addOtherPwd");
const otherPwdContainer = document.getElementById("otherPwdContainer");

addOtherPwd.addEventListener("click", () => {
  const input = document.createElement("input");

  input.type = "text";
  input.className = "form-input otherPwd";
  input.placeholder = "Specify disability";
  input.style.marginTop = "0.75rem";

  otherPwdContainer.appendChild(input);
});

// Pregnant Section
const sex = document.getElementById("sex");
const pregnantSection = document.getElementById("pregnantSection");

sex.addEventListener("change", () => {
  if (sex.value === "female") {
    pregnantSection.style.display = "block";
  } else {
    pregnantSection.style.display = "none";
    document.querySelector('input[name="pregnant"][value="No"]').checked = true;
  }
});


// Graduation Status Section
const graduated = document.getElementById("graduated");
const notGraduated = document.getElementById("notGraduated");
const graduatedSection = document.getElementById("graduatedSection");
const notGraduatedSection = document.getElementById("notGraduatedSection");

// Set initial state when page loads
if (graduated.checked) {
  graduatedSection.style.display = "grid";
  notGraduatedSection.style.display = "none";
} else {
  graduatedSection.style.display = "none";
  notGraduatedSection.style.display = "block";
}

graduated.addEventListener("change", () => {
  graduatedSection.style.display = "grid";
  notGraduatedSection.style.display = "none";
});

notGraduated.addEventListener("change", () => {
  graduatedSection.style.display = "none";
  notGraduatedSection.style.display = "block";
});

const employmentSector = document.getElementById("employmentSector");
const employmentDetails = document.getElementById("employmentDetails");

const employmentFields = employmentDetails.querySelectorAll(
  "input, select, textarea",
);

employmentSector.addEventListener("change", () => {
  const isUnemployed = employmentSector.value === "Unemployed";

  employmentFields.forEach((field) => {
    field.disabled = isUnemployed;

    if (isUnemployed) {
      field.value = "";
    }
  });

  employmentDetails.style.opacity = isUnemployed ? "0.5" : "1";
});

function addExamRow() {
  const table = document.querySelector("#examTable tbody");
  const row = document.createElement("tr");
  row.innerHTML = `
        <td><input type="text" class="form-input exam-title"></td>
        <td><input type="text" class="form-input exam-rating"></td>
        <td><input type="date" class="form-input exam-date"></td>
        <td><input type="text" class="form-input exam-place"></td>
        <td>
            <button type="button"
                    class="remove-btn"
                    onclick="removeRow(this)">
                Remove
            </button>
        </td>
    `;
  table.appendChild(row);
}

function removeRow(button) {
  const rows = document.querySelectorAll("#examTable tbody tr");
  if (rows.length === 1) {
    alert("At least one examination row must remain.");
    return;
  }
  button.parentElement.parentElement.remove();
}

// Update footer step text
function updateFooterText(stepNumber) {
  const footerText = document.getElementById("footer-step-text");
  if (footerText) {
    footerText.textContent = `Step ${stepNumber} of 3 - ${stepTitles[stepNumber - 1]}`;
  }
}

// Validate current step - simplified since buttons are already disabled
function validateCurrentStep() {
  // If button is enabled, validation already passed
  const button = document.querySelector(
    `#step-${currentStep} .btn-next, #step-${currentStep} button[onclick*="submitApplication"]`,
  );
  if (button && button.disabled) {
    alert("Please fill in all required fields before proceeding.");
    return false;
  }
  return true;
}

// Submit application
function submitApplication() {
  // If button is enabled, all validation already passed
  const button = document.querySelector("button[onclick*='submitApplication']");
  if (button && button.disabled) {
    alert("Please fill in all required fields before submitting.");
    return false;
  }

  // Collect all form data
  const formData = {
    // Step 1
    region: document.getElementById("region").value,
    examType: document.getElementById("examType").value,
    examPlace: document.getElementById("examPlace").value,
    firstTimeTaker: document.querySelector(
      'input[name="firstTimeTaker"]:checked',
    )?.value,
    dateofLastExam: document.getElementById("dateofLastExam").value,

    // Step 2
    lastName: document.getElementById("lastName").value,
    firstName: document.getElementById("firstName").value,
    middleName: document.getElementById("middleName").value,
    mothersMaidenName: document.getElementById("mothersMaidenName").value,
    suffix: document.getElementById("suffix").value,
    sex: document.getElementById("sex").value,
    dateOfBirth: document.getElementById("dateOfBirth").value,
    age: document.getElementById("age").value,
    placeOfBirth: document.getElementById("placeOfBirth").value,
    civilStatus: document.getElementById("civilStatus").value,
    citizenship: document.getElementById("citizenship").value,
    mobileNumber: document.getElementById("mobileNumber").value,
    telephoneNumber: document.getElementById("telephoneNumber").value,
    permanentAddress: document.getElementById("permanentAddress").value,
    zipCode: document.getElementById("zipCode").value,
    isPWD: document.querySelector('input[name="pwd"]:checked')?.value,
    disabilities: [
      ...Array.from(document.querySelectorAll(".pwd-checkbox:checked")).map(
        (cb) => cb.value,
      ),

      ...Array.from(document.querySelectorAll(".otherPwd"))
        .map((input) => input.value.trim())
        .filter((value) => value !== ""),
    ],
    isPregnant: document.querySelector(
      'input[name="pregnant"]:checked')?.value,
    isSeniorCitizen: document.querySelector(
      'input[name="senior"]:checked',
    )?.value,

    // Step 3
    highestEducation: document.getElementById("highestEducation").value,
    completionStatus: document.querySelector(
      'input[name="completionStatus"]:checked',
    )?.value,
    graduationDate: document.getElementById("graduationDate").value,
    honorsReceived: document.getElementById("honorsReceived").value,
    highestUnits: document.getElementById("highestUnits").value,
    courseDegree: document.getElementById("courseDegree").value,
    major: document.getElementById("major").value,
    schoolName: document.getElementById("schoolName").value,
    schoolAddress: document.getElementById("schoolAddress").value,
    inclusiveYearFrom: document.getElementById("inclusiveYearFrom").value,
    inclusiveYearTo: document.getElementById("inclusiveYearTo").value,
    // Employment Section
    employmentSector: document.getElementById("employmentSector").value,
    agencyOffice: document.getElementById("agencyOffice").value,
    agencyAddress: document.getElementById("agencyOfficeAddress").value,
    positionTitle: document.getElementById("positionJobTitle").value,
    yearsInPosition: document.getElementById("yearsInPosition").value,
    employmentStatus: document.getElementById("employmentStatus").value,
    examinations: Array.from(
      document.querySelectorAll("#examTable tbody tr"),
    ).map((row) => ({
      title: row.querySelector(".exam-title").value,
      rating: row.querySelector(".exam-rating").value,
      dateGranted: row.querySelector(".exam-date").value,
      placeOfExamination: row.querySelector(".exam-place").value,
    })),
  };


  localStorage.setItem("applicationData", JSON.stringify(formData));

  window.location.href = "reviewPage.html";
}
