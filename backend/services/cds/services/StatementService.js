import { db } from "../../../utils/firebaseConfig.js";

export const generateStatements = async (fileName, userId) => {
  let data;
  try {
    // Use the Realtime Database API to get the data snapshot
    const dataRef = db.ref(`users/${userId}/data/${fileName}/processedBib`);
    const snapshot = await dataRef.once("value");
    data = snapshot.val();
    if (!data) {
      throw new Error("No data found at processedBib");
    }
  } catch (error) {
    console.error("Error retrieving field value:", error);
    throw error;
  }

  // Generate the various statements. Note: function names have been changed to avoid naming conflicts.
  const catStmt = generateCatStatement(data);
  const genderStmt = generateGenderStatement(data);
  const abbStmt = generateAbbStatement();
  const citations = generateStatementCitations();

  // Prepare the final processed data
  const cds = {
    catStatement: catStmt,
    genderStatement: genderStmt,
    abbStatement: abbStmt,
    citations: citations,
    processedAt: new Date().toISOString(),
  };

  // Save results to Realtime Database
  try {
    await db.ref(`users/${userId}/data/${fileName}/statements`).set(cds);
  } catch (error) {
    console.error("Error saving processedBib:", error);
    throw error;
  }

  return cds;
};


// Functions renamed to avoid conflicts with variable names
function generateCatStatement(data) {
  return `Several fields of science have identified a bias in citation practices, such that papers from women and other minority scholars are under-cited relative to the number of papers in the field [1], [2], [3]. Here, we acknowledge these biases and, in accordance with citation ethics [4], we sought to proactively consider references that reflect the diversity of the field. Based on a recognized classification framework, our references are categorized into four groups: MM (both the first and last authors are men), MW (the first author is a man, and the last author is a woman), WM (the first author is a woman, and the last author is a man), and WW (both the first and last authors are women). With respect to this classification scheme, our references (excluding self-citations) contain ${data.categories.MM} man/man, ${data.categories.MW} man/woman, ${data.categories.WM} woman/man, ${data.categories.WW} woman/woman, and ${data.categories.X} unknown gender authorship. The unknown category includes cases where either the first or last author's name was not successfully matched using the gender assignment tool. These gender classifications were performed using Gender-API, a database that stores the probability of a first name being assigned to a specific gender. However, this method has limitations in that: a) names, pronouns, and social media profiles used to construct the database may not always be indicative of gender identity, and b) it cannot account for intersex, non-binary, or transgender individuals.`;
}

function generateGenderStatement(data) {
  return `Several fields of science have identified a bias in citation practices, such that papers from women and other minority scholars are under-cited relative to the number of papers in the field [1], [2], [3]. Here, we acknowledge these biases and, in accordance with citation ethics [4], we sought to proactively consider references that reflect the diversity of the field. Considering all author contributions, our references (excluding self-citations) contain ${data.genders.M} male authors, ${data.genders.W} female authors, and ${data.genders.X} authors of unknown gender. Authors in the unknown category include all authors whom's name was not successfully matched using the gender assignment tool. These gender classifications were performed using Gender-API, a database that stores the probability of a first name being assigned to a specific gender. However, this method has limitations in that: a) names, pronouns, and social media profiles used to construct the database may not always be indicative of gender identity, and b) it cannot account for intersex, non-binary, or transgender individuals.`;
}

function generateAbbStatement() {
  return `Recent work in several fields of science has identified a bias in citation practices such that papers from women and other minority scholars are under-cited relative to the number of papers in the field. [1], [2], [3]. We acknowledge these biases and, in accordance with citation ethics [4], we sought to proactively consider references that reflect the diversity of the field.`;
}

function generateStatementCitations() {
  return {
    1: "Bertolero, M. A., Dworkin, J. D., David, S. U., Lloreda, C. L., Srivastava, P., Stiso, J., ... & Bassett, D. S. (2020). Racial and ethnic imbalance in neuroscience reference lists and intersections with gender. BioRxiv 2020-10",
    2: "Wang, X., J. D. Dworkin, D. Zhou, J. Stiso, E. B. Falk, D. S. Bassett, P. Zurn, and D. M. Lydon-Staley. 2021. “Gendered Citation Practices in the Field of Communication.” Annals of the International Communication Association 45 (2): 134–153. doi:10.1080/23808985.2021.1960180.",
    3: "Dion, M. L., Sumner, J. L., & Mitchell, S. M. (2018). Gendered citation patterns across political science and social science methodology fields. Political analysis, 26(3), 312-327",
    4: "Bruton, S. V., Macchione, A. L., Brown, M., & Hosseini, M. (2024). Citation Ethics: An Exploratory Survey of Norms and Behaviors. Journal of Academic Ethics, 1-18"
  };
}
