const fields = 'name,capital,population,flags,languages';

function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=${fields}`
  ).then(response => {
    if (!response.ok) {
      throw Error();
    }
    return response.json();
  });
}

export { fetchCountries };
