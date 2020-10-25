let store = Immutable.Map({
    user: Immutable.Map({ name: "Student" }),
    apod: '',
    rovers: Immutable.List([
        Immutable.Map({name: 'Curiosity', imgUrl: "https://mars.nasa.gov/system/feature_items/images/6037_msl_banner.jpg"}),
        Immutable.Map({name: 'Opportunity', imgUrl: "https://www.jpl.nasa.gov/missions/web/mer.jpg"}),
        Immutable.Map({name: 'Spirit', imgUrl: "https://www.jpl.nasa.gov/missions/web/mer.jpg"})
        ]),
    load: true
});

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (state, newState) => {
    store = state.merge(newState);
    render(root, store).then(() => console.log("Store updated"));
};

const render = async (root, state) => {
    getRoverImages(state);
    root.innerHTML = App(state);
};

// create content
const App = (state) => {
    const rovers = state.get("rovers");
    const apod = state.get("apod");
    return `
        <header></header>
        <main>
            <h1 style="text-align: center">MARS DASHBOARD PROJECT</h1>
            <section>
                ${ImageOfTheDay(apod)}
            </section>
           <section id="rovers-select">
                ${renderRoverChooser(rovers)}
           </section>  
        </main>
        <footer></footer>
    `
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store);
});

// ------------------------------------------------------  COMPONENTS

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
    // If image does not already exist, or it is not from today -- request it again
    const today = new Date();
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store);
    }
    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return renderImageOfTheDay(apod);
    }
};

const renderImageOfTheDay = (apod) => {
    if(apod && apod.toObject()) {
        const objectApod = apod.toObject();
        return (`
        <div class="container" style="max-width: 60%">
            <div class="card">
                <div class="card-header">
                    Astronomy Picture of the Day
                </div>
                <img src="${objectApod.image.url}" class="card-img-top" height="100%" width="100%" alt=${objectApod.image.title}/>
                <div class="card-body">
                    <h5 class="card-title">${objectApod.image.title}</h5>
                    <h6 class="card-subtitle">&#169;${objectApod.image.copyright} | ${objectApod.image.date}</h6>
                    ${renderModal(objectApod)}
                </div>
            </div>
        </div>
    `)
    }
    return "";
};

const renderModal = (apod) => {
    return (`
        <p class="card-text my-2">
         <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
            About this picture
        </button>
        </p>
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">${apod.image.title}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                ${apod.image.explanation}
              </div>
              <div class="modal-footer">
                  <a class="btn btn-primary" target="_blank" href=${apod.image.url} role="button">
                    See original image
                  </a>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
    `)
};


// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, store.set("apod",Immutable.Map(apod))));

};

const getRoverImages = (store) => {
    const data  = {
        method: "POST",
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }
    if(store.get("load")) {
        data.body = JSON.stringify({date: "2018-01-24"});
        Promise.all(store.get("rovers").map(rover => {
            const newRover = Immutable.Map(rover);
            const photos = rover.get("photos");
            if(!photos) {
                return fetch(`http://localhost:3000/rovers/rover/${rover.get("name").toLowerCase()}`, data)
                    .then(res => res.ok ? res.json() : false)
                    .then(jsonRes => {
                        if (jsonRes.hasOwnProperty("roverData") && jsonRes.roverData.hasOwnProperty("photos") && jsonRes.roverData.photos.length > 0) {
                            const roverPhotos = newRover.set("photos", Immutable.List(jsonRes.roverData.photos));
                            const roverLaunchDate = roverPhotos.merge(roverPhotos.set("launchDate", roverPhotos.get("photos").first()["rover"]["launch_date"]));
                            const roverLandingDate = roverLaunchDate.merge(roverLaunchDate.set("landingDate", roverPhotos.get("photos").first()["rover"]["landing_date"]));
                            const roverStatus = roverLandingDate.merge(roverLandingDate.set("status", roverPhotos.get("photos").first()["rover"]["status"]));
                            return roverStatus;
                        }
                        return newRover;
                    });
            }
           return newRover
        })).then(rovers => {
            const loadStore = store.merge(store.set("load", false));
            updateStore(store, loadStore.set("rovers", rovers));
        });
    }
};

