// DATA

const API_KEY = '123293c6c692ce641570f9a57a28a2fa'; 
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },      
    params: {
        'api_key': API_KEY,
        'language': localStorage.getItem("lang")
        ? localStorage.getItem("lang")
        : navigator.language[0] + navigator.language[1],
    }
})


// Change language

// let lang = navigator.language;

function createLanguages() {
    selectLanguageContainer.innerText = '';
    // selectLanguageContainerMobile.innerText = '';
    
    languagesArr.forEach(language => {
        // console.log(language);
        let optionLanguage = document.createElement('option');
        optionLanguage.name = language.english_name;
        optionLanguage.innerText = `${language.flag} ${language.name}`;
        optionLanguage.value = language.iso_639_1;
        optionLanguage.classList.add('optLang');
        
        selectLanguageContainer.append(optionLanguage);
        // selectLanguageContainerMobile.append(optionLanguage2);
    })
}
createLanguages();

async function getWords() {
	let langWords = localStorage.getItem('lang');
    let [langWord, ] = langWords.split('-');
    // console.log(langWord);
	const languageTexts = await fetch('./src/lang.json');
	const data = await languageTexts.json();
	return data[langWord];
}

async function setDefaultLang() {
    if (!localStorage.getItem("lang")) {
        if (navigator.language.includes("-")) {
            const navLang = navigator.language.split("-");
			localStorage.setItem("lang", navLang[0]);
		} else {
            localStorage.setItem("lang", navigator.language);
		}
	}
    if (!localStorage.getItem('lang')) {
        langu.value = navigator.language;
    } else {
        langu.value = localStorage.getItem('lang');  
    }
    // console.log(langu.value);
	const langWords = await getWords();
	trendingPreviewTitle.innerText = langWords["Trending"];
	trendingBtn.innerText = langWords["See More"];
	searchFormInput.placeholder = langWords["Search Here ..."];
	categoriesTitle.innerText = langWords["Categories"];
}
setDefaultLang();

document.addEventListener('click', (e) => {
    // console.log(e.target);
    // console.log(e.target.classList.contains('header-menu'));
    const target = e.target;
    if(!target.classList.contains('header-menu') && 
    !target.classList.contains('hamburger-button') && 
    !target.classList.contains('hamburger-menu') && 
    !target.classList.contains('select-language-container')
    ) {
        const sideMenu = document.querySelector('.header-menu');
        sideMenu.classList.remove('header-menu-open');
    }
});

hamburgerBtn.addEventListener('click', () => {
    const sideMenu = document.querySelector('.header-menu');
    const sideMenuIsOpen = sideMenu.classList.contains('header-menu-open');
    sideMenuIsOpen ? sideMenu.classList.remove('header-menu-open') : sideMenu.classList.add('header-menu-open');
});


selectLanguageContainer.addEventListener('change', changeLang)

// selectLanguageContainerMobile.addEventListener('change', changeLang)

function changeLang() {
    localStorage.setItem("lang", langu.value);
	location.reload();
}

function likedMoviesList() {
    const item = JSON.parse(localStorage.getItem('liked_movies'));   
    let movies;

    if (item) {
        movies = item;
    } else {
        movies = {};
    }

    return movies
}

function likeMovie(movie) {
    // console.log(likedMoviesList());

    const likedMovies = likedMoviesList();
    console.log(likedMovies);
    if (likedMovies[movie.id]) {
        console.log('Movie deleted from fav');
        likedMovies[movie.id] = undefined;
    } else {
        console.log('Movie added to favs');
        likedMovies[movie.id] = movie;
    }
    if (location.hash.startsWith('#home')){
        homePage();
      }

    localStorage.setItem('liked_movies', JSON.stringify(likedMovies));

}

searchFormInput.addEventListener('focusin', () => {
    searchForm.classList.add('search-form--focused')
})

searchFormInput.addEventListener('focusout', () => {
    searchForm.classList.remove('search-form--focused')
})

// Observer

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const img = entry.target;
        if (entry.isIntersecting) {
            // console.log(img);
            const url = img.dataset.src;
            if (url) img.src = url;
            observer.unobserve(img)
        } else {
            return
        }
    })
})

// Utils

async function createMovies(
    movies, 
    parentContainer, 
    { 
        lazyLoad = false, 
        clean = true 
    } = {},
) {

    if (clean) {
        parentContainer.innerHTML = '';
    }

    const toRender = [];
    movies.forEach(movie => {

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
   
            const movieImg = document.createElement('img');
            movieImg.classList.add('movie-img');
            observer.observe(movieImg);
            lazyLoad ? 
            movieImg.dataset.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}` :
            movieImg.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}` 
            if (movie.poster_path) movieContainer.appendChild(movieImg)
            else {
                movieImg.src = './src/assets/no-image.svg';
                movieImg.classList.add('no-image');
                movieContainer.prepend(movieImg);
            }
            movieImg.setAttribute('alt', `${movie.title} poster`)
            // console.log(movieImg);
            movieImg.addEventListener('error', () => {
                // console.log(movieImg);
                // const div = document.createElement('div');
                // if (parentContainer.className === 'relatedMovies-scrollContainer') {
                //     div.classList.add('relatedMovies-img-container--noimg');
                // }
                // div.classList.add('img-container--noimg');
                // const span = document.createElement('span');
                // span.textContent = movie.title;
                // div.append(span);
                // movieContainer.prepend(div);
                movieImg.src = './src/assets/no-image.svg';
                movieImg.classList.add('no-image');
                movieContainer.prepend(movieImg);
            });
            movieImg.addEventListener('click', () => {
                location.hash = `movie=${movie.id}`;
            });

            const likeMovieBtn = document.createElement('button');
            likeMovieBtn.classList.add('movie-button');
            // likeMovieBtn.textContent = '🤍'
            
            likedMoviesList()[movie.id] && likeMovieBtn.classList.add('movie-button--liked');
            likeMovieBtn.addEventListener('click', () => {
                likeMovieBtn.classList.toggle('movie-button--liked');
                //ADD MOVIE TO LOCALSTORAGE
                likeMovie(movie);
                getLikedMovies();
            });
            movieContainer.appendChild(likeMovieBtn);
            // DIV FOR NO IMG 
            // const div = document.createElement('div');
            // div.classList.add('img-container--noimg');
            // const span = document.createElement('span');
            // span.textContent = movie.title;
            // div.append(span);
            // movieContainer.append(div);
        
        
        const movieScore = document.createElement('span');
        movieScore.classList.add('movie-score');
        movieScore.textContent = movie.vote_average.toFixed(1);
        
        const movieTitle = document.createElement('a');
        movieTitle.classList.add('movie-title');
        movieTitle.textContent = movie.title;
        
        movieTitle.addEventListener('click', () => {
            location.hash = `movie=${movie.id}`;
        });
        
        movieContainer.append(movieScore, movieTitle);
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

    createMovies(movies, trendingMovieListContainer, { lazyLoad: true });
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
    maxPage = data.total_pages;
    // console.log(maxPage);
    createMovies(movies, genericSection, { lazyLoad: true })
}

async function getMoreMoviesByCategory() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 20)
    console.log(scrollIsBottom);
    if (scrollIsBottom) {
        const id = location.hash.split('=')[1].split('-')[0];
        page++;
        const { data } = await api('discover/movie', {
            params: {
                with_genres: id,
                page,
            }
        });
        const movies = data.results;
        console.log(data);
        console.log(movies);
        createMovies(movies, genericSection, { lazyLoad: true, clean: false });
        // genericSection.appendChild(btnLoadMore);
    }

    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.textContent = 'Load more';
    // btnLoadMore.addEventListener('click', getMoreTrendingMovies);
    // genericSection.appendChild(btnLoadMore);

}

async function getMoviesBySearch(query) { 

    const { data } = await api('search/movie', {
        params: {
            query,
        }
    });

    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage);
    // console.log(movies);
    createMovies(movies, genericSection, { lazyLoad: true })
    if (movies.length < 1) {
        searchQuery.innerHTML = '';
        searchQuery.textContent = `Nothing found for: ${query}. Try again with another name.`;
    } else {
        searchQuery.textContent = `Results for: ${query}`
    }

}

async function getMoreMoviesBySearch(query) {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
    // console.log(scrollIsBottom);
    const pageIsNotMax = page < maxPage;
    if (scrollIsBottom && pageIsNotMax) {
        // const query = location.hash.split('=')[1];
        // console.log(query);
        page++;
        const { data } = await api('search/movie', {
            params: {
                query,
                page,
            }
        });
        const movies = data.results;
        console.log(page);
        // console.log(data);
        // console.log(movies);
        createMovies(movies, genericSection, { lazyLoad: true, clean: false });
        // genericSection.appendChild(btnLoadMore);
    }

    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.textContent = 'Load more';
    // btnLoadMore.addEventListener('click', getMoreTrendingMovies);
    // genericSection.appendChild(btnLoadMore);

}


// const btnLoadMore = document.createElement('button');
// btnLoadMore.textContent = 'Load more';

async function getTrendingMovies() { 
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage);
    
    createMovies(movies, genericSection, { lazyLoad: true, clean: true });
    // getMoreTrendingMovies(page);

    // const observer = new IntersectionObserver((entries) => {
    //     // Callback to be fired
    //     entries.forEach((entry) => {
    //       // Only add to list if element is coming into view not leaving
    //       if (entry.isIntersecting) {
    //         page++;
    //         getMoreTrendingMovies(page);
    //       }
    //     });
    //   });
      
    //   const footer = document.querySelector('.footer');
    //   observer.observe(footer);
    // let page = 1;
    // btnLoadMore.addEventListener('click', () => {
    //     page++
    //     // console.log(page);
    //     getMoreTrendingMovies(page)
    //     genericSection.removeChild(btnLoadMore);

    // });
    // genericSection.appendChild(btnLoadMore);
}

async function getMoreTrendingMovies() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 20)
    // console.log(scrollIsBottom);
    const pageIsNotMax = page < maxPage;
    if (scrollIsBottom && pageIsNotMax) {
        page++;
        const { data } = await api('trending/movie/day', {
            params: {
                page,
            }
        });
        const movies = data.results;
        console.log(movies);
        createMovies(movies, genericSection, { lazyLoad: true, clean: false });
        // genericSection.appendChild(btnLoadMore);
    }

    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.textContent = 'Load more';
    // btnLoadMore.addEventListener('click', getMoreTrendingMovies);
    // genericSection.appendChild(btnLoadMore);

}

async function getMovieDetails(id) { 
    const { data: movie } = await api(`movie/${id}`);

    // const loading = document.querySelector('.movieDetail-poster--loading');
    // loading.classList.add('inactive');
    // movieDetailSection.innerHTML = '';
    movieDetailPosterContainer.innerHTML = '';
    const langWords = await getWords();
    movieDetailCastTitle.innerText = langWords["Cast"];
    movieDetailTrailerTitle.innerText = langWords["Trailer"];
    relatedMoviesTitle.innerText = langWords['Recommendations']
    const movieDetailPoster = document.createElement('img');
    movieDetailPoster.id = 'movieDetail-poster';
    movieDetailPoster.classList.add('movie-img');
    // movieDetailPosterContainer.append(movieDetailPoster);
    movieDetailTitle.textContent = movie.title;
    movieDetailTitle.href = location.href;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average.toFixed(1);

    observer.observe(movieDetailPoster);
    if (movie.poster_path) {
        movieDetailPoster.dataset.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
    } else {
        movieDetailPoster.classList.add('no-image')
        movieDetailPoster.src = './src/assets/no-image.svg'; 
    }
    movieDetailPosterContainer.append(movieDetailPoster);
    
        // console.log(movieDetailPoster);
    
/*     movieDetailPoster.addEventListener('error', () => {
 
        // const div = document.createElement('div');
        // if (parentContainer.className === 'relatedMovies-scrollContainer') {
        //     div.classList.add('relatedMovies-img-container--noimg');
        // }
        // div.classList.add('img-container--noimg');
        // const span = document.createElement('span');
        // span.textContent = movie.title;
        // div.append(span);
        // movieContainer.prepend(div);
        movieDetailPoster.src = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
        movieDetailPosterContainer.append(movieDetailPoster);
    }); */


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
    
    // movieDetailSection.append(movieDetailPoster);

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
    // console.log(cast);
    if (cast.length < 1) {
        castContainerArticle.classList.add('inactive');
    }
    castContainer.innerHTML = '';
    castContainer.scrollTo(0, 0);
    cast.forEach(actor => { 
        
        const actorContainer = document.createElement('li');
        actorContainer.classList.add('actor-container');
        const actorImg = document.createElement('img');
        actorImg.classList.add('actor-img');
        actorImg.alt = `${actor.name} image`;
  
        observer.observe(actorImg);

        if (actor.profile_path) {
            actorImg.dataset.src = `https://www.themoviedb.org/t/p/w138_and_h175_face${actor.profile_path}`;
            actorContainer.appendChild(actorImg)  
        } else {
            actorImg.src = './src/assets/no-image.svg';
            actorImg.classList.add('no-image');
            actorContainer.prepend(actorImg);
        }
        
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
    console.log(videos);

    
    const officialTrailer = videos.find(video => video.type === 'Trailer' && video.official);
    const trailer = videos.find(video => video.type === 'Trailer');
    // console.log(trailer);
    if(officialTrailer) {
        movieDetailTrailer.src = `https://www.youtube.com/embed/${officialTrailer.key}`
    } else if (trailer) {
        movieDetailTrailer.src = `https://www.youtube.com/embed/${trailer.key}`
    } else {
        movieDetailTrailerContainer.classList.add('inactive');
    }

    
    
}

function getLikedMovies() {
    const likedMovies = likedMoviesList();

    const moviesArray = Object.values(likedMovies);

    createMovies(moviesArray, likedMoviesListArticle, { lazyLoad: true, clean: true });

    if (moviesArray.length > 0) {
        if (location.hash === '') {
            likedMoviesSection.classList.remove('inactive'); 
        }
    } else {
        likedMoviesSection.classList.add('inactive');
    }
    // console.log(moviesArray.length);
    // window.addEventListener('storage', () => {
    //     createMovies(moviesArray, likedMoviesListArticle, { lazyLoad: true, clean: true });

    // });
    // console.log(moviesArray);
}
