const apiKey = 'ba52e921528070fc87d272c4c2b4254d';
const movieGrid = document.getElementById('movie-grid');
const genreSelect = document.getElementById('genre-select');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

// Fetch movies from the TMDB API
async function fetchMovies(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
}

// Fetch and display top-rated movies by default
async function displayTopRatedMovies() {
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;
    const movies = await fetchMovies(url);
    displayMovies(movies);
}

// Fetch and display movies by selected genre
async function displayMoviesByGenre(genreId) {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=en-US&page=1`;
    const movies = await fetchMovies(url);
    displayMovies(movies);
}

// Display the movies on the page
function displayMovies(movies) {
    movieGrid.innerHTML = ''; // Clear previous movies
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        
        const moviePoster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'placeholder.jpg';
        const movieReleaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
        const movieLink = `https://www.themoviedb.org/movie/${movie.id}`; // TMDB movie info link

        // Wrap the movie card content in an <a> tag
        movieCard.innerHTML = `
            <a href="${movieLink}" target="_blank" style="text-decoration: none; color: inherit;">
                <img src="${moviePoster}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>Year: ${movieReleaseYear}</p>
                <p>Rating: ${movie.vote_average}/10</p>
            </a>
        `;
        movieGrid.appendChild(movieCard);
    });
}


// Fetch genres from the API and populate the genre select dropdown
async function fetchGenres() {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;
    const response = await fetch(url);
    const data = await response.json();
    const genres = data.genres;

    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
    });
}

// Search for movies by query and genre
async function searchMovies(query, genreId = '') {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${query}&with_genres=${genreId}&page=1`;
    const movies = await fetchMovies(url);
    displayMovies(movies);
}

// Event listener for the search form
searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = searchInput.value;
    const genreId = genreSelect.value;
    
    if (query.trim() === '') {
        displayTopRatedMovies(); // If search bar is cleared, display top-rated movies again
    } else {
        await searchMovies(query, genreId);
    }
});

// Event listener for when search input is cleared
searchInput.addEventListener('input', () => {
    if (searchInput.value.trim() === '') {
        displayTopRatedMovies();
    }
});

// Event listener for the genre select dropdown
genreSelect.addEventListener('change', async () => {
    const genreId = genreSelect.value;
    if (genreId) {
        await displayMoviesByGenre(genreId);
    } else {
        displayTopRatedMovies(); // If no genre is selected, show top-rated movies
    }
});

// Initial loading of top-rated movies and genres
window.onload = async () => {
    await fetchGenres();
    await displayTopRatedMovies();
};
