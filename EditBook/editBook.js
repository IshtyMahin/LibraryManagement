const showSpinner = () => {
  const spinner = document.getElementById("loading-spinner");
  spinner.classList.remove("hidden");
};

const hideSpinner = () => {
  const spinner = document.getElementById("loading-spinner");
  spinner.classList.add("hidden");
};


window.addEventListener("load", async () => {
  showSpinner();
  const queryParams = new URLSearchParams(window.location.search);
  let id = queryParams.get("id");
  if (id) {
    //console.log(id);
    fetchBookDetails(id);
  } else {
    alert("No ISBN provided in the URL");
  }

  hideSpinner();
});

function fillForm(book) {
  console.log(book);
  
  document.querySelector('input[name="ISBN"]').value = book.ISBN;
  document.querySelector('input[name="title"]').value = book.title;
  document.querySelector('input[name="edition"]').value = book.edition;
  document.querySelector('input[name="author"]').value = book.author;
  document.querySelector('input[name="publication"]').value = book.publication;
  document.querySelector('input[name="qty"]').value = book.qty;
  document.querySelector('select[name="category"]').value = book.catagory;
  document.querySelector('input[name="shelfNo"]').value = book.shelfLoc.shelfNo;
  document.querySelector('input[name="shelveNo"]').value =
    book.shelfLoc.shelveNo;
}

async function fetchBookDetails(isbn) {
    try {
      //console.log(isbn);
    const response = await fetch(
      `https://librarymanagementsystem-rmstu.vercel.app/api/books/${isbn}`
    );
    if (!response.ok) {
      throw new Error("Book not found");
    }
        const book = await response.json();
        //console.log(book);
    fillForm(book[0]);
  } catch (error) {
    console.error("Error fetching book details:", error);
    alert("Error fetching book details");
  }
}

document
  .getElementById("editBookForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const fileInput = document.getElementById("myfile");
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async function () {
        const coverBase64 = reader.result;

        const bookData = {
          title: formData.get("title"),
          edition: formData.get("edition"),
          author: formData.get("author"),
          publication: formData.get("publication"),
          qty: formData.get("qty"),
          category: formData.get("category"),
          shelfLoc: {
            shelfNo: formData.get("shelfNo"),
            shelveNo: formData.get("shelveNo"),
          },
          cover: coverBase64,
        };

        await editBook(bookData);
      };
      reader.onerror = function (error) {
        console.error("Error reading file:", error);
        alert("There was a problem reading the file.");
      };
    } else {
      const bookData = {
        title: formData.get("title"),
        edition: formData.get("edition"),
        author: formData.get("author"),
        publication: formData.get("publication"),
        qty: formData.get("qty"),
        category: formData.get("category"),
        shelfLoc: {
          shelfNo: formData.get("shelfNo"),
          shelveNo: formData.get("shelveNo"),
        },
      };

      await editBook(bookData);
    }
  });

async function editBook(bookData) {
  const isbn = document.querySelector('input[name="ISBN"]').value;
  try {
    const response = await fetch(
      `https://librarymanagementsystem-rmstu.vercel.app/api/books/${isbn}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const result = await response.json();
    //console.log("Success:", result);
      alert("Book edited successfully!");
      // window.location.href = "/";
       window.history.back();
  } catch (error) {
    console.error("Error:", error);
    alert(`There was a problem editing the book: ${error.message}`);
  }
}


