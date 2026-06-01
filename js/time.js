function updateClock() {

    const now = new Date().toLocaleString(
        "en-PH",
        {
            timeZone: "Asia/Manila",
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }
    );

    document.getElementById("phTime").textContent =
        "Philippine Standard Time: " + now;
}

updateClock();
setInterval(updateClock, 1000);