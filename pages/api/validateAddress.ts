
export const validateAddress = async (address: string) => {
  const parisCoords = {
    lat: 48.8566,
    lon: 2.3522,
  };

  // Utiliser l'API adresse.data.gouv.fr pour obtenir les coordonnées de l'adresse
  const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}`);
  const data = await response.json();

  if (data.features && data.features.length > 0) {
    const userCoords = data.features[0].geometry.coordinates;
    const userLat = userCoords[1];
    const userLon = userCoords[0];

    // Calculer la distance entre les coordonnées de Paris et celles de l'utilisateur
    const distance = getDistanceFromLatLonInKm(parisCoords.lat, parisCoords.lon, userLat, userLon);
    return distance <= 50; // Vérifiez si la distance est inférieure ou égale à 50 km
  }

  return false; // Adresse non trouvée
};

// Fonction pour calculer la distance
const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Rayon de la Terre en kilomètres
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance en kilomètres
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};
