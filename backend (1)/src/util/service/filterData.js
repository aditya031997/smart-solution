const countriesWithStates = (countriesWithStates) =>{
    const filteredCountries = countriesWithStates.filter((country) => country.states.length > 0)

      // Map the result to the desired format
      const result = filteredCountries.map((country) => {
        return {
          country_id: country.id,
          country_name: country.name,
          createdAt: country.createdAt,
          updatedAt: country.updatedAt,
          states: country.states.map((state) => {
            return {
              state_name: state.name,
              cities: state.Cities.map((citys) => {
                return {
                  city_name: citys.name,
                };
              }),
            };
          })
        }
})
}
module.exports = countriesWithStates