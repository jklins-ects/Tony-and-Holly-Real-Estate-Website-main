function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "block";
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "none";
}

document.querySelectorAll(".close-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.style.display = "none";
    });
  });
});

window.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
  }
});

document.getElementById("more-info").addEventListener("click", () => {
  openModal("info-modal");
});

document.getElementById("calc-btn").addEventListener("click", () => {
  openModal("calc-modal");
});