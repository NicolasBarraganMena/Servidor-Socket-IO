//  document.getElementById('btnGoToRegister').onclick = goToRegister;
function goToRegister() {
  document.getElementById("panelLogin").classList.add("animate__fadeOutLeft");
  setTimeout(() => {
    document.getElementById("panelLogin").classList.add("hide");
    document.getElementById("panelRegistro").classList.remove("hide",'animate__fadeOutRight');
    document.getElementById("panelRegistro").classList.add("animate__fadeInRight");
  }, 550);
}

function goToLogin() {
  document
    .getElementById("panelRegistro").classList.add("animate__fadeOutRight");
  setTimeout(() => {
    document.getElementById("panelRegistro").classList.add("hide");
    document.getElementById("panelLogin").classList.remove("hide",'animate__fadeOutLeft');
    document.getElementById("panelLogin").classList.add("animate__fadeInLeft");
  }, 550);
}
