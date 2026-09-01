"use strict";
const assets = [
    {
        id: "AST001",
        name: "Dell Laptop",
        category: "Laptop",
        assignedTo: "Karthi",
        status: "Assigned",
        assignedDate: "2026-08-20",
        serviceDate: "2026-09-15",
        returnDate: "2027-08-20"
    },
    {
        id: "AST002",
        name: "HP Monitor",
        category: "Monitor",
        assignedTo: "Arun Kumar",
        status: "Assigned",
        assignedDate: "2026-08-10",
        serviceDate: "2026-09-05",
        returnDate: "2027-08-10"
    },
    {
        id: "AST003",
        name: "Logitech Keyboard",
        category: "Peripheral",
        assignedTo: null,
        status: "Available",
        assignedDate: null,
        serviceDate: null,
        returnDate: null
    },
    {
        id: "AST004",
        name: "Logitech Mouse",
        category: "Peripheral",
        assignedTo: null,
        status: "Available",
        assignedDate: null,
        serviceDate: null,
        returnDate: null
    },
    {
        id: "AST005",
        name: "Lenovo Laptop",
        category: "Laptop",
        assignedTo: null,
        status: "Available",
        assignedDate: null,
        serviceDate: null,
        returnDate: null
    },
    {
        id: "AST006",
        name: "Samsung Monitor",
        category: "Monitor",
        assignedTo: null,
        status: "Available",
        assignedDate: null,
        serviceDate: null,
        returnDate: null
    },
    {
        id: "AST007",
        name: "HP Keyboard",
        category: "Peripheral",
        assignedTo: null,
        status: "Available",
        assignedDate: null,
        serviceDate: null,
        returnDate: null
    },
    {
        id: "AST008",
        name: "Dell Mouse",
        category: "Peripheral",
        assignedTo: null,
        status: "Available",
        assignedDate: null,
        serviceDate: null,
        returnDate: null
    }
];
const stored = localStorage.getItem("assets");
if (stored) {
    const saved = JSON.parse(stored);
    assets.length = 0;
    assets.push(...saved);
}
else {
    localStorage.setItem("assets", JSON.stringify(assets));
}
const assignmodal = document.getElementById("assignModal");
const closeassign = document.getElementById("closeAssign");
const assign = document.getElementById("assignAsset");
let assetid = "";
let emp = "";
const empsearch = document.getElementById("employeeSearch");
const emplist = document.getElementById("employeeList");
const tbody = document.getElementById("assetTableBody");
const add = document.getElementById("addasset");
const assetmodal = document.getElementById("assetModal");
const closeModal = document.getElementById("closeModal");
const save = document.getElementById("saveAsset");
function addactivity(msg) {
    const activity = JSON.parse(localStorage.getItem("activities") || "[]");
    activity.unshift({ message: msg,
        time: new Date().toISOString()
    });
    localStorage.setItem("activities", JSON.stringify(activity));
}
function getemp() {
    return JSON.parse(localStorage.getItem("employees") || "[]");
}
// Display assets
function display() {
    tbody.innerHTML = "";
    assets.forEach((asset) => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${asset.id}</td>
      <td>${asset.name}</td>
      <td>${asset.category}</td>
      <td>${asset.assignedTo ?? "-"}</td>
      <td>
        <span class="status ${asset.status.toLowerCase().replace(" ", "-")}">
          ${asset.status}
        </span>
      </td>
      <td>
        <i class="fa-solid fa-pen assignBtn" data-id="${asset.id}"></i>
      </td>
    `;
        tbody.appendChild(row);
    });
}
display();
add.addEventListener("click", () => {
    assetmodal.style.display = "block";
});
closeModal.addEventListener("click", () => {
    assetmodal.style.display = "none";
});
save.addEventListener("click", () => {
    const id = document.getElementById("assetId").value.trim().toUpperCase();
    const name = document.getElementById("assetName").value.trim();
    const category = document.getElementById("assetCategory").value;
    if (!id || !name || !category) {
        alert("Please fill all fields");
        return;
    }
    const duplicate = assets.some((asset) => asset.id.toUpperCase() === id);
    if (duplicate) {
        alert(`Asset ID "${id}" already exists.`);
        return;
    }
    const newasset = {
        id,
        name,
        category,
        assignedTo: null,
        status: "Available",
        assignedDate: null,
        serviceDate: null,
        returnDate: null
    };
    assets.push(newasset);
    localStorage.setItem("assets", JSON.stringify(assets));
    addactivity(`New asset ${newasset.name} added`);
    display();
    assetmodal.style.display = "none";
    alert("Asset added successfully");
});
// mdalopen
document.addEventListener("click", (event) => {
    const target = event.target;
    if (!target.classList.contains("assignBtn")) {
        return;
    }
    assetid = target.dataset.id || "";
    const asset = assets.find((asset) => asset.id === assetid);
    if (!asset) {
        return;
    }
    emp = "";
    empsearch.value = "";
    emplist.innerHTML = "";
    if (asset.assignedTo) {
        emp = asset.assignedTo;
        empsearch.value = asset.assignedTo;
    }
    document.getElementById("assignedDate").value = asset.assignedDate || "";
    document.getElementById("serviceDate").value = asset.serviceDate || "";
    document.getElementById("returnDate").value = asset.returnDate || "";
    assignmodal.style.display = "block";
    showemp("");
});
function showemp(search) {
    emplist.innerHTML = "";
    const employees = getemp();
    const text = search.toLowerCase().trim();
    const active = employees.filter((employee) => {
        if (employee.status !== "Active") {
            return false;
        }
        const name = String(employee.name || "").toLowerCase();
        return name.includes(text);
    });
    if (active.length === 0) {
        emplist.innerHTML = `<div class="employee-option">
        No active employees found
      </div> `;
        return;
    }
    active.forEach((employee) => {
        const div = document.createElement("div");
        div.className = "employee-option";
        div.textContent = employee.name;
        div.addEventListener("click", () => {
            emp = employee.name;
            empsearch.value = employee.name;
            emplist.innerHTML = "";
        });
        emplist.appendChild(div);
    });
}
// srch
empsearch.addEventListener("focus", () => {
    showemp("");
});
empsearch.addEventListener("input", () => {
    emp = "";
    showemp(empsearch.value);
});
closeassign.addEventListener("click", () => {
    assignmodal.style.display = "none";
    assetid = "";
    emp = "";
    empsearch.value = "";
    emplist.innerHTML = "";
});
// assign
assign.addEventListener("click", () => {
    const adate = document.getElementById("assignedDate").value;
    const sdate = document.getElementById("serviceDate").value;
    const rdate = document.getElementById("returnDate").value;
    const asset = assets.find((asset) => asset.id === assetid);
    if (!asset) {
        alert("Asset not found");
        return;
    }
    if (!emp) {
        alert("Please select an employee from the list.");
        return;
    }
    if (!adate || !sdate) {
        alert("Please fill all dates.");
        return;
    }
    const oldemp = asset.assignedTo;
    asset.assignedTo = emp;
    asset.status = "Assigned";
    asset.assignedDate = adate;
    asset.serviceDate = sdate;
    asset.returnDate = rdate;
    localStorage.setItem("assets", JSON.stringify(assets));
    if (oldemp) {
        addactivity(`${asset.name} reassigned from ${oldemp} to ${emp}`);
    }
    else {
        addactivity(`${asset.name} assigned to ${emp}`);
    }
    display();
    assignmodal.style.display = "none";
    assetid = "";
    emp = "";
    empsearch.value = "";
    emplist.innerHTML = "";
    if (oldemp) {
        alert("Asset reassigned successfully");
    }
    else {
        alert("Asset assigned successfully");
    }
});
