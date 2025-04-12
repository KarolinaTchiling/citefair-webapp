# CiteFair API – Endpoint Reference

This file lists all current API endpoints in the project, organized by module and route purpose. Authentication is required for protected routes via Firebase ID tokens (`Authorization: Bearer <token>`).

---

## Protected Endpoints

### 📂 `/file`

| Method | Endpoint           | Description                                                  | Auth Required |
|--------|--------------------|--------------------------------------------------------------|---------------|
| GET   | `/file/get-files`  | Fetches all user file names and Firebase Storage download URLs | ✅             |
| POST   | `/file/upload`     | Uploads a file to Firebase Storage                          | ✅             |
| DELETE | `/file/delete`     | Deletes a file from Firebase Storage and Realtime Database  | ✅             |

---

### 📂 `/user`

| Method | Endpoint       | Description                        | Auth Required |
|--------|----------------|------------------------------------|---------------|
| POST   | `/user/name`   | Retrieves first, middle, and last name of the user | ✅             |

---

### 📂 `/guest`

| Method | Endpoint              | Description                                                   | Auth Required |
|--------|-----------------------|---------------------------------------------------------------|---------------|
| POST   | `/guest/register`     | Registers a new guest user with first, middle, and last name  | ✅             |
| GET    | `/guest/is-guest`     | Checks if the current user is a guest                         | ✅             |
| POST   | `/guest/save`         | Upgrades a guest account to a permanent account (adds email & password) | ✅      |
| DELETE | `/guest/delete`       | Deletes a guest user from Firebase Authentication + all files in db and storage           | ✅             |

---

### 📂 `/process`

| Method | Endpoint                        | Description                                          | Auth Required |
|--------|----------------------------------|------------------------------------------------------|---------------|
| POST   | `/process/run-process-bib`        | Run the processes bibliography pipeline and stores results in DB      | ✅             |
| GET    | `/process/get-process-bib`   | Retrieves previously processed bibliography results  | ✅             |

---

### 📂 `/related`

| Method | Endpoint                        | Description                                          | Auth Required |
|--------|----------------------------------|------------------------------------------------------|---------------|
| POST   | `/related/run-related-work`        | Runs the related works pipeline and stores results in DB      | ✅             |
| GET    | `/related/get-related-work`   | Retrieves previously fetched related work results  | ✅             |

---

### 📂 `/cds`

| Method | Endpoint       | Description                        | Auth Required |
|--------|----------------|------------------------------------|---------------|
| GET   | `/cds/get-statements`   | Retrieves citation diversity statements | ✅             |

---

### 📂 `/ref`

| Method | Endpoint              | Description                                                   | Auth Required |
|--------|-----------------------|---------------------------------------------------------------|---------------|
| GET   | `/ref/get-all`         | Retrieves the references from the DB (includes gender labelled authors, BibTeX citation, title, doi) | ✅             |
| POST    | `/ref/add`             | Adds a reference to the reference list                        | ✅             |
| DELETE   | `/ref/delete`         | Removes a reference from the reference list | ✅      |
| POST | `/ref/download`       | Combines all the BibTex citations in the reference lists and returns a BibTex file    | ✅             |

---

## 🔐 Authentication Notes

All protected routes require the client to include a valid Firebase ID token in the request header.
The frontend retrieves this token using Firebase Authentication.

The API Gateway is the authentication middleware and is responsible for validating these tokens.
Once validated, the token is decoded, and the user's information is attached to the request object as it is forwarded to the appropriate service.

