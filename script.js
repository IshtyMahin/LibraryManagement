

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



const fetchBook = async (val, filter) => {
  console.log(val, filter);
  try {
    let url;
    if (val) {
      url = `https://librarymanagementsystem-0vjg.onrender.com/api/books?filter=${filter}&value=${val}`;
    } else {
      url = `https://librarymanagementsystem-0vjg.onrender.com/api/books`;
    }
    console.log(url);
    const res = await fetch(url, {
      method: "GET",
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      throw new Error("Failed to fetch books");
    }
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};

const appendSectionsToMain = async () => {
  try {
    const mainElement = document.querySelector("main");
    mainElement.innerHTML = "";

    const allBookPromise = fetchBook();
    const cseBookPromise = fetchBook(
      "Computer Science and Engineering",
      "catagory"
    );
    const mgtBookPromise = fetchBook("Management", "catagory");
    const thmBookPromise = fetchBook(
      "Tourism and Hospitality Management",
      "catagory"
    );
    const fesBookPromise = fetchBook(
      "Forestry and Environmental Science",
      "catagory"
    );
    const fmrtBookPromise = fetchBook(
      "Fisharies and Marine Resource Technology",
      "catagory"
    );

    const allBook = await allBookPromise;
    const cseBook = await cseBookPromise;
    const mgtBook = await mgtBookPromise;
    const thmBook = await thmBookPromise;
    const fesBook = await fesBookPromise;
    const fmrtBook = await fmrtBookPromise;

    const sectionsData = [
      { id: "all", title: "All books", books: allBook },
      { id: "cse", title: "Computer Science and Engineering", books: cseBook },
      { id: "mgt", title: "Management", books: mgtBook },
      {
        id: "thm",
        title: "Tourism and Hospitality Management",
        books: thmBook,
      },
      {
        id: "fes",
        title: "Forestry and Environmental Science",
        books: fesBook,
      },
      {
        id: "fmrt",
        title: "Fisharies and Marine Resource Technology",
        books: fmrtBook,
      },
    ];

    sectionsData.forEach((sectionData) => {
      const section = createBookSection(
        sectionData.id,
        sectionData.title,
        sectionData.books
      );
      mainElement.appendChild(section);
      const divider = document.createElement("div");
      divider.classList.add("divider");
      mainElement.appendChild(divider);
    });
  } catch (error) {
    console.error("Error appending sections to main:", error);
  }
};

window.addEventListener("load", async () => {
  const userType = await authVerifier();
  console.log(userType);
  if (userType == "admin" || userType == "user") {
    // window.location.href = "/mainPage/";
  }
  else {
    window.location.href = "/loginPage/login.html";
  }
  const queryParams = new URLSearchParams(window.location.search);
  let filter = queryParams.get("filter");
  let value = queryParams.get("value");
  console.log(filter, value);

  if (value == "All books") {
    (value = ""), (filter = "");
    appendSectionsToMainFilter(value, filter);
  } else if (value && filter) {
    appendSectionsToMainFilter(value, filter);
  } else if (value) {
    appendSectionsToMainSearch(value);
  } else {
    appendSectionsToMain();
  }
});

const createBookContainer = (title, publication, author) => {
  const container = document.createElement("div");
  container.classList.add("container");

  const bookDiv = document.createElement("div");
  bookDiv.classList.add("book");

  const bookImg = document.createElement("div");
  bookImg.classList.add("book-img");
  const img = document.createElement("img");
  img.src = "../assets/image/programming_with_c.jpg";
  img.alt = "book-image";
  bookImg.appendChild(img);

  const bookHeader = document.createElement("h2");
  bookHeader.classList.add("book-header");
  bookHeader.textContent = title;

  const bookPublication = document.createElement("p");
  bookPublication.classList.add("book-publication");
  bookPublication.textContent = publication;

  const bookAuthor = document.createElement("p");
  bookAuthor.classList.add("book-author");
  bookAuthor.textContent = author;

  bookDiv.appendChild(bookImg);
  bookDiv.appendChild(bookHeader);
  bookDiv.appendChild(bookPublication);
  bookDiv.appendChild(bookAuthor);

  container.appendChild(bookDiv);
  const overlayDiv = document.createElement("div");
  overlayDiv.classList.add("overlay");
  const btn = document.createElement("button");
  btn.classList.add("book-detail-btn");
  btn.textContent = "View Details";
  overlayDiv.appendChild(btn);
  container.appendChild(overlayDiv);

  return container;
};

const createBookSection = (id, title, booksData) => {
  const section = document.createElement("section");
  section.id = id;
  section.classList.add(`${id}-books`);

  const divWrapper = document.createElement("div");

  const sectionHeading = document.createElement("div");
  sectionHeading.classList.add("section-heading");

  const h1 = document.createElement("h1");
  h1.textContent = title;

  const viewAllBtn = document.createElement("a");
  viewAllBtn.href = `?filter=catagory&value=${title}`;
  viewAllBtn.classList.add("view-all-btn");
  viewAllBtn.textContent = "View All";
  const arrowIcon = document.createElement("i");
  arrowIcon.classList.add("fa-solid", "fa-arrow-right");
  viewAllBtn.appendChild(arrowIcon);

  sectionHeading.appendChild(h1);
  sectionHeading.appendChild(viewAllBtn);

  const booksList = document.createElement("div");
  booksList.classList.add("books-list");

  // Populate books in the section
  for (let i = 0; i < Math.min(8, booksData.length); i++) {
    const bookContainer = createBookContainer(
      booksData[i].title,
      booksData[i].publication,
      booksData[i].author
    );
    booksList.appendChild(bookContainer);
  }

  divWrapper.appendChild(sectionHeading);
  divWrapper.appendChild(booksList);

  section.appendChild(divWrapper);

  return section;
};

const appendSectionsToMainFilter = async (val, filter) => {
  try {
    const mainElement = document.querySelector("main");
    mainElement.innerHTML = "";
    const section = document.createElement("section");

    const divWrapper = document.createElement("div");

    const sectionHeading = document.createElement("div");
    sectionHeading.classList.add("section-heading");

    const h1 = document.createElement("h1");
    h1.textContent = val ? val : "All Books";

    sectionHeading.appendChild(h1);

    const booksList = document.createElement("div");
    booksList.classList.add("books-list");

    const booksData = await fetchBook(val, filter);

    booksData.forEach((book) => {
      const bookContainer = createBookContainer(
        book.title,
        book.publication,
        book.author
      );
      booksList.appendChild(bookContainer);
    });

    divWrapper.appendChild(sectionHeading);
    divWrapper.appendChild(booksList);

    section.appendChild(divWrapper);
    mainElement.appendChild(section);
  } catch (error) {
    console.error("Error appending sections to main:", error);
  }
};

const appendSectionsToMainSearch = async (value) => {
  try {
    const mainElement = document.querySelector("main");
    mainElement.innerHTML = "";
    const section = document.createElement("section");

    const divWrapper = document.createElement("div");

    const sectionHeading = document.createElement("div");
    sectionHeading.classList.add("section-heading");

    const h1 = document.createElement("h1");
    h1.textContent = `Search book related with "${value}"`;

    sectionHeading.appendChild(h1);

    const booksList = document.createElement("div");
    booksList.classList.add("books-list");

    const booksData1 = await fetchBook(value, "author");
    const booksData2 = await fetchBook(value, "publication");
    const booksData3 = await fetchBook(value, "title");
    const booksData = booksData1.concat(booksData2, booksData3);

    booksData.forEach((book) => {
      const bookContainer = createBookContainer(
        book.title,
        book.publication,
        book.author
      );
      booksList.appendChild(bookContainer);
    });

    divWrapper.appendChild(sectionHeading);
    divWrapper.appendChild(booksList);

    section.appendChild(divWrapper);
    mainElement.appendChild(section);
  } catch (error) {
    console.error("Error appending sections to main:", error);
  }
};

document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const searchTerm = document
      .querySelector(".form-control.new-input")
      .value.trim();
    const encodedSearchTerm = encodeURIComponent(searchTerm);

    const newUrl = `?value=${encodedSearchTerm}`;
    window.location.href = newUrl;
  });
