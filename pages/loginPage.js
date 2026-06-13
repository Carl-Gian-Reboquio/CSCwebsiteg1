const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();

  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const result = await response.json();

    if (result.success) {
      localStorage.setItem("loggedInUser", JSON.stringify(result.account));

      window.location.href = "dashboard.html";
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error(error);

    alert("Unable to connect to server.");
  }
});
