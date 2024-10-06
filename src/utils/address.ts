import axios from 'axios';

export async function validateAddress(address: string): Promise<boolean> {
    const response = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${address}`);
    if (response.data && response.data.features.length > 0) {
        const location = response.data.features[0].geometry.coordinates;
        const distanceToParis = calculateDistance(location[1], location[0], 48.8566, 2.3522); // Coordonnées de Paris
        return distanceToParis <= 50;
    }
    return false;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    // Formule de calcul de la distance en km
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
