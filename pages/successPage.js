const successData = JSON.parse(localStorage.getItem("successData"));

if (successData) {
  document.getElementById("applicationNumber").textContent =
    successData.applicationNo;

  document.getElementById("examDate").textContent = successData.examDate;

  document.getElementById("emailAddress").textContent = successData.email;
}
