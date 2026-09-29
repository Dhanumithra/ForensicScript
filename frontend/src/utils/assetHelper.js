// Eagerly resolve character sprites and background images via Vite import.meta.glob
const characterSprites = import.meta.glob('../assets/characters/*.png', { eager: true });
const backgrounds = import.meta.glob('../assets/backgrounds/*.{jpeg,jpg,png}', { eager: true });

export const getCharacterSprite = (name) => {
  if (!name) return null;
  const cleanName = name.replace(/\.png$/, '');
  const key = `../assets/characters/${cleanName}.png`;
  
  if (characterSprites[key]?.default) {
    return characterSprites[key].default;
  }
  // Public fallback
  return `/assets/characters/${cleanName}.png`;
};

export const getBackground = (name) => {
  if (!name) return '';
  const cleanName = name.replace(/\.(jpeg|jpg|png)$/, '');
  
  const jpegKey = `../assets/backgrounds/${cleanName}.jpeg`;
  const pngKey = `../assets/backgrounds/${cleanName}.png`;
  const jpgKey = `../assets/backgrounds/${cleanName}.jpg`;

  if (backgrounds[jpegKey]?.default) return backgrounds[jpegKey].default;
  if (backgrounds[pngKey]?.default) return backgrounds[pngKey].default;
  if (backgrounds[jpgKey]?.default) return backgrounds[jpgKey].default;

  // Public fallback
  return `/assets/backgrounds/${cleanName}.jpeg`;
};
