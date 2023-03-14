const express = require("express");
const router = express.Router();
const con = require("../config/dbconfig");
const db = require("../db/db");
const { dbFunctions } = require("../db/db");
const cf = require('../functions');
const cF = cf.commonFunction;

function getDateValue(data){
  if(data.suspension === null){
    return '';
  } 
  return moment(data.hospital.suspension).format('YYYY-MM-DD');
}

router.get("/", async function (req, res) {
  const sql = "call load_recon()";
  res.send(await dbFunctions.executeQuery(sql));
});

router.get("/autocomplete/hospital-list", async function (req, res) {
  const sql = ` Select hospital_name FROM base_hospitals`;
  // console.log(await dbFunctions.executeQuery(sql))
  let result = {
    status: 1,
    data: await dbFunctions.executeQuery(sql),
  };
  //console.log(response.data);
  res.send(result);
});

router.post("/add-recon", async function (req, res) {
  console.log(req.body);
  let hospital = JSON.parse(req.body.hospital);
  let acknowledgement = JSON.parse(req.body.acknowledgement);
  let analysis = JSON.parse(req.body.analysis);
  let follow_up = JSON.parse(req.body.follow_up);
  let accounting = JSON.parse(req.body.accounting);
  let admin = JSON.parse(req.body.admin);
  let closure = JSON.parse(req.body.closure);

  var result;
  var data;

  data = {
    hospital: hospital.hospital.hospital_name,
    date_emailed: cF.validateDate(hospital.date_emailed, 'YYYY-MM-DD'),
    amount: hospital.amount,
    suspension: cF.validateDate(hospital.suspension, 'YYYY-MM-DD'),
    due_date: cF.validateDate(hospital.due_date, 'YYYY-MM-DD'),
    ack: cF.validateDate(acknowledgement.ack, 'YYYY-MM-DD'),
    // ack_status: acknowledgement.ack_status,
    // ack_desc: acknowledgement.ack_desc,
    analysis: cF.validateDate(analysis.analysis, 'YYYY-MM-DD'),
    link: analysis.link,
    follow_up: cF.validateDate(follow_up.follow_up, 'YYYY-MM-DD'),
    follow_status: follow_up.follow_status,
    follow_desc: follow_up.follow_desc,
    accounting: cF.validateDate(accounting.accounting, 'YYYY-MM-DD'),
    admin: cF.validateDate(admin.admin, 'YYYY-MM-DD'),
    closure: cF.validateDate(closure.closure, 'YYYY-MM-DD'),
    user_id: req.body.user_id,
  };

  result = await dbFunctions.insertQuery("new_recon", data);
  //  console.log(result.resultId);

  for (let alys of analysis.analysisRows) {
    data = {
      reconId: result.insertId,
      analysis_status: alys.analysis_status,
      analysis_desc: alys.analysis_desc,
    };
    await dbFunctions.insertQuery("base_analysis", data);
  }

  for (let acc of accounting.accountingRows) {
    data = {
      reconId: result.insertId,
      acc_status: acc.acc_status,
      acc_desc: acc.acc_desc,
    };
    await dbFunctions.insertQuery("base_accounting", data);
  }

  for (let ad of admin.adminRows) {
    data = {
      reconId: result.insertId,
      admin_status: ad.admin_status,
      admin_desc: ad.admin_desc,
    };
    await dbFunctions.insertQuery("base_admin", data);
  }
});

// router.put('/:id', async function (req, res) {
//   let id = req.params.id;
//   console.log(id);
//   const sql = `SELECT * FROM new_recon` + id ;
//   con.query(sql, function (err, result, fields) {
//     //  console.log(result);
//     if (result.length == 0) {
//       res.send({ status: 0, data: err });
//       //  console.log(username.toString());
//       // console.log(hashed_password);
//     } else if (err) {
//       console.log(err.message);
//     } else {
//       res.send(result);
//       //console.log(res);
//     }
//   });
// });

router.get("/:id", async function (req, res) {
  id = req.params.id;

  const sql = `SELECT * FROM new_recon WHERE id= ${id}`;

  res.send(await db.dbFunctions.executeQuery(sql));
});

router.get("/recon-analysis/:id", async function (req, res) {
  id = req.params.id;

  const sql = `SELECT * FROM base_analysis WHERE reconId=${id}`;

  res.send(await db.dbFunctions.executeQuery(sql));
});

router.get("/recon-accounting/:id", async function (req, res) {
  id = req.params.id;

  const sql = `SELECT * FROM base_accounting WHERE reconId=${id}`;

  res.send(await db.dbFunctions.executeQuery(sql));
});

router.get("/recon-admin/:id", async function (req, res) {
  id = req.params.id;
  
  const sql = `SELECT * FROM base_admin WHERE reconId=${id}`;

  res.send(await db.dbFunctions.executeQuery(sql));
});

router.put("/update/:id", async function (req, res) {

  let id = +req.params.id;
  let hospital = JSON.parse(req.body.hospital);
  let acknowledgement = JSON.parse(req.body.acknowledgement);
  let analysis = JSON.parse(req.body.analysis);
  let follow_up = JSON.parse(req.body.follow_up);
  let accounting = JSON.parse(req.body.accounting);
  let admin = JSON.parse(req.body.admin);
  let closure = JSON.parse(req.body.closure);

  data = {
    hospital: hospital.hospital,
    date_emailed: cF.validateDate(hospital.date_emailed, 'YYYY-MM-DD'),
    amount: hospital.amount,
    suspension: cF.validateDate(hospital.suspension, 'YYYY-MM-DD'),
    due_date: cF.validateDate(hospital.due_date, 'YYYY-MM-DD'),
    ack: cF.validateDate(acknowledgement.ack, 'YYYY-MM-DD'),
    // ack_status: acknowledgement.ack_status,
    // ack_desc: acknowledgement.ack_desc,
    analysis: cF.validateDate(analysis.analysis, 'YYYY-MM-DD'),
    link: analysis.link,
    follow_up: cF.validateDate(follow_up.follow_up, 'YYYY-MM-DD'),
    follow_status: follow_up.follow_status,
    follow_desc: follow_up.follow_desc,
    accounting: cF.validateDate(accounting.accounting, 'YYYY-MM-DD'),
    admin: cF.validateDate(admin.admin, 'YYYY-MM-DD'),
    closure: cF.validateDate(closure.closure, 'YYYY-MM-DD'),
    user_id: req.body.user_id,
  };
  result = await dbFunctions.updateQuery("new_recon ", data, [`id=${id}`]);

  for (let alys of analysis.analysisRows) {
    if (alys.id > 0) {
      data = {
        analysis_status: alys.analysis_status,
        analysis_desc: alys.analysis_desc,
      };

      await dbFunctions.updateQuery("base_analysis", data, [`id=${alys.id}`]);
    } else {
      data = {
        reconId: id,
        analysis_status: alys.analysis_status,
        analysis_desc: alys.analysis_desc,
      };
      await dbFunctions.insertQuery("base_analysis", data);
    }
  }

  for (let acc of accounting.accountingRows) {
    if (acc.id > 0) {
      data = {
        acc_status: acc.acc_status,
        acc_desc: acc.acc_desc,
      };

      await dbFunctions.updateQuery("base_accounting", data, [`id=${acc.id}`]);
    } else {
      data = {
        reconId: id,
        acc_status: acc.acc_status,
        acc_desc: acc.acc_desc,
      };
      await dbFunctions.insertQuery("base_accounting", data);
    }
  }
  for (let ad of admin.adminRows) {
    if (ad.id > 0) {
      data = {
        admin_status: ad.admin_status,
        admin_desc: ad.admin_desc,
      };
      await dbFunctions.updateQuery("base_admin", data, [`id=${ad.id}`]);
    } else {
      data = {
        reconId: id,
        admin_status: ad.admin_status,
        admin_desc: ad.admin_desc,
      };
      await dbFunctions.insertQuery("base_admin", data);
    }
  }
  res.send({ message: "Update", status: 1 });
});

module.exports = router;
