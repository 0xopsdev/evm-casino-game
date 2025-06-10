import CryptoJS from 'crypto-js';

// Function to hash the server key using CryptoJS
export function generateHash(key: string): string {
    return CryptoJS.SHA256(key).toString(CryptoJS.enc.Hex);
}

// Generate roulette outcome number based on hash and seeds
export const generateRouletteOutcome = (privateSeed: string, publicSeed: string) => {
    const hash = CryptoJS.HmacSHA256(privateSeed, publicSeed).toString();
    const maxNumber = 37;
    const rawNumber = parseInt(hash.slice(0, 8), 16) % maxNumber;
    return rawNumber;  // Returning raw number between 0-36
};


// Generate roulette outcome number based on hash and seeds
export const combineSeeds = (privateSeed: string, publicSeed: string) => {
    return CryptoJS.HmacSHA256(privateSeed, publicSeed).toString();
};
