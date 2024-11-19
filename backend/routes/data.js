const express = require("express");
const router = express.Router();
const db = require("../firebase");

// Route to get data from the "test" node
router.get("/", async (req, res) => {
  try {
    const ref = db.ref("users");
    ref.once("value", (snapshot) => {
      res.json(snapshot.val());
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

module.exports = router;