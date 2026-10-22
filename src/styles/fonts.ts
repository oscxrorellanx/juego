import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Fuentes locales (SIL Open Font License, obtenidas del paquete oficial @fontsource).
// Ver public/fonts/OFL-*.txt.
export const fontsReady = Promise.all([
  loadFont({
    family: 'Archivo Black',
    url: staticFile('fonts/ArchivoBlack-Regular.woff2'),
    weight: '400',
  }),
  loadFont({family: 'Inter', url: staticFile('fonts/Inter-500.woff2'), weight: '500'}),
  loadFont({family: 'Inter', url: staticFile('fonts/Inter-600.woff2'), weight: '600'}),
  loadFont({family: 'Inter', url: staticFile('fonts/Inter-800.woff2'), weight: '800'}),
]);
