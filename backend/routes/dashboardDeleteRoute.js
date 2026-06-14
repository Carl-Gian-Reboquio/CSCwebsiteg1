const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

router.delete("/:personId", async (req, res) => {
  const { personId } = req.params;

  try {
    const [result] = await pool.query(
      `
      DELETE FROM applicant
      WHERE Person_ID = ?
      `,
      [personId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });
    }

    res.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
module.exports = router;