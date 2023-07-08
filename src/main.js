const API_KEY = '123293c6c692ce641570f9a57a28a2fa';

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },      
    params: {
        'api_key': API_KEY,
    }

})

searchFormInput.addEventListener('focusin', () => {
    searchForm.classList.add('search-form--focused')
})

searchFormInput.addEventListener('focusout', () => {
    searchForm.classList.remove('search-form--focused')
})


// Utils

async function createMovies(movies, parentContainer) {

    parentContainer.innerHTML = '';
    const toRender = [];
    movies.forEach(movie => {
        if (!movie.poster_path) {
            return;
        }
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', () => {
            location.hash = `movie=${movie.id}`;
        });

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', `${movie.title} poster`)
        movieImg.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
        
        movieContainer.appendChild(movieImg);
        //parentContainer.appendChild(movieContainer);
        toRender.push(movieContainer);
    });
    parentContainer.append(...toRender);
}

async function createCategories(categories, parentContainer) {
    parentContainer.innerHTML = '';
    const toRender = [];
    categories.forEach(category => {

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.textContent = `${category.name}`
        categoryTitle.id = `id${category.id}`
        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`;
        });

        categoryContainer.appendChild(categoryTitle);
        //parentContainer.appendChild(categoryContainer);
        toRender.push(categoryContainer);
    });
    parentContainer.append(...toRender);
}

// API calls

async function getTrendingMoviesPreview() { 
    const { data } = await api('trending/movie/day');
    const movies = data.results;

    createMovies(movies, trendingMovieListContainer);
}

async function getCategoriesPreview() { 
    const { data } = await api('genre/movie/list');

    const categories = data.genres;
   // console.log({ data, categories });
    createCategories(categories, categoriesContainer);

}

async function getMoviesByCategory(id) { 
    const { data } = await api('discover/movie', {
        params: {
            with_genres: id,
        }
    });

    const movies = data.results;
    createMovies(movies, genericSection)
}

async function getMoviesBySearch(query) { 
    const { data } = await api('search/movie', {
        params: {
            query,
        }
    });

    const movies = data.results;
    console.log(movies);
    createMovies(movies, genericSection)
    if (movies.length < 1) {
        genericSection.textContent = 'We coulnt find anything, try again with another name';
    }

    searchQuery.textContent = `Results for: ${query}`

}

async function getTrendingMovies() { 
    const { data } = await api('trending/movie/day');
    const movies = data.results;

    createMovies(movies, genericSection);
}

async function getMovieDetails(id) { 
    const { data: movie } = await api(`movie/${id}`);

    movieDetailTitle.textContent = movie.title;
    movieDetailTitle.href = location.href;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average.toFixed(1);
    movieDetailPoster.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    const [releaseYear, , ] = movie.release_date.split('-');

    releaseYear ? 
        movieDetailReleaseDate.textContent = ` (${releaseYear})` : 
        movieDetailReleaseDate.textContent = '';
    
    // console.log(movie.runtime);
    let hours = (movie.runtime / 60);
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);

    movieDetailRuntime.textContent = `${rhours}h ${rminutes}min`

    createCategories(movie.genres, movieDetailCategoriesList);

    let x = window.matchMedia('(max-width: 768px)');

    if (x.matches) {
        const movieImgUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        headerSection.style.background = `
            linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),
            url(${movieImgUrl})
        `;
    }


    getRelatedMovies(id);
    getDirector(id);
    getCast(id);
    getTrailerMovie(id);
    
/*     movie.genres.forEach(genre => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');
        const categoryTitle = document.createElement('h3');
        categoryTitle.id = `id${genre.id}`
        categoryTitle.classList.add('category-title');
        categoryTitle.textContent = `${genre.name}`;
        categoryContainer.appendChild(categoryTitle);

        movieDetailCategoriesList.appendChild(categoryContainer);
    }) */


}

async function getRelatedMovies(id) {
    const { data } = await api(`movie/${id}/recommendations`);
    const relatedMovies = data.results;
    // console.log(relatedMovies);
    
    createMovies(relatedMovies, relatedMoviesContainer);
    if(relatedMovies.length < 1) {
        relatedMoviesArticle.classList.add('inactive');
    }

    relatedMoviesContainer.scrollTo(0, 0);
}

async function getDirector(id) {
    const { data } = await api(`movie/${id}/credits`);
    const directorData = data.crew.filter(({job}) => job === 'Director');

    movieDetailDirectorContainer.innerHTML = '';
    directorData.forEach(director => {
        // const directorName = document.createTextNode(director.name)
        
        // movieDetailDirector.appendChild(directorName);
        const directorName = document.createElement('span');
        directorName.classList.add('movieDetail-director');
        directorName.textContent = director.name;
        movieDetailDirectorContainer.appendChild(directorName);
    })

    // movieDetailDirector.textContent = director;
}

async function getCast(id) {
    const { data } = await api(`movie/${id}/credits`);
    const cast = data.cast;
    console.log(cast);
    castContainer.innerHTML = '';
    castContainer.scrollTo(0, 0);
    cast.forEach(actor => { 
        if (!actor.profile_path) {
            return;
        }
        const actorContainer = document.createElement('li');
        actorContainer.classList.add('actor-container');
        const actorImg = document.createElement('img');
        actorImg.classList.add('actor-img');
        actorImg.alt = `${actor.name} image`;
        actorImg.src = `https://www.themoviedb.org/t/p/w138_and_h175_face${actor.profile_path}`;
        const actorName = document.createElement('p');
        actorName.classList.add('actor-name');
        actorName.textContent = actor.name;
        const actorCharacter = document.createElement('p');
        actorCharacter.classList.add('actor-character');
        actorCharacter.textContent = actor.character;
        actorContainer.append(actorImg, actorName, actorCharacter);    
        castContainer.appendChild(actorContainer);
    })

    // movieDetailDirectorContainer.innerHTML = '';
    // directorData.forEach(director => {
    //     // const directorName = document.createTextNode(director.name)
        
    //     // movieDetailDirector.appendChild(directorName);
    //     const directorName = document.createElement('span');
    //     directorName.classList.add('movieDetail-director');
    //     directorName.textContent = director.name;
    //     movieDetailDirectorContainer.appendChild(directorName);
    // })

    // movieDetailDirector.textContent = director;
}

async function getTrailerMovie(id) {
    const { data } = await api(`movie/${id}/videos`);
    const videos = data.results;
    // console.log(videos);

    const trailer = videos.find(video => video.type === 'Trailer');
    if(videos.length < 1) {
        movieDetailTrailerContainer.classList.add('inactive');
    }

    movieDetailTrailer.src = `https://www.youtube.com/embed/${trailer.key}`

    
}