function setValue(id, key){

    document.getElementById(id).textContent =
        localStorage.getItem(key) || "-";

}

setValue("examRegion","exam_region");
setValue("examType","exam_type");
setValue("examPlace","exam_place");
setValue("firstTaker","exam_first_taker");
setValue("lastExamDate","exam_last_date");

setValue("lastName","last_name");
setValue("firstName","first_name");
setValue("middleName","middle_name");
setValue("suffix","suffix");
setValue("sex","sex");
setValue("birthDate","birth_date");
setValue("age","age");
setValue("placeOfBirth","place_of_birth");
setValue("civilStatus","civil_status");
setValue("citizenship","citizenship");

setValue("mobileNumber","mobile_number");
setValue("telephoneNumber", "telephone_number");

setValue("address","address");
setValue("zipCode","zip_code");

setValue("pwd","pwd");
setValue("seniorCitizen","senior_citizen");
setValue("pregnant", "pregnant");

setValue("motherName","mother_maiden_name");

setValue("educationLevel","education_level");
setValue("completionStatus","completion_status");
setValue("graduationDate","graduation_date");
setValue("honorsReceived","honors_received");
setValue("courseDegree","course_degree");
setValue("major","major");
setValue("schoolName","school_name");
setValue("schoolAddress","school_address");
setValue("yearFrom","year_from");
setValue("yearTo","year_to");
setValue("highestUnits","highest_units");

setValue("employmentSector","employment_sector");
setValue("agencyOffice","agency_office");
setValue("employmentAddress","employment_address");
setValue("jobTitle","job_title");
setValue("yearsInPosition","years_in_position");
setValue("employmentStatus","employment_status");

const pwdTypes =
    JSON.parse(
        localStorage.getItem("pwd_types") || "[]"
    );

document.getElementById("pwdTypes")
.textContent =
pwdTypes.length > 0
? pwdTypes.join(", ")
: "None";

const exams =
    JSON.parse(
        localStorage.getItem("passed_exams") || "[]"
    );

const table =
document.getElementById("examResultsBody");

exams.forEach(exam => {

    const row =
    document.createElement("tr");

    row.innerHTML = `
        <td>${exam.title}</td>
        <td>${exam.rating}</td>
        <td>${exam.dateGranted}</td>
        <td>${exam.place}</td>
    `;

    table.appendChild(row);

});

document
.getElementById("confirmBtn")
.addEventListener("click",()=>{

    document
    .getElementById("accountSection")
    .style.display = "block";

    document
    .getElementById("confirmBtn")
    .style.display = "none";

});

document
.getElementById("createAccountBtn")
.addEventListener("click",()=>{

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if(!email){
        alert("Enter an email address.");
        return;
    }

    if(password.length < 8){
        alert("Password must be at least 8 characters.");
        return;
    }

    if(password !== confirmPassword){
        alert("Passwords do not match.");
        return;
    }

    localStorage.setItem(
    "account_email",
    email
);

localStorage.setItem(
    "account_password",
    password
);

/* -----------------------
   APPLICATION NUMBER
----------------------- */

const regionName =
    localStorage.getItem("exam_region");

const regionCodes = {
    "NCR": "NCR",
    "CAR": "CAR",
    "Region I": "I",
    "Region II": "II",
    "Region III": "III",
    "Region IV-A / IV-B": "IV",
    "Region V": "V",
    "Region VI": "VI",
    "Region VII": "VII",
    "Region VIII": "VIII",
    "Region IX": "IX",
    "Region X": "X",
    "Region XI": "XI",
    "Region XII": "XII",
    "Caraga": "CARAGA",
    "BARMM": "BARMM"
};

const region =
    regionCodes[regionName];

const counterKey =
    "counter_" + region;

let count =
    parseInt(
        localStorage.getItem(counterKey)
    ) || 0;

count++;

localStorage.setItem(
    counterKey,
    count
);

const sequence =
    String(count).padStart(4, "0");

const year = new Date().getFullYear();

const applicationNumber = `${year}-${region}-CSE-${sequence}`;

localStorage.setItem(
    "application_number",
    applicationNumber
);

/* -----------------------
   EXAM DATE
----------------------- */

const examDates = [
    "July 25, 2026",
    "August 9, 2026",
    "August 29, 2026"
];

const examDate =
    examDates[
        Math.floor(
            Math.random() * examDates.length
        )
    ];

localStorage.setItem(
    "exam_date",
    examDate
);

/* -----------------------
   SUCCESS PAGE
----------------------- */

window.location.href =
    "success.html";

});