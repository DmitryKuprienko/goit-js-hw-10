import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  listCountries: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener(
  'input',
  debounce(searchCountry, DEBOUNCE_DELAY)
);

function searchCountry(event) {
  const searchingCountry = event.target.value.trim();

  clearPreviousInfo();

  if (searchingCountry === '') {
    return;
  }

  fetchCountries(searchingCountry)
    .then(country => {
      console.log(country);
      if (country.length > 10) {
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (country.length <= 10 && country.length >= 2) {
        return createMarkupForCountries(country);
      }
      if (country.length === 1) {
        return createCardForCountry(country);
      }
    })
    .catch(error => {
      return Notify.failure('Oops, there is no country with that name');
    });
}

function createMarkupForCountries(countriesArray) {
  const markup = countriesArray
    .map(({ flags, name }) => {
      return `
                <li class="country-list__item">
                    <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name}" width = 100px height = 50px>
                    <p class="country-list__name">${name}</p>
                </li>
                `;
    })

    .join('');

  refs.listCountries.innerHTML = markup;
}

function createCardForCountry(countryArray) {
  const markup = countryArray
    .map(country => {
      const { flags, name, capital, population, languages } = country;

      return ` 
      <img class="country-info__flag" width="200px" height="150px" src='${
        flags.svg
      }'
      alt='${name} flag' />
        <ul class="country-info__list">
            <li class="country-info__item country-info__item--name"><p><b>Name: </b>${name}</p></li>
            <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
            <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
            <li class="country-info__item"><p><b>Languages: </b>${languages.map(
              lang => lang.name
            )}</p></li>
        </ul>`;
    })
    .join('');
  refs.countryInfo.innerHTML = markup;
}

function clearPreviousInfo() {
  refs.listCountries.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
