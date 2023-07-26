const menuicon = document.getElementById('menu');
const menumodal = document.getElementById('menu-overlay');
const menuclose = document.getElementById('menu-close');

function menuOverlay() {
  if (menuicon.style.display === 'block') {
    menuicon.style.display = 'none';
    menumodal.style.display = 'flex';
  } else {
    menuicon.style.display = 'block';
    menumodal.style.display = 'none';
  }
}
menuicon.addEventListener('click', menuOverlay);

function closeMenuOverlay() {
  menumodal.style.display = 'none';
  menuicon.style.display = 'flex';
}

menuclose.addEventListener('click', closeMenuOverlay);
