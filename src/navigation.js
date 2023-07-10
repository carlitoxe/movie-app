searchFormBtn.addEventListener('click', () => {
    location.hash = `search=${searchFormInput.value.trim()}`;
})

trendingBtn.addEventListener('click', () => {
    location.hash = 'trends';
})

arrowBtn.addEventListener('click', () => {
    //location.hash = 'home'
    history.back();
    smoothscroll();
})

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

function smoothscroll(){
    const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScroll > 0) {
         window.requestAnimationFrame(smoothscroll);
         window.scrollTo (0,currentScroll - (currentScroll/5));
    }
};

function navigator() {
    // console.log({ location });

    if (location.hash.startsWith('#trends')) {
        trendingPage();
    } else if (location.hash.startsWith('#search=')) {
        searchPage();
    } else if (location.hash.startsWith('#movie=')) {
        movieDetailsPage();
    } else if (location.hash.startsWith('#category=')) {
        categoriesPage();
    } else {
        homePage();
    }
    smoothscroll();
}

function homePage() {
    console.log('HOME!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    getTrendingMoviesPreview();
    getCategoriesPreview();
    smoothscroll();
}

function searchPage() {
    console.log('SEARCH!!');

    let x = window.matchMedia('(max-width: 768px)');

    if (x.matches) {
        headerTitle.classList.add('inactive');
        arrowBtn.classList.remove('inactive');
        searchForm.classList.remove('inactive');
    } else {
        arrowBtn.classList.add('inactive');
        searchForm.classList.remove('inactive');
        headerTitle.classList.remove('inactive');
    }
    
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    // headerCategoryTitle.classList.remove('inactive');

    searchQuery.classList.remove('inactive');
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    // [search, searchValue]
    const [ , query] = location.hash.split('=');
    getMoviesBySearch(decodeURI(query));
}

function trendingPage() {
    console.log('TRENDS!!');

    let x = window.matchMedia('(max-width: 768px)');

    if (x.matches) {
        headerTitle.classList.add('inactive');
        arrowBtn.classList.remove('inactive');
        searchForm.classList.add('inactive');
    } else {
        arrowBtn.classList.add('inactive');
        headerTitle.classList.remove('inactive');
        searchForm.classList.remove('inactive');
    }
    
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    headerCategoryTitle.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    searchQuery.classList.add('inactive');

    headerCategoryTitle.innerText = 'Trending'
    getTrendingMovies();
}

function movieDetailsPage() {
    console.log('MOVIE!!');

    let x = window.matchMedia('(max-width: 768px)');

    if (x.matches) {
        headerTitle.classList.add('inactive');
        arrowBtn.classList.remove('inactive');
        searchForm.classList.add('inactive');
        movieDetailPoster.classList.add('inactive');
    } else {
        arrowBtn.classList.add('inactive');
        headerTitle.classList.remove('inactive');
        searchForm.classList.remove('inactive');
    }

    headerSection.classList.add('header-container--long');
    // headerSection.style.background = '';
    headerCategoryTitle.classList.add('inactive');
    
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');
    searchQuery.classList.add('inactive');


    const [ , movieId] = location.hash.split('='); 

    // [movie, movieId]
    getMovieDetails(movieId);
}

function categoriesPage() {
    console.log('CATEGORIES!!');

    let x = window.matchMedia('(max-width: 768px)');

    if (x.matches) {
        headerTitle.classList.add('inactive');
        arrowBtn.classList.remove('inactive');
        searchForm.classList.add('inactive');
    } else {
        arrowBtn.classList.add('inactive');
        headerTitle.classList.remove('inactive');
        searchForm.classList.remove('inactive');
    }
    
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    headerCategoryTitle.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    searchQuery.classList.add('inactive');
    //['category', 'id-name']
    const [ , categoryData] = location.hash.split('='); 
    const [categoryId, categoryName] = categoryData.split('-');

    headerCategoryTitle.innerText = decodeURI(categoryName);

    getMoviesByCategory(categoryId);
}


