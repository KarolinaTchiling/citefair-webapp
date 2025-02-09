import React, { useState } from "react";

const RecommendedPapers = ({ data }) => {
  const [filter, setFilter] = useState("all");

  if (!data || !data.enrichedData || !data.enrichedData.length) {
    return <div>No recommended papers available.</div>;
  }

  const filterPapers = (papers) => {
    switch (filter) {
      case "man-man":
        return papers.filter(
          (paper) =>
            paper.authors[0]?.gender === "M" &&
            paper.authors[paper.authors.length - 1]?.gender === "M"
        );
      case "man-woman":
        return papers.filter(
          (paper) =>
            paper.authors[0]?.gender === "M" &&
            paper.authors[paper.authors.length - 1]?.gender === "W"
        );
      case "woman-man":
        return papers.filter(
          (paper) =>
            paper.authors[0]?.gender === "W" &&
            paper.authors[paper.authors.length - 1]?.gender === "M"
        );
      case "woman-woman":
        return papers.filter(
          (paper) =>
            paper.authors[0]?.gender === "W" &&
            paper.authors[paper.authors.length - 1]?.gender === "W"
        );
      case "women-included":
        return papers.filter((paper) =>
          paper.authors.some((author) => author.gender === "W")
        );
      case "women-superior-roles":
        return papers.filter(
          (paper) =>
            paper.authors[0]?.gender === "W" ||
            paper.authors[paper.authors.length - 1]?.gender === "W"
        );
      default:
        return papers;
    }
  };

  const filteredPapers = filterPapers(data.enrichedData);

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Recommended Papers</h1>
      <div className="mb-4">
        <label htmlFor="filter" className="block text-sm font-medium text-gray-700">
          Filter by Author Roles:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="all">All</option>
          <option value="man-man">First and Last Authors are Men</option>
          <option value="man-woman">First Author is a Man, Last Author is a Woman</option>
          <option value="woman-man">First Author is a Woman, Last Author is a Man</option>
          <option value="woman-woman">First and Last Authors are Women</option>
          <option value="women-included">Women Included (Anywhere)</option>
          <option value="women-superior-roles">Women in Superior Roles (First or Last Author)</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPapers.map((paper) => (
          <div
            key={paper.paperId}
            className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow"
          >
            <h2 className="text-lg font-semibold mb-2">{paper.title}</h2>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Citation Count:</strong> {paper.citationCount}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Publication Date:</strong> {paper.publicationDate || "N/A"}
            </p>
            <div className="mb-2">
              <strong>Authors:</strong>
              <ul className="list-disc list-inside">
                {paper.authors.map((author) => (
                  <li key={author.authorId} className="text-sm text-gray-700">
                    {author.name} {author.gender ? `(${author.gender})` : ""}
                  </li>
                ))}
              </ul>
            </div>
            <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View Paper
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedPapers;

