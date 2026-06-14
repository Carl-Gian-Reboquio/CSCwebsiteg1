const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

// Update Personal Information
router.put("/personal/:personId", async (req, res) => {
  const { personId } = req.params;
  const { First_Name, Last_Name, Birthdate, Sex, Citizenship, Permanent_Address } = req.body;

  try {
    const [result] = await pool.query(
      `
      UPDATE applicant
      SET
        First_Name = ?,
        Last_Name = ?,
        Birthdate = ?,
        Sex = ?,
        Citizenship = ?,
        Permanent_Address = ?
      WHERE Person_ID = ?
      `,
      [First_Name, Last_Name, Birthdate, Sex, Citizenship, Permanent_Address, personId]
    );

    if (result.affectedRows === 0 && result.changedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });
    }

    res.json({
      success: true,
      message: "Personal information updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update Education Information
router.put("/education/:personId", async (req, res) => {
  const { personId } = req.params;
  const { School_Name, Course_Title, Major, Level_of_Education } = req.body;

  try {
    const [result] = await pool.query(
      `
      UPDATE applicant
      SET
        School_Name = ?,
        Course_Title = ?,
        Major = ?,
        Level_of_Education = ?
      WHERE Person_ID = ?
      `,
      [School_Name, Course_Title, Major, Level_of_Education, personId]
    );

    if (result.affectedRows === 0 && result.changedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });
    }

    res.json({
      success: true,
      message: "Education information updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update Employment Information
router.put("/employment/:personId", async (req, res) => {
  const { personId } = req.params;
  const { Employment_Sector, Agency_Office, Job_Title, Employment_Status } = req.body;

  try {
    const [result] = await pool.query(
      `
      UPDATE application
      SET
        Employment_Sector = ?,
        Agency_Office = ?,
        Job_Title = ?,
        Employment_Status = ?
      WHERE Person_ID = ?
      `,
      [Employment_Sector, Agency_Office, Job_Title, Employment_Status, personId]
    );

    if (result.affectedRows === 0 && result.changedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      message: "Employment information updated successfully",
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