
import { Cite } from '@citation-js/core'
import '@citation-js/plugin-doi'
import '@citation-js/plugin-csl'
import '@citation-js/plugin-bibtex';


// Cite.async('https://doi.org/10.1073/pnas.1914221117').then(data => {
//   const bibliography = data.format('bibliography', {
//     format: 'text',
//     template: 'apa',
//     lang: 'en-US'
//   })
//   console.log(bibliography)
// })


Cite.async('https://doi.org/10.1073/pnas.1914221117').then(data => {
    const bibtex = data.format('bibtex'); // ← CHANGE THIS LINE
    console.log(bibtex);
  })
