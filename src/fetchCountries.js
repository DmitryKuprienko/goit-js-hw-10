export default function fetchCountries(nameOfCountry) {
    const baseUrl = `https://restcountries.com/v2/name/${nameOfCountry}`;
    const filterUrl = `?fields=name,capital,population,flags,languages`;
    const url = baseUrl + filterUrl;

    return fetch(url).then(response => {
        if (!response.ok) {
            clearPreviousInfo();
            throw new Error(response.status);
        }
    
        return response.json()
    });
}