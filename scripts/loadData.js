let currentIndex = 0;
let slideInterval;

function moveSlide(direction) {
    const items = document.querySelectorAll(".carousel-item");
    const indicators = document.querySelectorAll(".carousel-indicator");
    const totalItems = items.length;
    items[currentIndex].classList.remove("active");
    indicators[currentIndex].classList.remove("active");
    currentIndex = (currentIndex + direction + totalItems) % totalItems;
    items[currentIndex].classList.add("active");
    indicators[currentIndex].classList.add("active");
}

function stopSlideShow() {
    clearInterval(slideInterval);
}

function startSlideShow() {
    slideInterval = setInterval(() => moveSlide(1), 3000);
}

function getHIDFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("hid") ? urlParams.get("hid") : 1;
}

const HID = getHIDFromURL();
const rootname = "../data"; // Define the rootname variable

fetch(`../data/data.json`)
    .then((response) => response.json())
    .then((data) => {
        const propertyData = data.find((property) => property.hid == HID);
        if (propertyData) {
            loadPropertyData(propertyData.property);
            addLogo(propertyData);
            let cimages = [];
            const folder = propertyData.rootname;
            for (let i = 1; i <= propertyData.numImages; i++) {
                cimages.push(`${folder}/DD&E${i}.jpeg`);
            }
            // propertyData.numImages.forEach((element, index) => {
            //     if (index === 0) return;
            //     cimages.push(rootname + `/DD&E${index}.jpg`);
            // });
            loadCarouselImages(cimages);

            //loadSimilarHomes(data, propertyData.similarHomes);
            //startSlideShow();
            loadSimilarHomesKlins(data);
        } else {
            console.error("Property not found");
        }
    })
    .catch((error) => console.error("Error loading data:", error));

function loadPropertyData(property) {
    document.getElementById("property-address").textContent = property.address;
    document.getElementById("property-description").textContent =
        property.description;
    document.getElementById(
        "property-price"
    ).textContent = `Price: $${property.price}`;
    document.getElementById("property-beds-baths-sqft").innerHTML = `
        <img class="icon" src="../images/icons/bed_24dp_000_FILL0_wght400_GRAD0_opsz24.png" alt=""/> ${property.beds} •
        <img class="icon" src="../images/icons/bathtub_24dp_000_FILL0_wght400_GRAD0_opsz24.png" alt=""/> ${property.baths} •
        <img class="icon" src="../images/icons/timeline_24dp_000_FILL0_wght400_GRAD0_opsz24.png" alt=""/> ${property.sqft} sqft
      `;
    document.getElementById(
        "highlight-parking"
    ).textContent = `Parking: ${property.parking}`;
    document.getElementById(
        "highlight-outdoor"
    ).textContent = `Outdoor: ${property.outdoor}`;
    document.getElementById("highlight-ac").textContent = `A/C: ${property.ac}`;
    document.getElementById(
        "highlight-hoa"
    ).textContent = `HOA: $${property.hoa}`;
    document.getElementById(
        "highlight-listing-date"
    ).textContent = `Listing Date: ${property.listingDate}`;
    document.getElementById(
        "highlight-price-per-sqft"
    ).textContent = `Price per Sq Ft: $${property.pricePerSqFt}`;
    document.getElementById(
        "basement"
    ).textContent = `Basement: ${property.basement}`;
    document.getElementById("rooms").textContent = `Rooms: ${property.rooms}`;
    document.getElementById(
        "types-of-rooms"
    ).textContent = `Room Types: ${property.typesOfRooms}`;

    const taxAssessmentBody = document.getElementById("tax-assessment-data");
    property.taxData.forEach((data) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${data.year}</td>
          <td>${data.tax}</td>
          <td>${data.assessment}</td>
        `;
        taxAssessmentBody.appendChild(row);
    });
}

function loadCarouselImages(images) {
    const propertyDataCarousel = document.querySelector(
        "#property-data-carousel .carousel-inner"
    );
    const carouselIndicators = document.querySelector(
        "#property-data-carousel .carousel-indicators"
    );
    images.forEach((image, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "carousel-item";
        if (index === 0) {
            itemDiv.classList.add("active");
        }
        const imgElement = document.createElement("img");
        imgElement.src = image;
        imgElement.alt = `Property Image ${index + 1}`;
        itemDiv.appendChild(imgElement);
        propertyDataCarousel.appendChild(itemDiv);

        const indicator = document.createElement("span");
        indicator.className = "carousel-indicator";
        if (index === 0) {
            indicator.classList.add("active");
        }
        indicator.addEventListener("click", () => {
            stopSlideShow();
            moveSlide(index - currentIndex);
            //startSlideShow();
        });
        carouselIndicators.appendChild(indicator);
    });
}

function loadSimilarHomes(data, similarHomes) {
    const similarHomesList = document.getElementById("similar-homes-list");
    similarHomes.forEach((hid) => {
        const homeData = data.find((property) => property.hid == hid);

        if (homeData) {
            const homeDiv = document.createElement("div");
            homeDiv.classList.add("similar-home");
            const folder = homeData.rootname;
            homeDiv.innerHTML = `
        <img src="${folder}/DD&E1.jpeg" alt="Similar Home Image">
        <p>${homeData.property.address}</p>
        <p>Price: $${homeData.property.price}</p>
      `;
            similarHomesList.appendChild(homeDiv);
        }
    });
}

function loadSimilarHomesKlins(data) {
    let hid = getHIDFromURL();
    const homelist = data.filter((property) => property.hid != hid);
    const similarHomesList = document.getElementById("similar-homes-list");
    similarHomesList.innerHTML = "";
    for (let home of homelist) {
        similarHomesList.innerHTML += getHomeCard(home);
    }
    console.log(homelist);
}

function getHomeCard(property) {
    return `
    <div class="col-md-3"> 
    <div class="card h-100" >
    <div style="height: 200px;" class=" d-flex align-items-center">
    <img class="card-img-top w-100" src="${property.rootname}/primary.jpeg" alt="Card image cap">
    </div>
  <div class="card-body">
    <h5 class="card-title">${property.property.address}</h5>
    <p class="card-text text-truncate">${property.property.description}</p>
    
  </div>
  <a href="buy.html?hid=${property.hid}" class="btn btn-primary">Check it out!</a>
</div>
</div>
    `;
}

function addLogo(propertyData) {
    document.getElementById(
        "developer-name"
    ).innerHTML = `<img src="${propertyData.rootname}/DD&E1.jpeg" class="w-100">`;
}
/*
document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".carousel-item");
    items[currentIndex].classList.add("active");
});
*/
