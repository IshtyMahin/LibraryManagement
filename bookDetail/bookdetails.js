const showSpinner = () => {
  const spinner = document.getElementById("loading-spinner");
  spinner.classList.remove("hidden");
};

const hideSpinner = () => {
  const spinner = document.getElementById("loading-spinner");
  spinner.classList.add("hidden");
};

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
  showSpinner()
  const userType = await authVerifier();
  console.log(userType);
  if (userType == "masteradmin" || userType == "user") {
    document.getElementById("sign_in").style.display = "none";
  } else {
    window.location.href = "/loginPage/login.html";
  }

  const queryParams = new URLSearchParams(window.location.search);
  let title = queryParams.get("title");
  console.log(title);
  let book = {};
  const url = `https://librarymanagementsystem-0vjg.onrender.com/api/books?filter=title&value=${title}`;
  const res = await fetch(url, {
    method: "GET",
  });
  if (res.ok) {
    const data = await res.json();
    book = data[0];
  } else {
    throw new Error("Failed to fetch books");
  }
  console.log(book);
  if (book) {
    const mainElement = document.getElementById("book_detail");
    console.log(mainElement);
    mainElement.innerHTML = "";

    mainElement.innerHTML = `
  <section class="book-detail-section">
      <div class="wrapper">
        <div class="book-img">
          <img src=${book.cover}>
        </div>
        <div class="book-details">
          <h1 class="book-title">
            ${book.title}
          </h1>
          <p class="book-author">
            Author: <span>${book.author}</span>
          </p>
          <p class="book-publication">
            Publication: <span>${book.publication}</span> 
          </p>
          <p class="book-edition">
            Edition: <span>${book.edition} Edition</span>
          </p>
          <p class="book-category">
            Category: <span><a href="">${book.catagory}</a></span> </p>
          <p class="book-qnty">
            In Stock: <span>${book.qty} Copies</span>
          </p>
          <p class="book-isbn">ISBN: <span>${book.ISBN}</span></p>
          
          ${
            userType === "masterAdmin"
              ? `<div class="btn-admin">
            <button class="book-edit-btn">
              <a href="/EditBook/EditBookPage.html?id=${book.ISBN}">
                Edit Book
              </a>
            </button>
            <button onclick="deleteBook('${book.ISBN}')" class="book-delete-btn">
              Delete Book
            </button>
          </div>`
              : ""
          }
            
        </div>
      </div>

    </section>
  `;
  }
  hideSpinner()
});


async function deleteBook(isbn) {
 console.log(isbn);
  const confirmation = confirm("Are you sure you want to delete this book?");
  if (confirmation) {
    try {
      const response = await fetch(
        `https://librarymanagementsystem-0vjg.onrender.com/api/books/${isbn}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Success:", result);
      alert("Book deleted successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error:", error);
      alert(`There was a problem deleting the book: ${error.message}`);
    }
  }
}
