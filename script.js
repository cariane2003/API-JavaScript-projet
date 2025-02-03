const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".uil-times");
const dowloadImgBtn = lightBox.querySelector(".uil-import");



//Api key, paginations, searchThere variables
const apikey = "JmUeDcaIgpF7n0K7hlqzb4kM5NewXpbID7RjDJM1i2g0aNNVe56qZHEs";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const downloardImg = (imgURL) => {
    //Converting received img to blob, creating its download link, & dowloading it
    fetch(imgURL).then(res => res.blob()).then(file => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
    }).catch(() => alert("Failed to dowload image!"));
}

const showLightbox = (name, img) => {
    //Showing lightbox and setting img source, name and button attribute
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerText = name;
    dowloadImgBtn.setAttribute("data-img", img);
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden";
}
const hideLightbox = () => {
    lightBox.classList.remove("show");
    document.body.style.overflow = "auto";
}

    const generateHTML = (images) => {
    //Making li of all fetched images and adding then to the existing image wrapper
    imagesWrapper.innerHTML += images.map(img =>
        `<li class="card" onclick="showLightbox('${img.photographer}', '${img.scr.large2x}')">
            <img src="${img.scr.large2x}" alt="img">
            <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onclick="downloardImg('${img.scr.large2x}');event.stopPropagation();">
                    <i class="uil uil-import"></i>
                </button>
            </div>
        </li>`
    ).join("");
}

const getImages = (apiURL) => {
   // Fetiching images by API call with authorization header
   loadMoreBtn.innerText = "Loading...";
   loadMoreBtn.classList.add("disabled");
   fetch(apiURL, {
        headers: { Authorization: apiKey }
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.classList.remove("disabled");
    }).catch(() => alert("Failed to load images!"));
}

const loadMoreImages = () => {
    currentPage++; //Increment currentPage by 1
    // If searchTerm has some value then call API with search term else call default API
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL
    getImages(apiURL);
}

const loadSearchImages = (e) => {
    //If the search input is empty, set the search term to null and return form here
    if(e.target.value === "") return searchTerm = null;
//If pressed key is Enter, update the current page, search term & call the getImages
    if(e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightbox);
dowloadImgBtn.addEventListener("click", () => downloardImg(e.target.dataset.img));


