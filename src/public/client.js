let store = {
    user: { name: "Student" },
    apod: '',
    rovers: [
        {name: 'Curiosity', imgUrl: "https://mars.nasa.gov/system/feature_items/images/6037_msl_banner.jpg"},
        {name: 'Opportunity', imgUrl: "https://www.jpl.nasa.gov/missions/web/mer.jpg"},
        {name: 'Spirit', imgUrl: "https://www.jpl.nasa.gov/missions/web/mer.jpg"}
        ],
};

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store).then(() => console.log("Store updated"));
};

const addEvents = () => {
    store.rovers.forEach(rover => document.getElementById(rover.name.toLowerCase()+"-tab").addEventListener("click", () => getRoverImages(rover.name.toLowerCase())));
};

const render = async (root, state) => {
    root.innerHTML = App(state)
    // addEvents();
};

// create content
const App = (state) => {
    let { rovers, apod } = state;

    return `
        <header></header>
        <main>
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
    const photodate = new Date(apod.date);
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store);
        console.log("Apod", apod);
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
    return (`
        <div class="container" style="max-width: 60%">
            <div class="card">
                <div class="card-header">
                    Astronomy Picture of the Day
                </div>
                <img src="${apod.image.url}" class="card-img-top" height="100%" width="100%" alt=${apod.image.title}/>
                <div class="card-body">
                    <h5 class="card-title">${apod.image.title}</h5>
                    <h6 class="card-subtitle">&#169;${apod.image.copyright} | ${apod.image.date}</h6>
                    ${renderModal(apod)}
                </div>
            </div>
        </div>
    `)
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
    // let { apod } = state;
    const apod = {
        image: {
            copyright: 'Jose Mtanous',
            date: '2020-10-24',
            explanation: 'Globular star cluster 47 Tucanae is a jewel of the southern sky. Also known as NGC 104, it roams the halo of our Milky Way Galaxy along with some 200 other globular star clusters. The second brightest globular cluster (after Omega Centauri) as seen from planet Earth, it lies about 13,000 light-years away and can be spotted naked-eye close on the sky to the Small Magellanic Cloud in the constellation of the Toucan. The dense cluster is made up of hundreds of thousands of stars in a volume only about 120 light-years across. Red giant stars on the outskirts of the cluster are easy to pick out as yellowish stars in this sharp telescopic portrait. Tightly packed globular cluster 47 Tuc is also home to a star with the closest known orbit around a black hole.',
            hdurl: 'https://apod.nasa.gov/apod/image/2010/ngc104v1Mtanous.jpg',
            media_type: 'image',
            service_version: 'v1',
            title: 'Globular Star Cluster 47 Tuc',
            url: 'https://apod.nasa.gov/apod/image/2010/ngc104v1Mtanous_1024.jpg'
        }
    }
    updateStore(store, { apod })
    // fetch(`http://localhost:3000/apod`)
    //     .then(res => res.json())
    //     .then(apod => updateStore(store, { apod }));

    // return data;
};

const getRoverImages = (name) => {
    console.log("STORE", name)
    const data  = {
        method: "POST",
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }

    const foundRoverIndex =  store.rovers.findIndex(rover => rover.name.toLowerCase() === name);
    console.log("found rover index", foundRoverIndex);
    if(foundRoverIndex !== -1 && (!store.rovers[foundRoverIndex].hasOwnProperty("photos") || store.rovers[foundRoverIndex].photos.length === 0)) {
        // fetch("./assets/temp/response.json").then(res => res.ok ? res.json() : false).then(jsonRes => {
        //     const newRover = store.rovers[foundRoverIndex];
        //     console.log("New Rover", newRover);
        //     if(jsonRes.hasOwnProperty("photos")) {
        //         newRover.photos = jsonRes.photos;
        //         newRover.landingDate =  jsonRes.photos[0]["rover"]["landing_date"];
        //         newRover.launchDate =  jsonRes.photos[0]["rover"]["launch_date"];
        //         newRover.status =  jsonRes.photos[0]["rover"]["status"];
        //         const rovers = foundRoverIndex === 0
        //             ? [newRover, ...store.rovers.slice(1)] :
        //             [...store.rovers.slice(0, foundRoverIndex), newRover, ...store.rovers.slice(foundRoverIndex + 1)];
        //         updateStore(store, {rovers});
        //     }
        // });

        data.body = JSON.stringify({date: "2018-01-24"})
        fetch(`http://localhost:3000/rovers/rover/${name}`, data)
            .then(res => res.ok ? res.json() : false)
            .then(jsonRes => {
                console.log("Json Res", jsonRes);
                const newRover = store.rovers[foundRoverIndex];
                console.log("New Rover", newRover);
                if (jsonRes.hasOwnProperty("roverData")) {
                    newRover.photos = jsonRes.roverData.photos;
                    newRover.landingDate = newRover.photos[0]["rover"]["landing_date"];
                    newRover.launchDate = newRover.photos[0]["rover"]["launch_date"];
                    newRover.status = newRover.photos[0]["rover"]["status"];
                    const rovers = foundRoverIndex === 0
                        ? [newRover, ...store.rovers.slice(1)] :
                        [...store.rovers.slice(0, foundRoverIndex), newRover, ...store.rovers.slice(foundRoverIndex + 1)];
                    updateStore(store, {rovers});
                }
            });
    }
};

