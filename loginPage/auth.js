

const handleRegistration = (event) => {
  event.preventDefault();
  const name = getValue("username");
  const regId = getValue("reg-id");
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

  //console.log(info);

  if (password == confirm_password) {
    
    fetch("https://librarymanagementsystem-rmstu.vercel.app/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reg),
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log("register");
       //console.log(data);
        if (data.Error) {
          alert(data.Error);
          return;
        }
        fetch("https://librarymanagementsystem-rmstu.vercel.app/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(info),
        })
          .then((res) => res.json())
          .then((data) => {
            // //console.log(data);

            alert("Successfully Register your account")
            document.querySelector(".login-link").click();
            event.preventDefault();
          });
      })
      .catch((err) => {
        //console.log(err);

        alert(err);
        // alert(data.errorMessage);
      });
    
  }
  else {

    alert("Passwords do not match");

    return;
  }

};

const getValue = (id) => {
  const value = document.getElementById(id).value;
  return value;
};

const handleLogin = (event) => {
  event.preventDefault();

  const regId = getValue("reg_id");
  const password = getValue("pass");
  const reg = {
    regId: regId,
    password: password,
  };

  //console.log(reg,password);

  fetch("https://librarymanagementsystem-rmstu.vercel.app/api/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(reg),
  })
    .then((res) => {
      //console.log(res);
      return res.json();
    })
    .then((data) => {
      //console.log(data);
      
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", data.type);
     
        alert("Successfully logged in")
        window.location.href = "/";
        //console.log(data);
      } else {
        //console.log(data.message);

        alert(data.message);
        // document.getElementById("login-error").textContent = data.error;
      }
    })
    .catch((error) => {
   
      alert(error.message);
      // document.getElementById("login-error").textContent = error.message;
    });

};

const handleLogout = async () => {

  fetch("https://librarymanagementsystem-rmstu.vercel.app/api/logout", {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      //console.log(data);

      localStorage.removeItem("user_id");
      localStorage.removeItem("token");
 
      window.location.href = "/";
    })
    .catch((error) => {

      document.getElementById("login-error").textContent = error.message;
    });

};
