const express = require("express");
const router = express.Router();
const con = require("../config/dbconfig");

router.get("/", function (req, res) {
  const sql = "SELECT * FROM new_recon";
  con.query(sql, function (err, result, fields) {
    //  console.log(result);
    if (err) {
      throw err;
      console.log(err);
    } else {
      res.send({ status: 1, data: result });
    }
  });
});

router.post("/add-recon", async function (req, res, next) {
  let {
    hospital,
    date_emailed,
    amount,
    ack,
    ack_status,
    analysis,
    analysis_plan,
    follow_up,
    follow_plan,
    accounting,
    acc_plan,
    due_date,
    remarks,
  } = req.body;
  con.query(
    `INSERT INTO new_recon 
    (hospital, 
      date_emailed, 
      amount, 
      ack, 
      ack_status, 
      initial_ass, 
      initial_plan, 
      follow_up,
      follow_plan, 
      accounting, 
      acc_plan, 
      due_date, 
      remarks, 
      date_created) 
      VALUES (
        ?, ?, ?, ?, ?, 
        ?,?,?,?,?,
        ?,?,?, 
        NOW())`,
    [
      hospital,
      date_emailed,
      amount,
      ack,
      ack_status,
      analysis,
      analysis_plan,
      follow_up,
      follow_plan,
      accounting,
      acc_plan,
      due_date,
      remarks,
    ],
    function (err, result) {
      if (err) {
        console.log(err);
        res.send({ status: 0, err: err, message: err });
      } else {
        res.send({ status: 1, message: "New Recon!" });
      }
    }
  );
});

module.exports = router;
