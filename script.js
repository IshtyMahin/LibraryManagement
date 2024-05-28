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
  showSpinner();
  const userType = await authVerifier();
  console.log(userType);
  if (userType == "admin" || userType == "user") {
    // window.location.href = "/mainPage/";
    document.getElementById("sign_in").style.display = "none";
  } else {
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
  hideSpinner();
});

const createBookContainer = (book) => {
  const { title, publication, author } = book;
  const container = document.createElement("div");
  container.classList.add("container");

  container.innerHTML = `
    <div class="book">
      <div class="book-img">
        <img src=${book.cover} alt="book-image">
      </div>
      <h2 class="book-header">${title}</h2>
      <p class="book-publication">${publication}</p>
      <p class="book-author">${author}</p>
    </div>
    <div class="overlay">
      <button onclick='view_details("${title}")' class="book-detail-btn">View Details</button>
    </div>
  `;

  return container;
};


const createBookSection = (id, title, booksData) => {
  const section = document.createElement("section");
  section.id = id;
  section.className = `${id}-books`;

  const divWrapper = document.createElement("div");
  divWrapper.innerHTML = `
    <div class="section-heading">
      <h1>${title}</h1>
      <a href="?filter=catagory&value=${title}" class="view-all-btn">
        View All<i class="fa-solid fa-arrow-right"></i>
      </a>
    </div>
    <div class="books-list"></div>
  `;

  const booksList = divWrapper.querySelector(".books-list");
  booksData.slice(0, 8).forEach((book) => {
    booksList.appendChild(createBookContainer(book));
  });

  section.appendChild(divWrapper);
  return section;
};


const appendSectionsToMainFilter = async (val, filter) => {
  try {
    const mainElement = document.querySelector("main");
    mainElement.innerHTML = "";

    const section = document.createElement("section");
    const divWrapper = document.createElement("div");

    divWrapper.innerHTML = `
      <div class="section-heading">
        <h1>${val || "All Books"}</h1>
      </div>
      <div class="books-list"></div>
    `;

    const booksList = divWrapper.querySelector(".books-list");
    const booksData = await fetchBook(val, filter);

    booksData.forEach((book) => {
      booksList.appendChild(
        createBookContainer(book)
      );
    });

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

    divWrapper.innerHTML = `
      <div class="section-heading">
        <h1>Search book related with "${value}"</h1>
      </div>
      <div class="books-list"></div>
    `;

    const booksList = divWrapper.querySelector(".books-list");
    const fetches = ["author", "publication", "title"].map((filter) =>
      fetchBook(value, filter)
    );
    const booksData = (await Promise.all(fetches)).flat();

    booksData.forEach((book) => {
      booksList.appendChild(
        createBookContainer(book)
      );
    });

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

  
const view_details = async (title) => {
  window.location.href = `bookDetail/bookdetail.html?title=${title}`;
  // console.log(title);
  const book= await fetchBook(title, 'title');
  const mainElement = document.getElementById("book_detail");
  console.log(mainElement);
  mainElement.innerHTML = "";

  mainElement.innerHTML = `
  <section class="book-detail-section">
      <div class="wrapper">
        <div class="book-img">
          <img src="../assets/image/programming_with_c.jpg" alt="programming_with_c">
        </div>
        <div class="book-details">
          <h1 class="book-title">
            ${book.title}
          </h1>
          <p class="book-author">
            Author: <span>Edwin J. Elton, Martin J. Gruber, Stephen J. Brown, William N. Goetzmann</span>
          </p>
          <p class="book-publication">
            Publication: <span>Wiley</span> 
          </p>
          <p class="book-edition">
            Edition: <span>Third Edition</span>
          </p>
          <p class="book-category">
            Category: <span><a href="">Computer Science and Engineering</a></span> </p>
          <p class="book-qnty">
            In Stock: <span>5 Copies</span>
          </p>
          <p class="book-isbn">ISBN: <span>1054515154</span></p>
          <div class="btn-user">
            <button class="book-req-btn">Request for Book</button>
          </div>
        </div>
      </div>

    </section>
  `;
};
