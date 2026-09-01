let employees=[];
const modal=document.querySelector(".modal");
const addBtn=document.querySelector(".add-btn");
const closeModal=document.getElementById("closeModal");
const role= document.getElementById("roleFilter");
const searchinp=document.getElementById("searchEmployee");
const employeerole = document.getElementById("employeeRole");
const tlfield = document.getElementById("teamLeadField");
const tlinp= document.getElementById("employeeTeamLead");
let perpage=4;
let current=1;
async function loadEmployees(){
  const stored=localStorage.getItem("employees");
  if(stored){
    employees=JSON.parse(stored);
  }else{
    const response=await fetch("Employee.json");
    employees=await response.json();
    localStorage.setItem("employees",JSON.stringify(employees));
  }
  display();
}
function filteredemp(){
  const currRole=role.value;
  const returnn= employees.filter((emp)=>{
    return currRole==="All"||emp.role===currRole;
  })
  return search(returnn);
}
function search(data){
  const txt=searchinp.value.toLowerCase().trim();
  if (txt === "") {
    return data;
  }
  return data.filter((emp) => {
    return (
      emp.id.toLowerCase().includes(txt) ||
      emp.name.toLowerCase().includes(txt)
    );
  });
}
function display(){
  const tbody=document.getElementById("employeebody");
  tbody.innerHTML="";
  const femployees=filteredemp();
  const st=(current-1)*perpage;
  const end=st+perpage;
  const currentEmployees = femployees.slice(st, end);
currentEmployees.forEach((emp) => {
    let state = "";
    if (emp.status === "Active") {
      state = "bg-success";
    }
    else if (emp.status === "Inactive") {
      state = "bg-danger";
    }
    else if (emp.status === "Pending") {
      state = "bg-warning text-dark";
    }
    else if (emp.status === "On Leave") {
      state = "bg-warning text-dark";
    }
    else {
      state = "bg-secondary";
    }
    tbody.innerHTML += `
      <tr>
        <td>${emp.id}</td>
        <td>${emp.name}</td>
        <td>${emp.department}</td>
        <td>${emp.teamLead ?? "-"}</td>
        <td>
          <span class="badge ${state}">
            ${emp.status}
          </span>
        </td>
        <td>${emp.role}</td>
        <td>
          <i class="fa-solid fa-eye action-icon"></i>
          <i class="fa-solid fa-pen action-icon"></i>
        </td>
      </tr>
    `;
  });
  pagination();
}

function pagination() {
  const pagi = document.getElementById("pagination");
  pagi.innerHTML= "";
  const femployees = filteredemp();
  const totalpages = Math.ceil(femployees.length / perpage);
  pagi.innerHTML += `
    <li class="page-item ${current === 1 ? "disabled" : ""}">
      <a class="page-link" href="#" onclick="changePage(${current - 1})">
        &lsaquo;
      </a>
    </li>`;
  for (let i = 1; i <= totalpages; i++) {
    pagi.innerHTML += `
      <li class="page-item ${current === i ? "active" : ""}">
        <a class="page-link" href="#" onclick="changePage(${i})">
          ${i}
        </a>
      </li>
    `;
  }
    pagi.innerHTML += `
    <li class="page-item ${current === totalpages ? "disabled" : ""}">
      <a class="page-link" href="#" onclick="changePage(${current + 1})">
        &rsaquo;
      </a>
    </li>`;
}
function changePage(page) {
  const totalPages=Math.ceil(employees.length / perpage);
  if (page < 1 || page > totalPages) {
    return;
  }
  current = page;
  display();
}
addBtn.addEventListener("click",()=>{
  modal.style.display="flex";
});
closeModal.addEventListener("click",()=>{
  modal.style.display="none";
});

modal.addEventListener("click",(event)=>{
  if(event.target===modal){
    modal.style.display="none";
  }
});
document.getElementById("saveEmployee").addEventListener("click", () => {
  const id = document.getElementById("empId").value.trim().toUpperCase();
  const name = document.getElementById("employeeName").value.trim();
  const department = document.getElementById("employeeDepartment").value;
  const teamLead = document.getElementById("employeeTeamLead").value;
  const status = document.getElementById("employeeStatus").value;
  if (!id || !name || !department || !teamLead || !status) {
    alert("Please fill in all fields.");
    return;
  }

  const duplicate = employees.some(emp => 
    emp.id.toUpperCase() === id
  );

  if (duplicate) {
    alert(`Employee ID "${id}" already exists.`);
    return;
  }
  const employee = {
    id: id,
    name: name,
    department: department,
    role: "Employee",
    teamLead: teamLead,
    status: status
  };
  employees.push(employee);
  localStorage.setItem("employees", JSON.stringify(employees));
  display();
  modal.style.display = "none";
  alert("Employee added successfully");
});
role.addEventListener("change", () => {
  current = 1;
  display();
});
employeerole.addEventListener("change", () => {
  if (employeerole.value === "Team Lead") {
    teamLeadField.style.display = "none";
    teamLeadInput.value = "";
  } else {
    teamLeadField.style.display = "block";
  }
});
searchinp.addEventListener("input", () => {
  current = 1;
  display();
});
loadEmployees();





