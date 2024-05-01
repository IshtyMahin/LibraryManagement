const authVerifier = async () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const res = await fetch(
        "https://librarymanagementsystem-0vjg.onrender.com/api/authverify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        return data.type;
      } else {
        throw new Error("Authentication verification failed");
      }
    }
  } catch (error) {
    console.error("Error verifying authentication:", error);
  }
};

window.addEventListener("load", async () => {
  const userType = await authVerifier();
  console.log(userType);
  if (userType == "admin" || userType == "user") {
    window.location.href = "/";
  } else {
    // window.location.href = "/loginPage/login.html";
  }
});
