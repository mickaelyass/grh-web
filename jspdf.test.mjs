// Verifie que l'usage de jspdf dans Monprofile.js survit au passage 2.5.2 -> 4.2.1.
// Les 3 API utilisees sont : new jsPDF(), doc.splitTextToSize(), doc.text(),
// doc.addPage(), doc.save() et doc.internal.pageSize.height.
// Usage : node jspdf.test.mjs
import { jsPDF } from 'jspdf'

let ko = 0
const check = (libelle, ok, detail = '') => {
  if (!ok) ko++
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${libelle} ${detail}`)
}

console.log('== jspdf 4.x : API utilisee par Monprofile.js ==')

// 1. Construction
let doc
try {
  doc = new jsPDF()
  check('new jsPDF()', !!doc)
} catch (e) {
  check('new jsPDF()', false, `-> ${e.message}`)
  process.exit(1)
}

// 2. Hauteur de page (utilisee pour la pagination manuelle)
const pageHeight = doc.internal.pageSize.height
check('doc.internal.pageSize.height', typeof pageHeight === 'number' && pageHeight > 0, `-> ${pageHeight}`)

// 3. Decoupe du texte
const split = doc.splitTextToSize('Ligne de test assez longue pour etre decoupee '.repeat(4), 160)
check('doc.splitTextToSize()', Array.isArray(split) && split.length > 0, `-> ${split.length} ligne(s)`)

// 4. Ecriture de texte
try {
  doc.text(10, 10, 'Ligne 1')
  check('doc.text()', true)
} catch (e) {
  check('doc.text()', false, `-> ${e.message}`)
}

// 5. Saut de page
try {
  doc.addPage()
  check('doc.addPage()', doc.getNumberOfPages() === 2, `-> ${doc.getNumberOfPages()} page(s)`)
} catch (e) {
  check('doc.addPage()', false, `-> ${e.message}`)
}

// 6. Sortie reelle : on genere le PDF en memoire (pas de fichier sur disque)
try {
  const out = doc.output('arraybuffer')
  check("doc.output('arraybuffer')", out.byteLength > 0, `-> ${out.byteLength} octets`)
  const entete = Buffer.from(out).subarray(0, 5).toString('latin1')
  check('entete %PDF valide', entete.startsWith('%PDF'), `-> ${JSON.stringify(entete)}`)
} catch (e) {
  check('generation du PDF', false, `-> ${e.message}`)
}

// 7. Compatibilite de l'import : l'ancien `import jsPDF from 'jspdf''
//    (default import) est-ce encore supporte en 4.x ?
try {
  const mod = await import('jspdf')
  check('export nomme { jsPDF }', typeof mod.jsPDF === 'function')
  check('export default present', !!mod.default, `-> ${typeof mod.default}`)
} catch (e) {
  check('import du module', false, `-> ${e.message}`)
}

console.log(ko === 0 ? '\n✅ jspdf 4.x COMPATIBLE (le code de Monprofile.js fonctionne)' : `\n❌ ${ko} ECHEC(S)`)
process.exit(ko === 0 ? 0 : 1)
