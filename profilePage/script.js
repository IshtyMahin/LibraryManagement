const authVerifier = async () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const res = await fetch(
        "https://librarymanagementsystem-rmstu.vercel.app/api/authverify",
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
        return data;
      } else {
        throw new Error("Authentication verification failed");
      }
    }
  } catch (error) {
    console.error("Error verifying authentication:", error);
  }
};

const fetchUserInfo = async (regId) => {
  try {
    const res = await fetch(
      `https://librarymanagementsystem-rmstu.vercel.app/api/users/${regId}`
    );
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      throw new Error("Failed to fetch user info");
    }
  } catch (error) {
    console.error("Error fetching user information:", error);
  }
};

const fetchBookInfo = async (isbn) => {
//   console.log(isbn);

  try {
    const res = await fetch(
      `https://librarymanagementsystem-rmstu.vercel.app/api/books/${isbn}`
    );
    if (res.ok) {
      const data = await res.json();
    //   console.log(data[0]);

      return data[0];
    } else {
      throw new Error("Failed to fetch book info");
    }
  } catch (error) {
    console.error("Error fetching book information:", error);
  }
};

window.addEventListener("load", async () => {
  const spinner = document.getElementById("loading-spinner");
  spinner.style.display = "flex"; // Show the spinner

  try {
    const user = await authVerifier();
    if (user && user.regId) {
      const userInfo = await fetchUserInfo(user.regId);
      document.getElementById("regId").textContent = userInfo.regId;
      document.getElementById("name").textContent = userInfo.name;
      document.getElementById("session").textContent = userInfo.session;
      document.getElementById("dept").textContent = userInfo.dept;
      document.getElementById("batch").textContent = userInfo.batch;

      // Fetch and display books
      const bookListContainer = document.getElementById("bookList");
      for (const isbn of userInfo.bookList) {
        const bookInfo = await fetchBookInfo(parseInt(isbn));
        if (bookInfo) {
          const bookCard = document.createElement("div");
          bookCard.classList.add("book-card");

          bookCard.innerHTML = `
            <img src="${
              bookInfo.cover
                ? bookInfo.cover
                : "https://via.placeholder.com/150"
            }" alt="Book Cover">
            <div class="book-card-content">
              <h3>${bookInfo.title}</h3>
              <p><strong>ISBN:</strong> ${bookInfo.ISBN}</p>
              <p><strong>Author:</strong> ${bookInfo.author}</p>
              <p><strong>Publication:</strong> ${bookInfo.publication}</p>
              <p><strong>Category:</strong> ${bookInfo.catagory}</p>
            </div>
          `;

          bookListContainer.appendChild(bookCard);
        }
      }
    } else {
      window.location.href = "/loginPage/login.html";
    }
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    spinner.style.display = "none"; // Hide the spinner
  }
});

