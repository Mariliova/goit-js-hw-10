import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';

Notify.init({});

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;
const NOTIFY_INFO =
  'Too many matches found. Please enter a more specific name.';
const NOTIFY_FAILURE = 'Oops, there is no country with that name';

refs.searchBox.addEventListener(
  'input',
  debounce(onSearchBoxInput, DEBOUNCE_DELAY)
);

function onSearchBoxInput(e) {
  const name = e.target.value.trim();

  if (name === '') {
    resetPage();
    return;
  }

  fetchCountries(name)
    .then(markup)
    .catch(() => {
      Notify.failure(NOTIFY_FAILURE);
      resetPage();
    });
}

function markup(countries) {
  const numberOfCountries = countries.length;
  if (numberOfCountries > 10) {
    Notify.info(NOTIFY_INFO);
    return;
  }
  if (numberOfCountries <= 10 && numberOfCountries > 2) {
    renderListOfCountries(countries);
    return;
  }
  if (numberOfCountries === 1) {
    renderCountryInfo(countries);
  }
}

function renderListOfCountries(countries) {
  resetPage();
  const listOfCountries = countries
    .map(
      ({ name: { official: officialName }, flags: { svg: falg } }) =>
        `<li class="country-name"><img src="${falg}" alt="${officialName}" width="30" /><span>${officialName}</span></li>`
    )
    .join('');

  refs.countryList.innerHTML = listOfCountries;
}

function renderCountryInfo([
  {
    name: { official: officialName },
    capital,
    population,
    flags: { svg: falg },
    languages,
  },
]) {
  resetPage();
  const listOfLangs = Object.values(languages).join(', ');
  refs.countryInfo.innerHTML = `
  <div class="country-name country-name--highlight"><img src="${falg}" alt="${officialName}" width="50" /><span>${officialName}</span></div>
  <div><strong>Capital: </strong><span>${capital}</span></div>
  <div><strong>Population: </strong><span>${population}</span></div>
  <div><strong>Languages: </strong><span>${listOfLangs}</span></div>
  `;
}

function resetPage() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
