const express = require("express");
const router = express.Router();
const Email = require("../models/Email");

// GET /api/emails/subjects
router.get("/subjects", async (req, res) => {
  try {
const subjects = await Email.find({}).sort({ date: -1 });
    res.json(subjects);
  } catch (err) {
    console.error("❌ Error fetching subjects:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/read", async (req, res) => {
  try {
    const updatedEmail = await Email.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!updatedEmail) {
      return res.status(404).json({ message: "Email not found" });
    }

    res.json(updatedEmail);
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// PUT /api/emails/:id/note
router.put("/:id/note", async (req, res) => {
  try {
    const { note } = req.body;

    if (typeof note !== 'string') {
      return res.status(400).json({ message: "Note must be a string" });
    }

    const updatedEmail = await Email.findByIdAndUpdate(
      req.params.id,
      { note },
      { new: true }
    );

    if (!updatedEmail) {
      return res.status(404).json({ message: "Email not found" });
    }

    res.json(updatedEmail);
  } catch (err) {
    console.error("❌ Update note error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
