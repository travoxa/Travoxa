/**
 * Utility to fetch data from OpenStreetMap Overpass API
 */

export interface OSMPlace {
  name: string;
  lat: number;
  lon: number;
  type: string;
  osmId: string;
  category: string;
  tags: string[];
}

const categoryMap: { [key: string]: string } = {
  'Hill Station': 'node["place"~"town|village|hamlet"]',
  'Beach': 'node["natural"="beach"], node["leisure"="beach_resort"]',
  'Adventure': 'node["leisure"="nature_reserve"], node["landuse"="forest"]',
  'Pilgrimage': 'node["amenity"="place_of_worship"]',
  'Weekend Getaway': 'node["tourism"~"attraction|viewpoint|museum"]',
  'Budget Trip': 'node["tourism"~"attraction|viewpoint|camp_site"]',
};

export async function fetchPlacesFromOSM(
  lat: number,
  lon: number,
  category: string,
  radius: number = 50000 // 50km default
): Promise<OSMPlace[]> {
  const overpassQuery = categoryMap[category] || 'node["tourism"~"attraction|viewpoint"]';
  
  // Overpass QL query
  const query = `
    [out:json][timeout:25];
    (
      ${overpassQuery}(around:${radius}, ${lat}, ${lon});
    );
    out body;
    >;
    out skel qt;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!response.ok) {
      throw new Error(`OSM Overpass API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.elements
      .filter((el: any) => el.tags && el.tags.name)
      .map((el: any) => ({
        name: el.tags.name,
        lat: el.lat,
        lon: el.lon,
        type: el.type,
        osmId: `osm-${el.id}`,
        category: category,
        tags: Object.keys(el.tags),
      }));
  } catch (error) {
    console.error('Error fetching from OSM:', error);
    return [];
  }
}
