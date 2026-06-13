router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query(
      `
        SELECT
        a.Account_ID,
        a.Email_Address,
        ap.Person_ID,
        ap.First_Name,
        ap.Last_Name
        FROM account a
        JOIN applicant ap
        ON a.Person_ID = ap.Person_ID
        WHERE a.Email_Address = ?
        AND a.Password = ?
      `,
      [email, password],
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.json({
      success: true,
      account: rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
