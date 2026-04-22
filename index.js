// ── Theme toggle ──────────────────────────────────────────
(function initTheme() {
  const STORAGE_KEY = 'theme';
  const MOON = '☽';
  const SUN = '☀';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = theme === 'dark' ? SUN : MOON;
    document.querySelectorAll('.theme-toggle').forEach((btn) => {
      btn.textContent = icon;
    });
  }

  const storedTheme = localStorage.getItem(STORAGE_KEY);
  const saved = storedTheme || 'light';

  if (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  } else {
    applyTheme(saved);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.theme-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
      });
    });
  });
}());

const menuicon = document.getElementById('menu');
const menumodal = document.getElementById('menu-overlay');
const menuclose = document.getElementById('menu-close');
const maincontainer = document.getElementById('main-container');

document.addEventListener('DOMContentLoaded', () => {
  const textElement = document.getElementById('text');
  const combinedText = "Hi, I'm Noel.\nGlad to see you!";
  const typingDuration = 5; // Total duration for typing the text in seconds

  function typeText(element, text, duration) {
    let currentText = '';
    let charIndex = 0;
    const typingSpeed = (duration / text.length) * 1000;

    function typeChar() {
      if (charIndex < text.length) {
        currentText += text[charIndex];
        element.innerHTML = currentText.replace(/\n/g, '<br/>');
        charIndex += 1;
        setTimeout(typeChar, typingSpeed);
      }
    }

    element.parentElement.style.visibility = 'visible'; // Make the h1 visible
    typeChar();
  }

  // Start typing the text
  typeText(textElement, combinedText, typingDuration);
});

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

// project pop-up section
const projectContainer = document.querySelector('#popupWindow');

const projectsData = [
  {
    id: '1',
    name: 'AmannaTrust',
    image: 'amannatrust.webp',
    company: 'solo project',
    role: 'fullstack',
    year: '2023',
    descrShort: 'A website for a non-profit organisation helping underprivileged children access education, built with HTML, CSS, and JavaScript.',
    problem: 'The organisation had no online presence to communicate their mission or attract donors and volunteers. They needed a site that loaded fast globally and was easy to navigate.',
    built: 'Designed and built a fully static site using semantic HTML, vanilla CSS, and JavaScript — no frameworks — prioritising accessibility, fast load times, and a clear content hierarchy.',
    learned: 'Practiced building a polished, production-ready UI without a framework, sharpening skills in semantic markup, CSS layout, and responsive design from first principles.',
    language: ['HTML', 'CSS', 'JavaScript'],
    liveLink: 'https://noellincoln.github.io/first-capstone-project/',
    sourceLink: 'https://github.com/NoelLincoln/first-capstone-project',
  },
];

function popUpWindow(project) {
  const languageListItems = project.language
    .map((language) => `<li class='html-lan'>${language}</li>`)
    .join('');

  const projectcontent = `
  <div class="popup-container">
     <div class="works-popup works-popup-desktop">
                    <div class="primary-text">
                        <div class="popup-close">
                            <h2>${project.name}</h2>
                            <img src="assets/images/close-icon.png" id="closepopup">
                        </div>

                        <div class="work-info work-info-popup-desktop">
                            <div class="client">
                                <p>${project.company}</p>
                            </div>
                            <div class="counter"></div>
                            <div class="role">
                                <p>${project.role}</p>
                            </div>
                            <div class="counterone"></div>

                            <div class="year">
                                <p>${project.year}</p>
                            </div>

                        </div>
                    </div>
                    <div class="snapshot snapshot-popup-desktop">
                        <img src="assets/images/${project.image}"
                            alt="snapshot" />
                    </div>
                    <div class="card-info card-info-popup swap">

                        <div class="description-text description-text-popup case-study">
                            <div class="case-study-section">
                                <h4 class="case-study-label">Problem</h4>
                                <p>${project.problem}</p>
                            </div>
                            <div class="case-study-section">
                                <h4 class="case-study-label">What I built</h4>
                                <p>${project.built}</p>
                            </div>
                            <div class="case-study-section">
                                <h4 class="case-study-label">What I learned</h4>
                                <p>${project.learned}</p>
                            </div>
                        </div>
                        <div class="right right-desktop">
                          <ul class="language-tags">
                            ${languageListItems}
                        </ul>

                        <div class="divider">
                         <img src="assets/images/divider.png" />
                         </div>
                         <div class="project-action-buttons project-action-buttons-desktop">
                           <a href="${project.liveLink}" target="_blank" rel="noopener noreferrer">
                              <div class="view-project-btn" id="viewprojectbtn">
                                <p>See live</p>
                                <img src="assets/images/see-live.png" />
                              </div>
                            </a>
                           <a href="${project.sourceLink}" target="_blank" rel="noopener noreferrer">
                              <div class="view-project-btn " id="viewsourcebtn">
                                  <p>See source</p>
                                  <img src="assets/images/source-code.png" />
                              </div>
                          </a>
                         </div>
                        </div>

                    </div>

                </div>
      </div>

          `;

  return projectcontent;
}
// projectcards
function projectWorkCards(projectsData = []) {
  let projectContent = '';

  projectsData.forEach((project) => {
    projectContent += `
    <div class="works">
                    <div class="snapshot" id="snapshot">
                        <img src="assets/images/${project.image}" alt="snapshot" />
                    </div>
                    <div class="card-info">
                        <div class="primary-text">
                            <h2>${project.name}</h2>
                            <div class="work-info">
                                <div class="client">
                                    <p>${project.company}</p>
                                </div>
                                <div class="counter"></div>
                                <div class="role">
                                    <p>${project.role}</p>
                                </div>
                                <div class="counterone"></div>

                                <div class="year">
                                    <p>${project.year}</p>
                                </div>

                            </div>
                        </div>
                        <div class="description-text ">
                            <p> ${project.descrShort}.</p>
                        </div>
                        <ul class="language-tags">
                            
                        </ul>
                        <div class="action">
                            <button class="action-button view-project"  project-id="${project.id}">See project</button>
                        </div>
                    </div>
                </div>
    `;
  });
  return projectContent;
}

// close popup
function closeWindow() {
  projectContainer.style.display = 'none';
  maincontainer.classList.remove('blurbg');
}

function openWindow(project) {
  maincontainer.classList.add('blurbg');
  const windowTemplate = popUpWindow(project);
  projectContainer.innerHTML = windowTemplate;
  projectContainer.style.display = 'block';

  const popUpCloseButton = document.querySelector('#closepopup');
  popUpCloseButton.style.width = '50px';
  popUpCloseButton.style.height = '28px';

  popUpCloseButton.addEventListener('click', closeWindow);
}

window.addEventListener('load', () => {
  const projectsSection = document.querySelector('#projects');
  projectContainer.style.display = 'none';

  projectsSection.innerHTML = projectWorkCards(projectsData);

  const viewprojbtn = document.querySelectorAll('.view-project');

  Array.from(viewprojbtn).forEach((element) => {
    element.addEventListener('click', () => {
      const projectID = element.getAttribute('project-id');
      const projectObj = projectsData.find(
        // eslint-disable-next-line comma-dangle
        (project) => project.id === projectID
      );

      openWindow(projectObj);
    });
  });
});
