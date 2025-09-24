export const NellysBrand = {
  colors: {
    burgundy: '#853a3b',
    blue: '#002060',
    burgundyLight: '#a55c5d',
    burgundyDark: '#6a2e2f',
    blueLight: '#003099',
    blueDark: '#001947',
  },
  fonts: {
    primary: '"Amasis MT Pro", serif',
    script: '"Monotype Corsiva", cursive',
    fallback: 'Georgia, "Times New Roman", serif'
  },
  writing: {
    organizationName: 'Nelly\'s Needlers',
    informalName: 'Nellys',
    possessiveName: 'Nelly\'s',
    location: 'historic Woodlawn'
  }
} as const;

// React hook for brand styles
export const useBrandStyles = () => {
  return {
    text: {
      brand: { color: NellysBrand.colors.burgundy },
      secondary: { color: NellysBrand.colors.blue }
    },
    background: {
      brand: { backgroundColor: NellysBrand.colors.burgundy },
      secondary: { backgroundColor: NellysBrand.colors.blue }
    },
    border: {
      brand: { borderColor: NellysBrand.colors.burgundy },
      secondary: { borderColor: NellysBrand.colors.blue }
    }
  };
};