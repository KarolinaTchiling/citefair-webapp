

export async function extractNames(parsedData) {
    return data.map((entry) => {
      return {
        key: entry.key, // Extract the key as a string
        authors$: entry.authors?.authors$ || [], // Extract authors$ array or return an empty array if missing
      };
    });
  };

