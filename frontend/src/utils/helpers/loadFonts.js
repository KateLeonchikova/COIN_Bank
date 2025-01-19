import WorkSansMedium from '../../assets/fonts/WorkSansMedium.woff2';
import WorkSansBold from '../../assets/fonts/WorkSansBold.woff2';

export async function loadFonts() {
  try {
    const fonts = [
      new FontFace('WorkSansMedium', `url(${WorkSansMedium})`),
      new FontFace('WorkSansBold', `url(${WorkSansBold})`),
    ];

    await Promise.all(
      fonts.map((font) => font.load().then((f) => document.fonts.add(f)))
    );
    console.log('All fonts loaded');
  } catch (error) {
    console.error('Failed to load fonts:', error);
  }
}
