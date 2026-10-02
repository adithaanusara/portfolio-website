// Drop your CV into src/assets/resume/ as a .pdf (any filename) and the
// "download résumé" button appears automatically. With no PDF there, the
// button stays hidden so the site never links to a missing file.
const files = import.meta.glob('../assets/resume/*.pdf', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const resumeUrl = Object.values(files)[0] ?? null
export const resumeFileName = 'Aditha-Anusara-CV.pdf'
