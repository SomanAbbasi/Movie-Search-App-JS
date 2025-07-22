

const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');
const detailsModal = document.getElementById('movieDetails');
const loadingElement = document.querySelector('.loading');
const apiKey = 'b691d117'; // OMDb API Key


// Elements for movie details
const detailPoster = document.getElementById('detail-poster');
const detailTitle = document.getElementById('detail-title');
const detailYear = document.getElementById('detail-year');
const detailRuntime = document.getElementById('detail-runtime');
const detailRating = document.getElementById('detail-rating');
const detailGenre = document.getElementById('detail-genre');
const detailPlot = document.getElementById('detail-plot');
const detailDirector = document.getElementById('detail-director');
const detailActors = document.getElementById('detail-actors');
const detailAwards = document.getElementById('detail-awards');


hideLoading();
searchInput.addEventListener('input', debounce(handleSearch, 500))

function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) {
        showEmptyState();
        return;
    }

    showLoading(true);
    //hideLoading();


    fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.Response === "True" && data.Search) {
                displayResults(data.Search);
                hideLoading();

            }
            else {
                //Show error from API
                resultsContainer.innerHTML = `
            <div class="error-message">
            <p> ${data.Error || "No movies found."} </p>
            </div>`;
            }
        })
        .catch(err => {
            //Catch netwrok or unexpected error
            console.log("API fetch failed: ", err);
            showError("Error fetching data. Please try again later.");
        });
}

let currentSearchResults;

function displayResults(movies) {

    currentSearchResults=movies;
    resultsContainer.innerHTML = movies.map(movie => `

        <div class="movie-card" onclick="fetchDetails('${movie.imdbID}')">
        <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300x445?text=No+Image'}" alt="${movie.Title}">
        <div class="movie-info">
            <h4>${movie.Title}</h4>
            <p>${movie.Year}</p>
          </div>
        </div>
        `).join('');

}


function fetchDetails(id) {
    showLoading(false);

    fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(movie => {
            // console.log("API Response:", movie); // Debug
            if (movie.Response === "True") {
                displayMovieDetails(movie);
            } else {
                showError("Could not load movie details.");
                hideLoading();

            }
        })
        .catch(error => {
            console.log(error);
            showError("Error fetching movie details.")
            hideLoading();

        });
}
function displayMovieDetails(movie) {
    detailPoster.src = movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300x445?text=No+Image';

    detailTitle.textContent = `${movie.Title} (${movie.Year})`;
    detailYear.textContent = movie.Year;

    detailRuntime.textContent = movie.Runtime;
    detailRating.textContent = movie.imdbRating;
    detailGenre.textContent = movie.Genre;
    detailPlot.textContent = movie.Plot;
    detailDirector.textContent = movie.Director;
    detailActors.textContent = movie.Actors;
    detailAwards.textContent = movie.Awards;

    detailsModal.classList.add('active');
    hideLoading();
}
function closeModal() {
    detailsModal.classList.remove('active');
     if (currentSearchResults && currentSearchResults.length > 0) {
        displayResults(currentSearchResults);
    }
}


function showLoading() {
    loadingElement.style.display = 'block';
    resultsContainer.innerHTML = '';
}


function hideLoading() {
    loadingElement.style.display = 'none';
    

}

function showError(message) {

    resultsContainer.innerHTML = `
    
    <div class="error-message">
          <p>${message}</p>
    </div>`
    hideLoading();

}

function showEmptyState() {
    resultsContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-search"></i>
          <h3>Search for movies</h3>
          <p>Enter a movie title to begin your search</p>
        </div>`;
    hideLoading();

}


function debounce(func, delay) {

    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), delay);
    }
}

//Class Model when clicking outside

detailsModal.addEventListener('click', (e) => {

    if (e.target == detailsModal) {
        closeModal();
    }


});
// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && detailsModal.classList.contains('active')) {
        closeModal();
    }
});

