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
      <td><button class="edit__btn">Edit</button></td>
      <td><button class="delete__btn">Delete</button></td>
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
      <td><button class="edit__btn">Edit</button></td>
      <td><button class="delete__btn">Delete</button></td>
      `;

      tableBody.appendChild(row);
    })
    .catch((error) => console.log(error));

  form.reset();
});

tableBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete_btn")) {
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
