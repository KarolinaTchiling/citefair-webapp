/**
 * STEP 4
 * 
 * These service calculates the gender statistics.
 * 
 * 
 */

export function calculatePercentages(data) {
    let total = 0, countW = 0, countM = 0, countX = 0;

    for (const paper of data) {
        if (paper.error) continue;
        if (paper.selfCitation) continue; // skip self citation
        for (const author of paper.authors) {
            total++;
            if (author.gender === "W") countW++;
            else if (author.gender === "M") countM++;
            else countX++;
        }
    }

    return {
        W: `${((countW / total) * 100).toFixed(2)}%`,
        M: `${((countM / total) * 100).toFixed(2)}%`,
        X: `${((countX / total) * 100).toFixed(2)}%`
    };
};
export function calculateCategories(data) {
    let total = 0, countMM = 0, countMW = 0, countWM = 0, countWW = 0, countX = 0;

    for (const paper of data) {
        if (paper.error) continue;
        if (paper.selfCitation) continue; // skip self citation
        const first = paper.authors[0]?.gender;
        const last = paper.authors[paper.authors.length - 1]?.gender;

        if (first === "M" && last === "M") countMM++;
        else if (first === "M" && last === "W") countMW++;
        else if (first === "W" && last === "M") countWM++;
        else if (first === "W" && last === "W") countWW++;
        else countX++;

        total++;
    }

    return { MM: `${((countMM / total) * 100).toFixed(2)}%`, MW: `${((countMW / total) * 100).toFixed(2)}%`, WM: `${((countWM / total) * 100).toFixed(2)}%`, WW: `${((countWW / total) * 100).toFixed(2)}%`, X: `${((countX / total) * 100).toFixed(2)}%` };
};