const fs = require('fs');
const path = require('path');

const filesToMock = [
  'accommodation.json',
  'auto-fare.json',
  'boating.json',
  'busRoutes.json',
  'cabServices.json',
  'cycling.json',
  'famous-places.json',
  'fire.json',
  'hospitals.json',
  'kayaking.json',
  'nightlife.json',
  'pharmacies.json',
  'police.json',
  'rentals.json',
  'shareAuto.json',
  'surfing.json',
  'transport.json',
  'trekking.json'
];

const mockItem = (category) => ({
  id: `${category}-mock-1`,
  name: `Sample ${category.replace('.json', '').replace('-', ' ')}`,
  image: "https://images.unsplash.com/photo-1596395819057-e37f55a8516b?w=800&q=80",
  description: {
    specialFeatures: `This is a sample entry for ${category.replace('.json', '')}. More details will be added soon.`
  },
  opening: "9:00 AM - 6:00 PM",
  entryFee: "Free",
  rating: 4.5,
  mapUrl: "https://maps.google.com/?q=Puducherry"
});

filesToMock.forEach(file => {
  const filePath = path.join(__dirname, 'src', 'data', file);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!Array.isArray(data) || data.length === 0 || Object.keys(data).length === 0) {
      console.log(`Mocking data for ${file}...`);
      fs.writeFileSync(filePath, JSON.stringify([mockItem(file), { ...mockItem(file), id: `${file}-mock-2`, name: `Another ${file.replace('.json', '')}` }], null, 2));
    }
  } else {
    console.log(`Creating mocked ${file}...`);
    fs.writeFileSync(filePath, JSON.stringify([mockItem(file), { ...mockItem(file), id: `${file}-mock-2`, name: `Another ${file.replace('.json', '')}` }], null, 2));
  }
});
console.log('Done!');
