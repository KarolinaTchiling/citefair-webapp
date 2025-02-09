// Step 4 in the citation diversity statement generator
// Calculate gender stats

export function calculatePercentages(data) {
    let total = 0; // Total number of authors
    let countW = 0; // Count of "W"
    let countM = 0; // Count of "M"
    let countX = 0; // Count of "X"
    

    // Iterate through the data
    for (const paper of data) {

        if (paper.error) {
            continue;
        }

        for (const author of paper.authors) {
            total += 1; // Increment total for each author
            if (author.gender === "W") countW += 1;
            else if (author.gender === "M") countM += 1;
            else if (author.gender === "X") countX += 1;
        }
    }

    // Calculate percentages
    const percentageW = ((countW / total) * 100).toFixed(2);
    const percentageM = ((countM / total) * 100).toFixed(2);
    const percentageX = ((countX / total) * 100).toFixed(2);

    return {
        W: `${percentageW}%`,
        M: `${percentageM}%`,
        X: `${percentageX}%`,
    };
}

export function calculateCategories(data) {
    let total = 0; // Total number of refs
    let countMM = 0;
    let countMW = 0;
    let countWM = 0;
    let countWW = 0;
    let countX = 0;

    // Iterate through the data
    for (const paper of data) {

        if (paper.error) {
            continue;
        }

        const firstAuthor = paper.authors[0].gender;
        const lastAuthor = paper.authors[paper.authors.length - 1].gender;

        if (firstAuthor === "M" && lastAuthor === "M") countMM += 1;
        else if (firstAuthor === "M" && lastAuthor === "W") countMW += 1;
        else if (firstAuthor === "W" && lastAuthor === "M") countWM += 1;
        else if (firstAuthor === "W" && lastAuthor === "W") countWW += 1;
        else countX += 1;

        total += 1;
    }

    // Calculate percentages
    const percentageMM = ((countMM / total) * 100).toFixed(2);
    const percentageMW = ((countMW / total) * 100).toFixed(2);
    const percentageWM = ((countWM / total) * 100).toFixed(2);
    const percentageWW = ((countWW / total) * 100).toFixed(2);
    const percentageX = ((countX / total) * 100).toFixed(2);

    return {
        MM: `${percentageMM}%`,
        MW: `${percentageMW}%`,
        WM: `${percentageWM}%`,
        WW: `${percentageWW}%`,
        X: `${percentageX}%`,
    };
}


export function calculateMissing(data) {
    let missingCount = 0;
    let missingRef = []
    

    // Iterate through the data
    for (const paper of data) {

        if (paper.error) {
            missingCount +=1;
            missingRef.push(paper.title)
        }
    }

    return {
        count: missingCount,
        titles: missingRef,
    };
}