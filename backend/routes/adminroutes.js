const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

// Get all expired applications (exam date passed more than 15 days ago)
router.get("/expired", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        ap.Person_ID,
        ap.First_Name,
        ap.Last_Name,
        acc.Email_Address,
        app.Application_No,
        app.Examination_Applied_For,
        app.Date_of_Examination,
        app.Place_of_Examination
      FROM applicant ap
      JOIN account acc ON ap.Person_ID = acc.Person_ID
      JOIN application app ON ap.Person_ID = app.Person_ID
      WHERE app.Date_of_Examination < DATE_SUB(CURDATE(), INTERVAL 15 DAY)
      ORDER BY app.Date_of_Examination ASC
      `
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete all expired applications at once
router.delete("/expired", async (req, res) => {
  try {
    // Get all expired Person_IDs first
    const [rows] = await pool.query(
      `
      SELECT ap.Person_ID
      FROM applicant ap
      JOIN application app ON ap.Person_ID = app.Person_ID
      WHERE app.Date_of_Examination < DATE_SUB(CURDATE(), INTERVAL 15 DAY)
      `
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        message: "No expired applications to delete.",
      });
    }

    const personIds = rows.map(r => r.Person_ID);

    // Delete in order to respect foreign keys
    await pool.query(`DELETE FROM application WHERE Person_ID IN (?)`, [personIds]);

    res.json({
      success: true,
      message: `${personIds.length} expired application(s) deleted successfully.`,
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