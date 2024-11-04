const url = "https://jsonplaceholder.typicode.com/users";
const form = document.querySelector("form");
const userList = document.querySelector(".userList");




const displayUsers = (users) => {
  console.log("Displaying users:", users);
  userList.innerHTML = "";
  users.forEach((user) => {
    const userDiv = document.createElement("div");
    userDiv.classList.add("user");
    userDiv.innerHTML = `
      <h3>${user.name}</h3>
      <p>Username: ${user.username}</p>
      <p>Email: ${user.email}</p>
      <p>Phone: ${user.phone}</p>
        <p>User ID: ${user.id}</p>
      <p>Website: ${user.website}</p>
      <p>Address: ${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}</p>
       <button class="edit" onclick="editUser(${user.id})">Edit</button>
      <button class="delete" onclick="deleteUser(${user.id})">Delete</button>
      <hr>
    `;
    userList.appendChild(userDiv);
  });
};



const getAllUsers = async () => {
 
  try {
    const response = await fetch(url);
    const users = await response.json();
    displayUsers(users);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const createUser = async (data) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const newUser = await response.json();
    showNotification("User created successfully!");
   

    displayUsers([...(await fetch(url).then((res) => res.json())), newUser]);
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

const showNotification = (message) => {
  const notification = document.getElementById("notification");
  notification.innerText = message;
  notification.classList.add("show");

  notification.addEventListener(
    "animationend",
    () => {
      notification.classList.remove("show");
    },
    { once: true }
  );
};

const updateUser = async (id, data) => {
  console.log("Update user:", id, data);
  try {
    
    await fetch(`${url}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    showNotification("User updated successfully!");
    
  } catch (error) {
    console.error("Error updating user:", error);
  }
};




const deleteUser = async (id) => {
  console.log("Delete user:", id);
  try {

    await fetch(`${url}/${id}`, { method: "DELETE" });
    showNotification("User deleted successfully!");
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

console.log("ela");

const editUser = (id) => {
  fetch(`${url}/${id}`)
    .then((response) => response.json())
    .then((user) => {
      form.name.value = user.name;
     form.username.value = user.username;
     form.email.value = user.email;
      form.phone.value = user.phone;
      form.website.value = user.website;
      form.userId.value = user.id;
    });
};


form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = {
    name: form.name.value,
    username: form.username.value,
    email: form.email.value,
    phone: form.phone.value,
    website: form.website.value,
    address: form.street.value,
      city: form.city.value,
    
  };
  const userId = form.userId.value;

  if (userId) {
    updateUser(userId, formData);
  } else {
    createUser(formData);
  }

  form.reset();
});

window.onload = getAllUsers; 