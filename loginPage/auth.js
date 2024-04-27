
const token = getCookie("token");
console.log(token);
const handleRegistration = (event) => {
  event.preventDefault();
  const name = getValue("username");
  const regId = parseInt(getValue("reg-id"));
  const session = getValue("session");
  const dept = getValue("dept");
  const batch = getValue("batch");
  //   const email = getValue("email");
  const password = getValue("password");
  const confirm_password = getValue("confirm-password");
  const info = {
    name: name,
    regId: regId,
    dept: dept,
    session: session,
    batch: batch,
  };
  const reg = {
    regId: regId,
    password: password,
  };

  console.log(info);

  if (password == confirm_password) {
    fetch("https://librarymanagementsystem-0vjg.onrender.com/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reg),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("register");
        console.log(data);
      });

    fetch("https://librarymanagementsystem-0vjg.onrender.com/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(info),
    })
      .then((res) => res.json())
      .then((data) => {
         console.log(data);
      });
  }
};

const getValue = (id) => {
  const value = document.getElementById(id).value;
  return value;
};

const handleLogin = (event) => {
  event.preventDefault();
  const regId = parseInt(getValue("reg_id"));
  const password = getValue("pass");
  const reg = {
    regId: regId,
    password: password,
  };

  fetch("https://librarymanagementsystem-0vjg.onrender.com/api/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(reg),
  })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((data) => {
      if (data.user) {
        localStorage.setItem("user_id", data.user.regId);
        console.log(data);
        // window.location.href = "/mainPage/";
      } else {
        console.log(data.message);
        // document.getElementById("login-error").textContent = data.error;
      }
    })
    .catch((error) => {
      // document.getElementById("login-error").textContent = error.message;
    });
};

const handleLogout = async () => {
  fetch("https://librarymanagementsystem-0vjg.onrender.com/api/logout", {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      localStorage.removeItem("user_id");
      window.location.href = "/mainPage/";
    })
    .catch((error) => {
      document.getElementById("login-error").textContent = error.message;
    });
};
