import type { CountryCodeType } from "@/types"

export default function apiService() {
	return {
		get(limit: number, countryCode: CountryCodeType, searchInputValue: string) {
			return fetch(
				`https://fi1.api.radio-browser.info/json/stations/search?limit=${limit}&order=clickcount&reverse=true&hidebroken=true&countrycode=${countryCode}&name=${encodeURIComponent(searchInputValue)}`,
				{}
			)
		}
	}
}
