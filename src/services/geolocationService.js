/**
 * Geolocation Service
 * 
 * Uses Google Geocoding API to detect user's country from coordinates
 * and browser's Geolocation API to get user's position.
 * 
 * Required ENV variable: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
 */

import { COUNTRIES, getCountryByCode } from '@/data/countries'

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

// Storage keys
const STORAGE_KEYS = {
  COUNTRY_CODE: 'userCountryCode',
  COUNTRY_DATA: 'userCountryData',
  LOCATION_TIMESTAMP: 'locationTimestamp',
}

// Cache duration (24 hours in milliseconds)
const CACHE_DURATION = 24 * 60 * 60 * 1000

/**
 * Get user's current position using browser's Geolocation API
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        let errorMessage = 'Unable to get your location'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
        }
        reject(new Error(errorMessage))
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 600000, // 10 minutes
      }
    )
  })
}

/**
 * Get country from coordinates using Google Geocoding API
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<{countryCode: string, countryName: string}>}
 */
export const getCountryFromCoordinates = async (latitude, longitude) => {
  if (!GOOGLE_API_KEY) {
    console.warn('Google Maps API key not configured. Using fallback.')
    return getFallbackCountry()
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}&result_type=country`
    )

    if (!response.ok) {
      throw new Error('Geocoding API request failed')
    }

    const data = await response.json()

    if (data.status === 'OK' && data.results.length > 0) {
      const countryComponent = data.results[0].address_components.find(
        (component) => component.types.includes('country')
      )

      if (countryComponent) {
        return {
          countryCode: countryComponent.short_name,
          countryName: countryComponent.long_name,
        }
      }
    }

    throw new Error('Could not determine country from location')
  } catch (error) {
    console.error('Geocoding error:', error)
    return getFallbackCountry()
  }
}

/**
 * Alternative: Get country using IP-based geolocation (free, no API key needed)
 * Uses ipapi.co free tier (1000 requests/day)
 * @returns {Promise<{countryCode: string, countryName: string, currency: string}>}
 */
export const getCountryFromIP = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/')
    
    if (!response.ok) {
      throw new Error('IP geolocation failed')
    }

    const data = await response.json()

    if (data.country_code) {
      return {
        countryCode: data.country_code,
        countryName: data.country_name,
        currency: data.currency,
        city: data.city,
        region: data.region,
      }
    }

    throw new Error('Could not determine country from IP')
  } catch (error) {
    console.error('IP geolocation error:', error)
    return getFallbackCountry()
  }
}

/**
 * Fallback country (India as default)
 */
export const getFallbackCountry = () => {
  return {
    countryCode: 'IN',
    countryName: 'India',
    currency: 'INR',
  }
}

/**
 * Get cached country data from localStorage
 * @returns {object|null}
 */
export const getCachedCountry = () => {
  if (typeof window === 'undefined') return null

  try {
    const timestamp = localStorage.getItem(STORAGE_KEYS.LOCATION_TIMESTAMP)
    const countryData = localStorage.getItem(STORAGE_KEYS.COUNTRY_DATA)

    if (!timestamp || !countryData) return null

    // Check if cache is still valid
    if (Date.now() - parseInt(timestamp) > CACHE_DURATION) {
      // Cache expired
      clearCachedCountry()
      return null
    }

    return JSON.parse(countryData)
  } catch (error) {
    return null
  }
}

/**
 * Save country data to localStorage
 * @param {object} countryData 
 */
export const setCachedCountry = (countryData) => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEYS.COUNTRY_DATA, JSON.stringify(countryData))
    localStorage.setItem(STORAGE_KEYS.LOCATION_TIMESTAMP, Date.now().toString())
    localStorage.setItem(STORAGE_KEYS.COUNTRY_CODE, countryData.countryCode)
    // Also store with 'userCountry' key for payment gateway routing compatibility
    localStorage.setItem('userCountry', countryData.countryCode)
  } catch (error) {
    console.error('Failed to cache country data:', error)
  }
}

/**
 * Clear cached country data
 */
export const clearCachedCountry = () => {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEYS.COUNTRY_DATA)
    localStorage.removeItem(STORAGE_KEYS.LOCATION_TIMESTAMP)
    localStorage.removeItem(STORAGE_KEYS.COUNTRY_CODE)
  } catch (error) {
    console.error('Failed to clear cached country:', error)
  }
}

/**
 * Main function: Detect user's country
 * Priority:
 * 1. Cached data (if valid)
 * 2. Browser Geolocation + Google Geocoding
 * 3. IP-based geolocation (fallback)
 * 4. Default country (India)
 * 
 * @param {boolean} forceRefresh - Force refresh even if cached
 * @param {boolean} useGoogleGeo - Use Google Geocoding (requires permission)
 * @returns {Promise<object>}
 */
export const detectUserCountry = async (forceRefresh = false, useGoogleGeo = false) => {
  // Check cache first
  if (!forceRefresh) {
    const cached = getCachedCountry()
    if (cached) {
      return {
        ...cached,
        ...getCountryByCode(cached.countryCode),
        fromCache: true,
      }
    }
  }

  try {
    let countryInfo

    if (useGoogleGeo && GOOGLE_API_KEY) {
      // Try browser geolocation + Google Geocoding
      try {
        const position = await getCurrentPosition()
        countryInfo = await getCountryFromCoordinates(position.latitude, position.longitude)
      } catch (geoError) {
        console.warn('Browser geolocation failed, falling back to IP:', geoError.message)
        countryInfo = await getCountryFromIP()
      }
    } else {
      // Use IP-based geolocation (no permission needed)
      countryInfo = await getCountryFromIP()
    }

    // Get full country data
    const fullCountryData = getCountryByCode(countryInfo.countryCode)
    
    const result = {
      countryCode: countryInfo.countryCode,
      countryName: countryInfo.countryName || fullCountryData?.name,
      currency: countryInfo.currency || fullCountryData?.currency,
      currencySymbol: fullCountryData?.currencySymbol || countryInfo.currency,
      flag: fullCountryData?.flag || '🏳️',
      fromCache: false,
    }

    // Cache the result
    setCachedCountry(result)

    return result
  } catch (error) {
    console.error('Country detection failed:', error)
    const fallback = getFallbackCountry()
    const fullFallbackData = getCountryByCode(fallback.countryCode)
    return {
      ...fallback,
      ...fullFallbackData,
      fromCache: false,
      error: error.message,
    }
  }
}

/**
 * Request location permission explicitly
 * @returns {Promise<boolean>}
 */
export const requestLocationPermission = async () => {
  try {
    const position = await getCurrentPosition()
    return !!position
  } catch (error) {
    return false
  }
}

/**
 * Check if location permission is granted
 * @returns {Promise<'granted'|'denied'|'prompt'>}
 */
export const checkLocationPermission = async () => {
  if (!navigator.permissions) {
    return 'prompt'
  }

  try {
    const result = await navigator.permissions.query({ name: 'geolocation' })
    return result.state
  } catch (error) {
    return 'prompt'
  }
}

/**
 * Get price for user's country from pricing array
 * @param {Array} countryPricing - Array of country pricing objects
 * @param {string} userCountryCode - User's country code
 * @param {number} defaultPrice - Default price if country not found
 * @param {string} defaultCurrency - Default currency
 * @returns {object}
 */
export const getPriceForCountry = (countryPricing = [], userCountryCode, defaultPrice = 0, defaultCurrency = 'INR') => {
  // Find pricing for user's country
  const countryPrice = countryPricing.find(
    (cp) => cp.countryCode === userCountryCode && cp.isActive
  )

  if (countryPrice) {
    const countryData = getCountryByCode(countryPrice.countryCode)
    return {
      price: countryPrice.price,
      currency: countryPrice.currency,
      currencySymbol: countryData?.currencySymbol || countryPrice.currency,
      countryCode: countryPrice.countryCode,
      found: true,
    }
  }

  // Return default price
  const defaultCountryData = getCountryByCode('IN')
  return {
    price: defaultPrice,
    currency: defaultCurrency,
    currencySymbol: defaultCountryData?.currencySymbol || '₹',
    countryCode: 'IN',
    found: false,
  }
}

export default {
  detectUserCountry,
  getCurrentPosition,
  getCountryFromCoordinates,
  getCountryFromIP,
  getCachedCountry,
  setCachedCountry,
  clearCachedCountry,
  requestLocationPermission,
  checkLocationPermission,
  getPriceForCountry,
  getFallbackCountry,
}
