
// Настройки

const apiKey  = '5983c613-7dd2-46bc-a1e8-a594a6900583';

const url = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';
const options = {
    method: 'GET',
    headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
    },
};

// const btnTextDefault = 'Следующие 20 фильмов';
const btnTextGoUp = `
    <button class="get-back none">Вернуться наверх</button>

`;


// Dom элементы 

const filmWrapper = document.querySelector('.films');
const loader = document.querySelector('.loader-wrapper');
const btnLoadMore = document.querySelector('.show-more');
// const btnGetBack = document.querySelector('.get-back');
// console.log(btnGetBack);

let page = 1;

btnLoadMore.onclick = fetchAndRenderFilms;


//Получение и вывод ТОП фильмов

async function fetchAndRenderFilms(){      

    // show preloader

    loader.classList.remove('none');

  
    // fetch films data

    const data = await fetchData(url + `collections?page=${page}`, options);
   
    if(data.totalPages > 1) page++;


    // Проверка на дополнительные страницы и отображение кнопки

    if(data.totalPages > 1){
        // отобразить кнопку еще 20 фильмов
        btnLoadMore.classList.remove('none');


    }

    // hide preloader

    loader.classList.add('none');

    // render films

    renderFilms(data.items);

    // скрытие кнопки после последней страницы с фильмами

    if(page > data.totalPages) {
        btnLoadMore.classList.add('none');        
        // btnGetBack.classList.remove('none');
    };
    
}

async function fetchData(url, options){
    const response = await fetch(url, options);
    const data = await response.json();  
    return data;
}

function renderFilms(films){



    for(film of films){         
        const card = document.createElement('div');
        card.classList.add('card');

        //добавление ID фильма
        card.id = film.kinopoiskId;
        
        card.onclick = openFilmDetails;



        const html = `         
            <img src=${film.posterUrlPreview} class="card__img">
            <h3 class="card__title">${film.nameRu}</h3>
            <p class="card__year">${film.year}</p>
            <p class="card__rate">Рейтинг IMDB: ${film.ratingImdb}</p>        
        `
        card.insertAdjacentHTML('afterbegin', html);

        filmWrapper.insertAdjacentElement('beforeend', card);
    }

}

async function openFilmDetails(e){
    //получение id фильма в константу
    const id = e.currentTarget.id;
    //получаем данные по фильму
    const data = await fetchData(url + id, options);
    console.log(data);
    //отобразить детали фильма на странице
    renderFilmData(data);
}

function renderFilmData(film){

    // 0. Проверить, если фильм открыт, то удалить его

    if(document.querySelector('.container-right')) document.querySelector('.container-right').remove();

    //1. Render container right

    const containerRight = document.createElement('div');
    containerRight.classList.add('container-right');
    document.body.insertAdjacentElement('beforeend', containerRight);

    //2. Create close btn

    const closeBtn = document.createElement('button');
    closeBtn.classList.add('btn-close');
    closeBtn.innerHTML = '<img src="./img/cross.svg" alt="close" width="24">';
    containerRight.insertAdjacentElement('afterbegin', closeBtn);    

    // 2.1 Click on Close btn => remove all container
    closeBtn.onclick =  () => {containerRight.remove()};
    //3. Film
  
    const countries = film.countries;       
    let x = '';
    for(i = 0; i < countries.length; i++){
        let y = countries[i]['country']
        x += y;
        if(countries.indexOf(countries[i]) + 1 < countries.length) x += ', ';
    }

    const genres = film.genres;
    let z = '';
    for(i = 0; i < genres.length; i++){
        let y = genres[i]['genre'];
        z += y;
        if(genres.indexOf(genres[i]) + 1 < genres.length) z += ', ';
    }
    

    const html = `
        <div class="film">
            <div class="film__title">${film.nameRu}</div>
            <div class="film__img">
                <img src=${film.posterUrl} alt="cover">
            </div>
            <div class="film__desc">
                <p class="film__details"><span>год</span>: ${film.startYear}</p>
                <p class="film__details"><span>рейтинг IMDB</span>: ${film.ratingImdb}</p>
                <p class="film__details"><span>рейтинг КП</span>: ${film.ratingKinopoisk}</p>
                <p class="film__details"><span>жанр</span>: ${z}</p>
                <p class="film__details"><span>продолжительность</span>: ${formatFilmLength(film.filmLength)}</p>
                <p class="film__details"><span>страна</span>: ${x}</p>
                <p class="film__text"><span>описание фильма</span>: ${film.description}

        </div>  
    `
    containerRight.insertAdjacentHTML("beforeend", html);

}

function formatFilmLength(value) {
    let length = '';
    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    if (hours > 0){
        length += hours + ' ч. ';
    }

    if (minutes > 0){
        length += minutes + ' мин.';
    }
    console.log(length);
    return length;
}

function getCountries(value){
    let countriesInString = '';



}

fetchAndRenderFilms().catch((err) => console.log(err));





