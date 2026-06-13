const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

router.post("/register", async (req, res) => {
  const data = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [applicantResult] = await connection.query(
      `
      INSERT INTO applicant (
        Last_Name,
        First_Name,
        Middle_Name,
        Suffix,
        Birthdate,
        Age,
        Sex,
        Place_of_Birth,
        Civil_Status,
        Citizenship,
        Mothers_Maiden_Name,
        Permanent_Address,
        ZIP_Code,
        Mobile_Number,
        Telephone_Number,
        isPWD,
        isPregnant,
        isSenior_Citizen,
        Level_of_Education,
        Completion_Status,
        Graduation_Date,
        Highest_Units_Earned,
        Honor_Received,
        Course_Title,
        Major,
        School_Name,
        School_Address,
        Inclusive_Year_From,
        Inclusive_Year_To
      )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `,
      [
        data.lastName,
        data.firstName,
        data.middleName,
        data.suffix,
        data.dateOfBirth,
        data.age,
        data.sex,
        data.placeOfBirth,
        data.civilStatus,
        data.citizenship,
        data.mothersMaidenName,
        data.permanentAddress,
        data.zipCode,
        data.mobileNumber,
        data.telephoneNumber,
        data.isPWD,
        data.isPregnant,
        data.isSeniorCitizen,
        data.highestEducation,
        data.completionStatus,
        data.graduationDate || null,
        data.highestUnits,
        data.honorsReceived,
        data.courseDegree,
        data.major,
        data.schoolName,
        data.schoolAddress,
        data.inclusiveYearFrom || null,
        data.inclusiveYearTo || null,
      ],
    );

    const personId = applicantResult.insertId;

    await connection.query(
      `
        INSERT INTO account (
          Person_ID,
          Email_Address,
          Password
        )
        VALUES (?, ?, ?)
      `,
      [personId, data.email, data.password],
    );

    await connection.query(
      `
        INSERT INTO application (
          Application_No,
          Person_ID,
          CSC_Regional_Office,
          Examination_Applied_For,
          Date_of_Examination,
          Place_of_Examination,
          isFirst_Time_Taker,
          Date_of_Last_Examination_Taken,
          Employment_Sector,
          Agency_Office,
          Agency_Address,
          Job_Title,
          Years_in_Position,
          Employment_Status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        data.applicationNo,
        personId,
        data.region,
        data.examType,
        data.dateOfExamination,
        data.examPlace,
        data.firstTimeTaker,
        data.dateofLastExam || null,
        data.employmentSector,
        data.agencyOffice,
        data.agencyAddress,
        data.positionTitle,
        data.yearsInPosition || null,
        data.employmentStatus,
      ],
    );

    if (data.disabilities && data.disabilities.length > 0) {
      for (const disability of data.disabilities) {
        await connection.query(
          `
            INSERT INTO pwdinfo (
            Person_ID,
            PWD_Type
            )
            VALUES (?, ?)
          `,
          [personId, disability],
        );
      }
    }

    if (data.examinations && data.examinations.length > 0) {
      for (const exam of data.examinations) {
        await connection.query(
          `
          INSERT INTO examhistory (
            Application_No,
            Passed_Exam,
            Rating_Obtained,
            Passed_Exam_Date,
            Passed_Exam_Place
          )
          VALUES (?, ?, ?, ?, ?)
          `,
          [
            data.applicationNo,
            exam.title,
            exam.rating || null,
            exam.dateGranted || null,
            exam.placeOfExamination,
          ],
        );
      }
    }

    await connection.commit();

    res.json({
      success: true,
      personId: personId,
    });
  } catch (error) {
    await connection.rollback();

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    connection.release();
  }
});

module.exports = router;
