const modal = document.querySelector("#modal");
const modalText = modal.querySelector("p");

function showModal(message) {
  modal.style.display = "flex";
  modalText.innerText = message;
}

function removeModal() {
  modal.style.display = "none";
}

export { showModal, removeModal };
