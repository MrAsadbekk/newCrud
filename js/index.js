const tableBody = document.querySelector(".table__body");
const form = document.querySelector(".form");

const getData = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

getData("https://jsonplaceholder.typicode.com/users")
  .then((data) => {
    console.log(data);

    data.map((user) => {
      console.log(user);

      const { id, name, email, phone } = user;

      const row = document.createElement("tr");

      row.innerHTML = `
      <td>${id}</td>
      <td>${name}</td>
      <td>${email}</td>
      <td>${phone}</td>
      <td><button class="edit__btn" data-id=${id} data-name=${name} data-email=${email} data-phone=${phone}>Edit</button></td>
      <td><button class="delete__btn" data-id=${id} data-name=${name} data-email=${email} data-phone=${phone}>Delete</button></td>
      `;

      tableBody.appendChild(row);
    });
  })
  .catch((error) => console.log(error));

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = document.getElementById("update-id").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;

  if (id) {
    updateUser(id, name, email, phone);
    form.reset();
  } else {
    const formData = {
      id: id,
      name: name,
      email: email,
      phone: phone,
    };

    console.log(formData);

    const postData = (url) => {
      return new Promise((resolve, reject) => {
        fetch(url, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(formData),
        })
          .then((response) => response.json())
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      });
    };

    postData("https://jsonplaceholder.typicode.com/users")
      .then((data) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${data.id}</td>
        <td>${data.name}</td>
        <td>${data.email}</td>
        <td>${data.phone}</td>
        <td><button class="edit__btn" data-id=${data.id} data-name=${data.name} data-email=${data.email} data-phone=${data.phone}>Edit</button></td>
        <td><button class="delete__btn" data-id=${data.id} data-name=${data.name} data-email=${data.email} data-phone=${data.phone}>Delete</button></td>
        `;

        tableBody.appendChild(row);
      })
      .catch((error) => console.log(error));
  }

  form.reset();
});

tableBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit__btn")) {
    const id = e.target.dataset.id;
    const name = e.target.dataset.name;
    const email = e.target.dataset.email;
    const phone = e.target.dataset.phone;

    document.getElementById("update-id").value = id;
    document.getElementById("name").value = name;
    document.getElementById("email").value = email;
    document.getElementById("phone").value = phone;
    document.querySelector(".btn").textContent = "Update User";
  }

  if (e.target.classList.contains("delete__btn")) {
    const id = e.target.dataset.id;

    deleteUser(id)
      .then(() => {
        const tableRow = e.target.closest("tr");
        tableRow.remove();
      })
      .catch((error) => console.log(error));
  }
});

async function deleteUser(id) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${id}`,
      {
        method: "Delete",
      }
    );
    if (response.ok) {
      return response;
    }
  } catch {
    (error) => console.log(error);
  }
}

async function updateUser(id, name, email, phone) {
  const newFormData = {
    id: id,
    name: name,
    email: email,
    phone: phone,
  };

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${id}`,
      {
        method: "PUT",
        body: newFormData,
      }
    );
    const data = await response.json();
    const tableRows = document.querySelectorAll(".table__body tr");
    console.log(tableRows);
    for (row of tableRows) {
      if (row.children[0].textContent == id.toString()) {
        row.children[1].textContent = name;
        row.children[2].textContent = email;
        row.children[3].textContent = phone;
      }
    }
    document.querySelector(".btn").textContent = "Save";
    return data;
  } catch {
    (error) => console.log(error);
  }
}
