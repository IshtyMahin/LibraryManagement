// Function to clear inputs and messages
function clearOtherComponents(current) {
  if (current !== "issue") {
    document.getElementById("issue-user-id").value = "";
    document.getElementById("issue-book-ids").value = "";
    document.getElementById("issue-message").innerText = "";
  }
  if (current !== "return") {
    document.getElementById("return-user-id").value = "";
    document.getElementById("return-book-ids").value = "";
    document.getElementById("return-message").innerText = "";
  }
  if (current !== "check") {
    document.getElementById("check-user-id").value = "";
    document.getElementById("user-message").innerText = "";
  }
}

// Issue Books Event Listener
document.getElementById("issue-button").addEventListener("click", async () => {
  clearOtherComponents("issue"); // Clear other components
  const userId = document.getElementById("issue-user-id").value;
  const bookIds = document
    .getElementById("issue-book-ids")
    .value.split(",")
    .map((id) => id.trim());

  const response = await fetch(
    `https://librarymanagementsystem-rmstu.vercel.app/api/admin/bookIssue/${userId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookList: bookIds }),
    }
  );

  const messageDiv = document.getElementById("issue-message");
  messageDiv.innerHTML = ""; // Clear previous message
  if (response.ok) {
    const result = await response.json();

    let message = "";
    if (result.issued && result.issued.length > 0) {
      message += `<p><strong>Books issued successfully:</strong> ${result.issued.join(
        ", "
      )}.</p>`;
    }
    if (result.notFound && result.notFound.length > 0) {
      message += `<p><strong>Books not found:</strong> ${result.notFound.join(
        ", "
      )}.</p>`;
    }
    if (result.notAvailable && result.notAvailable.length > 0) {
      message += `<p><strong>Books not available:</strong> ${result.notAvailable.join(
        ", "
      )}.</p>`;
    }
    if (result.alreadyIssued && result.alreadyIssued.length > 0) {
      message += `<p><strong>Books already issued:</strong> ${result.alreadyIssued.join(
        ", "
      )}.</p>`;
    }
    messageDiv.innerHTML = message;
  } else {
    const error = await response.json();
    messageDiv.innerHTML = `<p style="color:red;">${
      error.message || "An error occurred while issuing books."
    }</p>`;
  }
  event.preventDefault();
});

// Return Books Event Listener
document.getElementById("return-button").addEventListener("click", async () => {
  clearOtherComponents("return"); // Clear other components
  const userId = document.getElementById("return-user-id").value;
  const bookIds = document
    .getElementById("return-book-ids")
    .value.split(",")
    .map((id) => id.trim());

  const response = await fetch(
    `https://librarymanagementsystem-rmstu.vercel.app/api/admin/bookReturn/${userId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookList: bookIds }),
    }
  );

  const messageDiv = document.getElementById("return-message");
  messageDiv.innerHTML = ""; // Clear previous message
  if (response.ok) {
    const result = await response.json();
    let message = "";
    if (result.returned && result.returned.length > 0) {
      message += `<p><strong>Books returned successfully:</strong> ${result.returned.join(
        ", "
      )}.</p>`;
    }
    if (result.notFound && result.notFound.length > 0) {
      message += `<p><strong>Books not found:</strong> ${result.notFound.join(
        ", "
      )}.</p>`;
    }
    if (result.notPossessed && result.notPossessed.length > 0) {
      message += `<p><strong>Books not in possession:</strong> ${result.notPossessed.join(
        ", "
      )}.</p>`;
    }
    messageDiv.innerHTML = message;
  } else {
    const error = await response.json();
    messageDiv.innerHTML = `<p style="color:red;">${
      error.message || "An error occurred while returning books."
    }</p>`;
  }
  event.preventDefault();
});


const fetchUserInfo = async (regId) => {
  try {
    const res = await fetch(
      `https://librarymanagementsystem-rmstu.vercel.app/api/users/${regId}`
    );
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      return "user not found"
      throw new Error("Failed to fetch user info");
    }
  } catch (error) {
    return "user not found"
    console.error("Error fetching user information:", error);
  }
};


document.getElementById("check-button").addEventListener("click", async () => {
  clearOtherComponents("check"); 
  const userId = document.getElementById("check-user-id").value;
  const data = await fetchUserInfo(userId);
  const messageDiv = document.getElementById("user-message");

  if (data.regId) {
    window.location.href = `/profilePage/index.html?id=${data.regId}`;
  } else {
    messageDiv.innerHTML = `<p style="color:red;">${
      data || "An error occurred while checking user information."
    }</p>`;
  }
});
