# Font Files

To complete the Product Sans font integration, please add the following font files to this directory:

1. ProductSans-Regular.woff2
2. ProductSans-Regular.woff
3. ProductSans-Bold.woff2
4. ProductSans-Bold.woff

You can obtain these files from Google's official sources or use a font converter tool to convert TTF files to WOFF/WOFF2 format.

## Alternative Solution

If you don't have access to the Product Sans font files, you can use Google Fonts' "Product Sans" alternative called "Google Sans" or another similar font like "Poppins" by updating the globals.css file with a Google Fonts import:

```css
/* In globals.css */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

/* Then update the font-family references */
body {
  font-family: 'Poppins', sans-serif;
  /* rest of the styles */
}
```
