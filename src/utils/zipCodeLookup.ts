// ZIP code to city/state mapping for common US ZIP codes
// This is a subset - in production, you'd use a complete database or API

interface ZipData {
  city: string;
  state: string;
}

const zipDatabase: Record<string, ZipData> = {
  // Major cities - Add more as needed
  '10001': { city: 'New York', state: 'NY' },
  '10002': { city: 'New York', state: 'NY' },
  '10003': { city: 'New York', state: 'NY' },
  '90001': { city: 'Los Angeles', state: 'CA' },
  '90002': { city: 'Los Angeles', state: 'CA' },
  '60601': { city: 'Chicago', state: 'IL' },
  '60602': { city: 'Chicago', state: 'IL' },
  '77001': { city: 'Houston', state: 'TX' },
  '77002': { city: 'Houston', state: 'TX' },
  '19101': { city: 'Philadelphia', state: 'PA' },
  '19102': { city: 'Philadelphia', state: 'PA' },
  '85001': { city: 'Phoenix', state: 'AZ' },
  '85002': { city: 'Phoenix', state: 'AZ' },
  '78701': { city: 'Austin', state: 'TX' },
  '78702': { city: 'Austin', state: 'TX' },
  '33101': { city: 'Miami', state: 'FL' },
  '33102': { city: 'Miami', state: 'FL' },
  '94101': { city: 'San Francisco', state: 'CA' },
  '94102': { city: 'San Francisco', state: 'CA' },
  '98101': { city: 'Seattle', state: 'WA' },
  '98102': { city: 'Seattle', state: 'WA' },
  '02101': { city: 'Boston', state: 'MA' },
  '02102': { city: 'Boston', state: 'MA' },
  '30301': { city: 'Atlanta', state: 'GA' },
  '30302': { city: 'Atlanta', state: 'GA' },
  '80201': { city: 'Denver', state: 'CO' },
  '80202': { city: 'Denver', state: 'CO' },
  '89101': { city: 'Las Vegas', state: 'NV' },
  '89102': { city: 'Las Vegas', state: 'NV' },
};

// Fallback: Derive state from ZIP code prefix (first digit)
const zipPrefixToState: Record<string, string[]> = {
  '0': ['CT', 'MA', 'ME', 'NH', 'NJ', 'RI', 'VT'],
  '1': ['DE', 'NY', 'PA'],
  '2': ['DC', 'MD', 'NC', 'SC', 'VA', 'WV'],
  '3': ['AL', 'FL', 'GA', 'MS', 'TN'],
  '4': ['IN', 'KY', 'MI', 'OH'],
  '5': ['IA', 'MN', 'MT', 'ND', 'SD', 'WI'],
  '6': ['IL', 'KS', 'MO', 'NE'],
  '7': ['AR', 'LA', 'OK', 'TX'],
  '8': ['AZ', 'CO', 'ID', 'NM', 'NV', 'UT', 'WY'],
  '9': ['AK', 'CA', 'HI', 'OR', 'WA'],
};

export const lookupZipCode = (zip: string): ZipData | null => {
  if (zip.length !== 5) return null;
  
  // Try exact match first
  if (zipDatabase[zip]) {
    return zipDatabase[zip];
  }
  
  // Return null - we don't want to guess city names
  // But we could suggest state based on prefix
  return null;
};

export const suggestStateFromZip = (zip: string): string | null => {
  if (zip.length < 1) return null;
  
  const firstDigit = zip[0];
  const possibleStates = zipPrefixToState[firstDigit];
  
  // If only one state matches this prefix, return it
  if (possibleStates && possibleStates.length === 1) {
    return possibleStates[0];
  }
  
  return null;
};

// API-based lookup (you can integrate with a real ZIP code API)
export const lookupZipCodeAPI = async (zip: string): Promise<ZipData | null> => {
  // In production, integrate with services like:
  // - USPS API
  // - Ziptastic API
  
  // For now, use local lookup
  return lookupZipCode(zip);
};
