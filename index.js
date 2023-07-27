const menuicon = document.getElementById('menu');
const menumodal = document.getElementById('menu-overlay');
const menuclose = document.getElementById('menu-close');
const maincontainer = document.getElementById('main-container');

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
    id: 'project_one',
    name: 'Tonic',
    image: 'snapshot2.png',
    descrShort:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essent",
    descrLong:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it 1960s with the releaLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it 1960s with the releorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum han printer took a galley of type and scrambled it 1960s with the releawn printer took a galley of type and scrambled it 1960s with the releaLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it 1960s with the relea",
    details:
      'A daily selection of privately personalized reads; accounts or sign-ups required.',
    liveLink: 'https://noellincoln.github.io',
    sourceLink: 'https://github.com/NoelLincoln/noellincoln.github.io',
  },
  {
    id: 'project_two',
    name: 'Multipost',
    image: 'Multipoststories2.png',
    descrShort:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essent",
    descrLong:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it 1960s with the releaLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it 1960s with the releorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum han printer took a galley of type and scrambled it 1960s with the releawn printer took a galley of type and scrambled it 1960s with the releaLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it 1960s with the relea",
    details:
      'Experimental content creation feature that allows users to add to an existing story over the course of a day without spamming their friends.',
    liveLink: 'https://noellincoln.github.io',
    sourceLink: 'https://github.com/NoelLincoln/noellincoln.github.io',
  },
  {
    id: 'projectthree',
    name: 'Tonic',
    image: 'snapshot2.png',
    descrShort:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essent",
    descrLong:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it 1960s with the releaLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it 1960s with the releorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum han printer took a galley of type and scrambled it 1960s with the releawn printer took a galley of type and scrambled it 1960s with the releaLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it 1960s with the relea",
    details:
      "Exploring the future of media in Facebook's first Virtual Reality app; a place to discover and enjoy 360 photos and videos on Gear VR.",
    liveLink: 'https://noellincoln.github.io',
    sourceLink: 'https://github.com/NoelLincoln/noellincoln.github.io',
  },
  {
    id: 'projectfour',
    name: 'Multipost',
    image: 'multipoststories.png',
    descrShort:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essent",
    descrLong:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it 1960s with the releaLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it 1960s with the releorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum han printer took a galley of type and scrambled it 1960s with the releawn printer took a galley of type and scrambled it 1960s with the releaLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it 1960s with the relea",
    details:
      "Exploring the future of media in Facebook's first Virtual Reality app; a place to discover and enjoy 360 photos and videos on Gear VR.",
    liveLink: 'https://noellincoln.github.io',
    sourceLink: 'https://github.com/NoelLincoln/noellincoln.github.io',
  },
];

// ------------popup modal------------------

function popUpWindow(project) {
  const projectcontent = `
  <div class="popup-container ">
     <div class="works-popup works-popup-desktop">
                    <div class="primary-text">
                        <div class="popup-close">
                            <h2>${project.name}</h2>
                            <img src="assets/images/icon-cancel.png" id="closepopup">
                        </div>

                        <div class="work-info work-info-popup-desktop">
                            <div class="client">
                                <p>CANOPY</p>
                            </div>
                            <div class="counter"></div>
                            <div class="role">
                                <p>Backend Dev</p>
                            </div>
                            <div class="counterone"></div>

                            <div class="year">
                                <p>2015</p>
                            </div>

                        </div>
                    </div>
                    <div class="snapshot snapshot-popup-desktop">
                        <img src="assets/images/${project.image}"
                            alt="snapshot" />
                    </div>
                    <div class="card-info card-info-popup swap">

                        <div class="description-text description-text-popup">
                            <p>${project.descrShort}</p>
                        </div>
                        <div class="right right-desktop">
                          <ul class="language-tags">
                            <li class="html-lan">HTML</li>
                            <li class="css">CSS</li>
                            <li class="javascript">Javascript</li>

                        </ul>

                        <div class="divider">
                         <img src="assets/images/divider.png" />
                         </div>
                         <div class="project-action-buttons project-action-buttons-desktop">
                           <a href="${project.liveLink}" rel="noreferer">

                            <div class="view-project-btn view-project-btn-desktop" id="viewprojectbtn">
                               <p>See live</p>
                               <img src="assets/images/see-live.png" />  
                            </div>
                               </a>
                           <a href="${project.sourceLink}" rel="noreferer">
                           <div class="view-project-btn" id="viewsourcebtn">
                               <p>See source</p>
                               <a href="${project.sourceLink}" rel="noreferer">
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
                    <div class="snapshot">
                        <img src="assets/images/${project.image}" alt="snapshot" />
                    </div>
                    <div class="card-info">
                        <div class="primary-text">
                            <h2>${project.name}</h2>
                            <div class="work-info">
                                <div class="client">
                                    <p>CANOPY</p>
                                </div>
                                <div class="counter"></div>
                                <div class="role">
                                    <p>Backend Dev</p>
                                </div>
                                <div class="counterone"></div>

                                <div class="year">
                                    <p>2015</p>
                                </div>

                            </div>
                        </div>
                        <div class="description-text ">
                            <p> ${project.descrShort}.</p>
                        </div>
                        <ul class="language-tags">
                            <li class="html-lan">HTML</li>
                            <li class="css">CSS</li>
                            <li class="javascript">Javascript</li>
                        </ul>
                        <div class="action">
                            <button class="action-button"  project-id="${project.id}" id="view-project">See project</button>
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

  popUpCloseButton.addEventListener('click', closeWindow);
}

window.addEventListener('load', () => {
  const projectsSection = document.querySelector('#projects');
  projectContainer.style.display = 'none';

  projectsSection.innerHTML = projectWorkCards(projectsData);

  const viewprojbtn = document.querySelectorAll('#view-project');

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
