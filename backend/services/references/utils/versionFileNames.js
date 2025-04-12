/**
 * Helper function to rename the file with versions. 
 */

export const getVersionedFileName = (originalName) => {
    let name = originalName.replace(/\.(bib|txt)$/i, "");
    name = name.replace(/_(bib|txt)$/i, "");
    name = name.replace(/_(bib|txt)(?=_v\d+|$)/i, "");
  
    const versionRegex = /_v(\d+)$/i;
    const match = name.match(versionRegex);
    name = match ? name.replace(versionRegex, `_v${parseInt(match[1], 10) + 1}`) : `${name}_v1`;
  
    return `${name}.bib`;
  };
  