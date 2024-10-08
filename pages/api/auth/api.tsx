import axios from "axios";

// Define the type for address validation
const validateAddress = async (address: string): Promise<boolean> => {
  const response = await axios.get(
    `https://api-adresse.data.gouv.fr/search/?q=${address}&limit=1`
  );

  // Check if the response contains coordinates
  const location = response.data.features[0]?.geometry.coordinates;
  if (!location || location.length < 2) {
    throw new Error("Invalid address: coordinates not found.");
  }

  const [longitude, latitude]: [number, number] = location;

  // Coordinates of Paris
  const parisCoordinates: [number, number] = [2.3522, 48.8566];
  const distance = calculateDistance(parisCoordinates, [longitude, latitude]);

  return distance <= 50;
};

// Define the type for the calculateDistance parameters
const calculateDistance = (
  [lng1, lat1]: [number, number],
  [lng2, lat2]: [number, number]
): number => {
  const R = 6371; // Earth’s radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};
