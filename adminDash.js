let employees = [];
async function load() {
  try {
    const response = await fetch(
      "https://quoteslate.vercel.app/api/quotes/random"
    );
    const data = await response.json();
    document.getElementById("quote").textContent =
      data.quote;
  }
  catch (error) {
    console.log(error);
  }
}
load();
async function loadEmp() {
  const stored =
    localStorage.getItem("employees");
  if (stored) {
    employees = JSON.parse(stored);
  }
  else {
    const resp =
      await fetch("Employee.json");
    employees =
      await resp.json();
    localStorage.setItem(
      "employees",
      JSON.stringify(employees)
    );
  }
  document.getElementById("totalcount").innerHTML =
    employees.length;
}
loadEmp();
function loadAssets() {
  const storedAssets =
    localStorage.getItem("assets");
  let assets = [];
  if (storedAssets) {
   assets = JSON.parse(storedAssets);
  }
  document.querySelector(
    ".card:nth-child(2) h2"
  ).innerHTML = assets.length;
}
loadAssets();
function loadActivities() {
  const activityList =
    document.getElementById("activityList");
  const storedActivities =
    localStorage.getItem("activities");
  let activities = [];
  if (storedActivities) {
    activities =
      JSON.parse(storedActivities);
  }
  activityList.innerHTML = "";
  activities.slice(0, 5).forEach(
    (activity) => {
      const date =
        new Date(activity.time);
      const time =
        date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        });
      activityList.innerHTML += `
        <div class="activity">
          <span>
            ${activity.message}
          </span>
          <small>
            ${time}
          </small>
        </div>`;}
  );
  if (activities.length === 0) {
    activityList.innerHTML = `
      <div class="activity">
        <span>No recent activities</span>
      </div>
    `;
  }
}
loadActivities();