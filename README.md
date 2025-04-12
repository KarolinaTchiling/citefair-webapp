# CiteFairly

CiteFairly is a web-based research tool designed to help mitigate systemic biases in academic citation practices. It identifies imbalances in reference lists and supports the inclusion of works by scholars who are statistically under-cited across disciplines.

Researchers can:

📄 Upload .bib or .txt reference lists from academic manuscripts

📊 Analyze citation patterns by author categories and demographic metadata

🧾 Generate citation diversity statements to improve transparency in scholarly communication

🌐 Discover relevant, high-quality works by authors who are less frequently cited

💾 Edit and export revised, bias-aware reference lists in BibTeX format

**Goal: By encouraging citation practices grounded in fairness and representation, CiteFairly promotes a more equitable scholarly ecosystem at scale.**

### Live Web Tool

Check out the deployed version here: [citefairly.vercel.app](https://citefairly.vercel.app)

---

#### Quick Navigation

- [External Data Sources & Integrations](#external-data-sources--integrations)  
- [Technologies](#technologies)  
- [Architecture](#architecture)  
- [How to Run on Local Machine](#how-to-run-on-local-machine)  
- [References](#references)  

---

### External Data Sources & Integrations
CiteFairly relies on the following third-party APIs and libraries to enable citation analysis and metadata enrichment:

- [OpenAlex API](https://docs.openalex.org/how-to-use-the-api/api-overview): for open bibliometric metadata
- [Semantic Scholar Recommendations API](https://api.semanticscholar.org/api-docs/recommendations): to retrieve related articles
- [Semantic Scholar Academic Graph API](https://api.semanticscholar.org/api-docs/graphs):  for fallback BibTex citations
- [Gender-API](https://gender-api.com/en/api-docs/v2): to infer gender from author first names
- [Bibliography.js](https://github.com/digitalheir/bibliography-js#readme)Bibliography.js: for parsing and formatting .bib files
- [Citations.js](https://citation.js.org/): for generating BibTex citations

---

### Technologies 
- Frontend: Javascript React
- Backend: Express - Node.js
- Database: Firebase Realtime DB + Firebase Storage 

---

### Architecture
This application is built using domain-driven design and follows a pseudo–service-oriented architecture (SOA). While the backend currently adopts a modular monolith pattern, it is structured to reflect SOA principles — with each domain-specific service encapsulating its own logic, responsibilities, and routes.

All services — including the API Gateway — run within a single Node.js server and share a unified Firebase Realtime Database. Despite being part of a monolith, services are loosely coupled and communicate through RESTful interfaces, mimicking the separation and autonomy found in distributed microservices architectures.

Implementing a fully distributed SOA — where services are deployed independently on separate systems — is part of the application's future roadmap.

Authentication is handled on the frontend via Firebase Authentication, which issues JWT tokens upon login (supporting both anonymous and authenticated users).

The API Gateway serves as the middleware responsible for validating these tokens. Once verified, it decodes the token and attaches user metadata to the request object before routing it to the corresponding service.

---

## How to run on local machine:

Clone the repo on your local machine.

`git clone https://github.com/KarolinaTchiling/yu-circle.git`

**Run the Frontend**

Ensure the `.env` file is located in the root of the frontend directory.

```
cd frontend
npm install
npm run dev
```

**Run the Backend**

Ensure the `.env` and `serviceAccountKey.json` files are located in the root of backend directory.

```
cd backend
npm install
npm run dev
```

To see the API Endpoint Documentation go to: [API_ENDPOINTS.md](backend/docs/API_ENDPOINTS.md)

---
    
### References

Willighagen, L. G. (2019). Citation.js: a format-independent, modular bibliography tool for the browser and command line. PeerJ Computer Science, 5, e214. https://doi.org/10.7717/peerj-cs.214

Priem, J., Piwowar, H., & Orr, R. (2022). OpenAlex: A fully-open index of scholarly works, authors, venues, institutions, and concepts. ArXiv. https://arxiv.org/abs/2205.01833

Kinney, Rodney Michael et al. “The Semantic Scholar Open Data Platform.” ArXiv abs/2301.10140 (2023): n. pag.


