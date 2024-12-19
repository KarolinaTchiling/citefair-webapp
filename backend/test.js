import { generate } from './cds_generator/generate.js';
import { getTitles } from './recommendations/getTitles.js';

// const testUserId = "cDskJiR0hqRQea0UNu3zZEpQ6np2"; // Replace with a valid user ID for Firebase
// const testUserId = "O37o0MJa0OaSUoEAw7r4tX6GcFL2"
// generate(testUserId);

const filepath = "users/dXmI9q8FKwbfzAeJ1G6i66LuUIG3/uploads/ease-references.bib"
const data = await getTitles(filepath);
console.log(data);
