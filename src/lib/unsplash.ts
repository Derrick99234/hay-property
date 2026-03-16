const HERO_IMAGES = [
  "https://pub-edd6261085894e2db893376ace3b663e.r2.dev/properties/harvest-grove-agro-estate-2/cb4ffce2-0529-48f9-987c-fc8e653c967c.jpg",
  "https://pub-edd6261085894e2db893376ace3b663e.r2.dev/properties/harvest-grove-agro-estate-2/dfe04288-bd1e-4444-b952-b1c96e965699.jpg",
  "https://pub-edd6261085894e2db893376ace3b663e.r2.dev/properties/harvest-grove-agro-estate-2/ee62d090-cff1-4d17-ab99-b789aa8b02ff.jpg",
  "https://pub-edd6261085894e2db893376ace3b663e.r2.dev/properties/harvest-grove-agro-estate/7451d8d9-a875-494d-91e8-60b5733cb224.jpg",
];

const PROPERTY_IMAGES = [
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1400&q=80",
];

const BLOG_IMAGES = [
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
];

const LAND_IMAGES = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80",
];

function seedToIndex(seed: string, size: number) {
  let acc = 0;
  for (let i = 0; i < seed.length; i++) acc = (acc + seed.charCodeAt(i) * (i + 1)) % 2147483647;
  return size <= 0 ? 0 : acc % size;
}

export function pickHeroImage(seed: string) {
  return HERO_IMAGES[seedToIndex(seed, HERO_IMAGES.length)];
}

export function pickPropertyImage(seed: string) {
  return PROPERTY_IMAGES[seedToIndex(seed, PROPERTY_IMAGES.length)];
}

export function pickBlogImage(seed: string) {
  return BLOG_IMAGES[seedToIndex(seed, BLOG_IMAGES.length)];
}

export function pickLandImage(seed: string) {
  return LAND_IMAGES[seedToIndex(seed, LAND_IMAGES.length)];
}

