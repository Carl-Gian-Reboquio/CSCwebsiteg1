const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

router.get("/:personId", async (req, res) => {
  const { personId } = req.params;

  try {
    const [rows] = await pool.query(
      `
      SELECT
        ap.Person_ID,
        ap.First_Name,
        ap.Last_Name,
        ap.Birthdate,
        ap.Sex,
        ap.Citizenship,
        ap.Permanent_Address,
        
        ap.School_Name,
        ap.Course_Title,
        ap.Major,
        ap.Level_of_Education,
        acc.Email_Address,

        app.Application_No,
        app.Examination_Applied_For,
        app.Date_of_Examination,
        app.Place_of_Examination,

        app.Employment_Sector,
        app.Agency_Office,
        app.Job_Title,
        app.Employment_Status
        
      FROM applicant ap

      JOIN account acc
      ON ap.Person_ID = acc.Person_ID

      JOIN application app
      ON ap.Person_ID = app.Person_ID

      WHERE ap.Person_ID = ?
      `,
      [personId],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });
    }

    res.json({
      success: true,
      data: rows[0],
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
