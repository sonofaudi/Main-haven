const input = document.getElementById("avatarInput");
const btn = document.getElementById("saveAvatarBtn");
const statusText = document.getElementById("status");


btn.addEventListener("click", async () => {
  const avatarUrl = input.value.trim();

  if (!avatarUrl) {
    statusText.textContent = "Please enter a value";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/user/avatar", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({ avatarUrl })
    });

    const data = await res.json();

    if (!res.ok) {
      statusText.textContent = data.msg || "Failed";
      return;
    }

    statusText.textContent = "Avatar URL saved successfully ✅";
    input.value = "";

  } catch (err) {
    console.error(err);
    statusText.textContent = "Server error";
  }
});
