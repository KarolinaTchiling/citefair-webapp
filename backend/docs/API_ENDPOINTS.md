# 📡 CiteFair API – Endpoint Reference

This file lists all current API endpoints in the project, organized by module and route purpose. Authentication is required for protected routes via Firebase ID tokens (`Authorization: Bearer <token>`).

---

## 🔐 Protected Endpoints

### 📂 `/file`

| Method | Endpoint           | Description                                                  | Auth Required |
|--------|--------------------|--------------------------------------------------------------|---------------|
| GET   | `/file/get-files`  | Fetches all user file names and Firebase Storage download URLs | ✅             |
| POST   | `/file/upload`     | Uploads a file to Firebase Storage                          | ✅             |
| DELETE | `/file/delete`     | Deletes a file from Firebase Storage and Realtime Database  | ✅             |

---

### 📂 `/processBib`

| Method | Endpoint                        | Description                                          | Auth Required |
|--------|----------------------------------|------------------------------------------------------|---------------|
| POST   | `/processBib/processBib`        | Processes bibliography and stores results in DB      | ✅             |
| GET    | `/processBib/getProcessedBib`   | Retrieves previously processed bibliography results  | ✅             |

---

### 📂 `/user`

| Method | Endpoint       | Description                        | Auth Required |
|--------|----------------|------------------------------------|---------------|
| POST   | `/user/name`   | Retrieves first, middle, and last name of the user | ✅             |
---

## 🌐 Public Endpoints

### 📂 `/guest`

| Method | Endpoint                 | Description                 | Auth Required |
|--------|--------------------------|-----------------------------|---------------|
| POST   | `/guest/registerGuest`   | Register anonymous user     | ❌             |

---

## 🔐 Authentication Notes

All protected routes require the client to include a Firebase ID token in the header:

