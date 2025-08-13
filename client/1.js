const form = document.getElementById("form");
const tableBody = document.querySelector("#userTable tbody");
const editOverlay = document.getElementById("editOverlay");
const editForm = document.getElementById("editForm");
const cancelEdit = document.getElementById("cancelEdit");
const API_BASE = "https://curd-application-kzpv.onrender.com";

function loadUsers() {
  fetch(`${API_BASE}/users`)
    .then(res => res.json())
    .then(users => {
      tableBody.innerHTML = "";
      users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${user.name}</td>
          <td>${user.mobile}</td>
          <td>${user.age}</td>
          <td>
            <button onclick="openEdit('${user._id}', '${user.name}', '${user.mobile}', ${user.age})">Edit</button>
            <button onclick="deleteUser('${user._id}')">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    });
}


form.addEventListener("submit", function(e) {
  e.preventDefault(); 
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  fetch(`${API_BASE}/add-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(() => {
    form.reset();
    loadUsers();
  })
  .catch(err => console.error("Error:", err));
});


function deleteUser(id) {
  fetch(`${API_BASE}/delete-user/${id}`, { method: "DELETE" })
    .then(res => res.json())
    .then(() => loadUsers());
}


function openEdit(id, name, mobile, age) {
  editForm.id.value = id;
  editForm.name.value = name;
  editForm.mobile.value = mobile;
  editForm.age.value = age;
  editOverlay.classList.remove("hidden");
}


editForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const id = editForm.id.value;
  const data = {
    name: editForm.name.value,
    mobile: editForm.mobile.value,
    age: Number(editForm.age.value)
  };

  fetch(`${API_BASE}/update-user/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(() => {
    editOverlay.classList.add("hidden");
    loadUsers();
  });
});


cancelEdit.addEventListener("click", () => {
  editOverlay.classList.add("hidden");
});


loadUsers();
