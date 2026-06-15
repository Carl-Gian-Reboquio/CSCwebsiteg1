if (sessionStorage.getItem("adminLoggedIn") !== "true") {
  window.location.href = "adminLogin.html";
}

loadExpiredApplications();

async function loadExpiredApplications() {
  const tableBody = document.getElementById("applicantsTableBody");
  const countEl = document.getElementById("expiredCount");
  const deleteAllBtn = document.getElementById("deleteAllBtn");

  try {
    const response = await fetch("http://localhost:3000/api/admin/expired");
    const result = await response.json();

    if (!result.success) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem;">Failed to load applications.</td></tr>`;
      return;
    }

    const data = result.data;
    countEl.textContent = data.length;

    if (data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--color-text-muted); padding:2rem;">No expired applications found.</td></tr>`;
      return;
    }

    deleteAllBtn.disabled = false;

    tableBody.innerHTML = data.map(row => `
      <tr>
        <td>${row.Application_No}</td>
        <td>${row.First_Name} ${row.Last_Name}</td>
        <td>${row.Email_Address}</td>
        <td>${row.Examination_Applied_For}</td>
        <td>${new Date(row.Date_of_Examination).toLocaleDateString()}</td>
      </tr>
    `).join("");

  } catch (error) {
    console.error(error);
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem;">An error occurred while loading applications.</td></tr>`;
  }
}

document.getElementById("deleteAllBtn").addEventListener("click", async function () {
  const count = document.getElementById("expiredCount").textContent;
  const confirmed = confirm(`Are you sure you want to delete all ${count} expired application(s)? This cannot be undone.`);
  if (!confirmed) return;

  const btn = this;
  btn.disabled = true;
  btn.textContent = "Deleting...";

  try {
    const response = await fetch("http://localhost:3000/api/admin/expired", {
      method: "DELETE",
    });

    const result = await response.json();

    if (!result.success) {
      alert("Failed to delete applications.");
      btn.disabled = false;
      btn.textContent = "Delete All";
      return;
    }

    document.getElementById("expiredCount").textContent = "0";
    document.getElementById("applicantsTableBody").innerHTML = `
      <tr><td colspan="5" style="text-align:center; color: var(--color-text-muted); padding:2rem;">No expired applications found.</td></tr>
    `;
    btn.textContent = "Delete All";

  } catch (error) {
    console.error(error);
    alert("An error occurred while deleting applications.");
    btn.disabled = false;
    btn.textContent = "Delete All";
  }
});