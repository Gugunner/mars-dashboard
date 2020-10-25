//renders all the components of rover chooser
const renderRoverChooser = rovers => {
    if(rovers && rovers.length > 0) {
        return `
        <div class="card text-center" style="width: 60%">
          <div class="card-header">
            <ul class="nav nav-tabs" id="rovers-tabs" role="tablist">
               ${rovers.map(renderRoverTab).join(" ")}
            </ul>
          </div>
               ${renderRoverData(rovers)}
        </div>
    `
    }
    return "";
};

const renderRoverTab = (rover, idx) => {
    if(rover && rover.toObject()) {
        const roverObject = rover.toObject();
        const roverClass = `nav-link ${idx === 0 ? " active" : ""}`;
        const selected = idx === 0 ? "true" : "false";
        return `
            <li class="nav-item" role="presentation">
                <a class="${roverClass}" id="${roverObject.name.toLowerCase()}-tab" data-toggle="tab" href="#${roverObject.name.toLowerCase()}" role="tab" aria-controls="${roverObject.name.toLowerCase()}" aria-selected=${selected}>
                    ${roverObject.name.toUpperCase()}
                </a>
            </li>
       `
    }
   return "";
};

//Renders rover data and checks for specific info to add as footer
const renderRoverData = rovers => {
    return `
        <div class="tab-content">
            ${rovers.map((rover,idx) => {
        if(rover && rover.toObject()) {
            const roverObject = rover.toObject();
            const roverClass = `tab-pane fade ${idx === 0 ? " show active" : ""} `;
            return ` 
                 <div class="${roverClass}" id=${roverObject.name.toLowerCase()} role="tabpanel" aria-labeledby="${roverObject.name.toLowerCase()}-tab">
                    <div class="card-body" id="rovers-content">
                        <h5>${roverObject.name.toUpperCase()} IMAGES</h5>                      
                        ${roverObject.hasOwnProperty("photos") ? renderRoverPhotosCarousel(roverObject) : "No photos were found, try again tomorrow"}
                        <p class="card-text">
                            <small class="text-muted">
                                ${roverObject.hasOwnProperty("launchDate") ? `Launch Date: ${roverObject.launchDate} |` : ""} 
                                ${roverObject.hasOwnProperty("landingDate") ? `Landing Date: ${roverObject.landingDate} | ` : ""} 
                                ${roverObject.hasOwnProperty("status") ? `Status: ${roverObject.status}` : ""} 
                            </small>
                        </p>
                    </div>
                </div>
                `
        }
        return "";
    }).join("")}
        </div>
  `
};

const renderRoverPhotosCarousel = rover => {
        return `
        <div id="${rover.name.toLowerCase()}-carousel" class="carousel slide" data-ride="carousel">
          <div class="carousel-inner">
            ${rover.photos.map((photo, idx) => {
            const carouselClass = `carousel-item ${idx === 0 ? "active" : ""}`;
            return `
                    <div class="${carouselClass}" data-interval="2000" data-pause="true">
                        <img src=${photo["img_src"]} alt="Photo ${rover.name.toLowerCase()}">
                        <div class="carousel-caption d-none d-md-block" style="background-color: rgba(78,78,78,0.8)">
                             ${photo.hasOwnProperty("earth_date") ? `Photo Date: ${new Date(photo["earth_date"]).toLocaleString()}` : ""} 
                        </div>
                    </div>
                `
        }).join("")}
          </div>
          <a class="carousel-control-prev" href="#${rover.name.toLowerCase()}-carousel" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
          </a>
          <a class="carousel-control-next" href="#${rover.name.toLowerCase()}-carousel" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
          </a>
        </div>
    `
};
