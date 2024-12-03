// Step 4 in the citation diversity statement generator
// Calculate gender stats

export function calculatePercentages(data) {
    let total = 0; // Total number of authors
    let countW = 0; // Count of "W"
    let countM = 0; // Count of "M"
    let countX = 0; // Count of "X"

    // Iterate through the data
    for (const reference of data) {
        for (const author of reference.authors) {
        total += 1; // Increment total for each author
        if (author === "W") countW += 1;
            else if (author === "M") countM += 1;
            else if (author === "X") countX += 1;
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
    let countWW = 0
    let countX = 0; 

    const result = [];

    // Iterate through the data
    for (const reference of data) {
        
        const firstAuthor = reference.authors[0];
        const lastAuthor = reference.authors[reference.authors.length - 1]; 

        const cat = firstAuthor + lastAuthor;
        result.push(cat);
    }

    total = result.length

    for (const ref of result) {
        if (ref === "MM") {
            countMM += 1; 
        } else if (ref === "MW") {
            countMW += 1;
        } else if (ref === "WM") {
            countWM += 1;
        } else if (ref === "WW") {
            countWW += 1;
        } else {
            countX += 1;
        }
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