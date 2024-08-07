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
    name: 'Events Management Application',
    image: 'eventsapp.png',
    company: 'solo project',
    role: 'fullstack',
    year: '2024',
    descrShort: 'An event management application built majorly with Next.js, TypeScript and TailwindCSS. It uses MongoDB for the database and Clerk for user management. ',
    descrLong: 'A Next.js application that provides an event management platform. Users can create events, manage their events, and view their events. They can also view other events from other users. ',
    language: ['Next.js', 'TailwindCSS', 'TypeScript'],
    details:
      'View the latest tech events, network ,learn and grow 🚀 .',
    liveLink: 'https://events-app-next-mu.vercel.app/',
    sourceLink: 'https://github.com/NoelLincoln/events-app-next',
  },
  {
    id: '2',
    name: 'Air Pollution Stats',
    image: 'air-pollution-stats.webp',
    company: 'solo project',
    role: 'fullstack',
    year: '2023',
    descrShort:
      'Air Pollution Stats is a webapp built with the aim of sharing information about air pollution for various regions around the globe.',
    descrLong:
      'This application provides statistics about air pollution. It is built with react ,redux and openweather api. When the application first loads, it geolocates the users device and loads the states from/in  the country. A user will then proceed to select a state and get data about the air quality index.',
    language: ['React', 'Redux', 'REST API'],
    details: 'Get air quality index data from all over the globe.',
    liveLink: 'https://air-pollution-stats.onrender.com/',
    sourceLink: 'https://github.com/NoelLincoln/air-pollution-stats',
  },
  {
    id: '3',
    name: 'AmannaTrust',
    image: 'amannatrust.webp',
    company: 'solo project',
    role: 'fullstack',
    year: '2023',
    descrShort:
      'Amannatrust is a project based on a non governmental organization formed with the aim to help needy children get access to education. The application is built with HTML, vanilla CSS and vanilla Javascript.',
    descrLong:
      'The organization operates on a project-based model, strategically implementing initiatives geared towards providing access to education for those who need it most. At its core, Amannatrust is driven by a profound commitment to addressing the barriers that hinder children from receiving quality education. These barriers may include financial constraints, lack of educational infrastructure, societal challenges, or other forms of disadvantage. Through its projects, Amannatrust endeavors to dismantle these barriers, empowering children with the knowledge and skills they need to thrive.',
    language: ['HTML', 'CSS', 'JavaScript'],

    details:
      "Exploring the future of media in Facebook's first Virtual Reality app; a place to discover and enjoy 360 photos and videos on Gear VR.",
    liveLink: 'https://noellincoln.github.io/first-capstone-project/',
    sourceLink: 'https://github.com/NoelLincoln/first-capstone-project',
  },
  {
    id: '4',
    name: 'To do list',
    image: 'todolist.webp',
    company: 'solo project',
    role: 'fullstack',
    year: '2023',
    descrShort: 'a simple to do list application',
    descrLong:
      'Users can plan their schedules easily with this application. They can add to do items, edit existing to do items , sort the items and remove them once accomplished',
    language: ['React', 'Redux'],
    details:
      'A daily selection of privately personalized reads; accounts or sign-ups required.',
    liveLink: 'https://noellincoln.github.io/to-do-list',
    sourceLink: 'https://github.com/NoelLincoln/to-do-list',
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

                        <div class="description-text description-text-popup">
                            <p>${project.descrLong}</p>
                        </div>
                        <div class="right right-desktop">
                          <ul class="language-tags">
                            ${languageListItems} 
                        </ul>

                        <div class="divider">
                         <img src="assets/images/divider.png" />
                         </div>
                         <div class="project-action-buttons project-action-buttons-desktop">
                           <a href="${project.liveLink}" target="_blank" rel="noopener" rel="noreferrer">
                              <div class="view-project-btn" id="viewprojectbtn">
                                <p>See live</p>
                                <img src="assets/images/see-live.png" />  
                              </div>
                            </a>
                           <a href="${project.sourceLink}" target="_blank" rel="noopener" rel="noreferrer">
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
