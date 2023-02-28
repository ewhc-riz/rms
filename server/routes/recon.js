const express = require("express");
const router = express.Router();
const con = require("../config/dbconfig");
const db = require('../db/db');
const { dbFunctions } = require("../db/db");
const m = require("moment");

router.get("/", async function (req, res) {
  const sql = "call load_recon()";
  res.send(await dbFunctions.executeQuery(sql));
});

router.get('/autocomplete/hospital-list', async function (req, res) {

  const sql = ` Select hospital_name FROM base_hospitals`;
  // console.log(await dbFunctions.executeQuery(sql))
  let result =
  {
      status: 1,
      data: await dbFunctions.executeQuery(sql),
  }
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
      date_emailed: m(hospital.date_emailed).format('YYYY-MM-DD HH:mm:ss'),
      amount: hospital.amount,
      suspension: m(hospital.suspension).isValid() ? m(hospital.suspension).format('YYYY-MM-DD HH:mm:ss') : 'null',
      due_date: m(hospital.due_date).format('YYYY-MM-DD HH:mm:ss'),
      ack: m(acknowledgement.ack).format('YYYY-MM-DD HH:mm:ss'),
      ack_status: acknowledgement.ack_status,
      ack_desc: acknowledgement.ack_desc,
      analysis: m(analysis.analysis).format('YYYY-MM-DD HH:mm:ss'),
      follow_up: m(follow_up.follow_up).format('YYYY-MM-DD HH:mm:ss'),
      follow_status: follow_up.follow_status,
      follow_desc: follow_up.follow_desc,
      accounting: m(accounting.accounting).format('YYYY-MM-DD HH:mm:ss'),
      admin: m(admin.admin).format('YYYY-MM-DD HH:mm:ss'),
      closure: m(closure.closure).format('YYYY-MM-DD HH:mm:ss'),
      user_id: req.body.user_id,
    }
  
   result = await dbFunctions.insertQuery('new_recon', data);
  //  console.log(result.resultId);

   for (let alys of analysis.analysisRows){
      data = {
        reconId: result.insertId,
        analysis_status: alys.analysis_status,
        analysis_desc: alys.analysis_desc
      }
      await dbFunctions.insertQuery('base_analysis', data);
   }
   

   for (let acc of accounting.accountingRows){
      data = {
        reconId: result.insertId,
        acc_status: acc.acc_status,
        acc_desc: acc.acc_desc
      }
      await dbFunctions.insertQuery('base_accounting', data);
   }
   

   for(let ad of admin.adminRows) {
      data = {
        reconId: result.insertId,
        admin_status: ad.admin_status,
        admin_desc: ad.admin_desc
      }
      await dbFunctions.insertQuery('base_admin', data);
   }
  
});

router.put('/:id', async function (req, res) {
  let id = req.params.id;
  console.log(id);
  const sql = `SELECT * FROM new_recon` + id ;
  con.query(sql, function (err, result, fields) {
    //  console.log(result);
    if (result.length == 0) {
      res.send({ status: 0, data: err });
      //  console.log(username.toString());
      // console.log(hashed_password);
    } else if (err) {
      console.log(err.message);
    } else {
      res.send(result);
      //console.log(res);
    }
  });
});

router.get("/:id", async function (req, res) {
    id = req.params.id;
    console.log(id);
    const sql = `SELECT * FROM new_recon WHERE id= ${id}`;
     
    res.send(await db.dbFunctions.executeQuery(sql));
});

router.put("update/:id", async function (req, res) {

  let id = +req.params.id;
  let hospital = JSON.parse(req.body.hospital);
  let acknowledgement = JSON.parse(req.body.acknowledgement);
  let analysis = JSON.parse(req.body.analysis);
  let follow_up = JSON.parse(req.body.follow_up);
  let accounting = JSON.parse(req.body.accounting);
  let admin = JSON.parse(req.body.admin);
  let closure = JSON.parse(req.body.closure);


  data = {
    hospital: hospital.hospital.hospital_name,
      date_emailed: m(hospital.date_emailed).format('YYYY-MM-DD HH:mm:ss'),
      amount: hospital.amount,
      suspension: m(hospital.suspension).isValid() ? m(hospital.suspension).format('YYYY-MM-DD HH:mm:ss') : 'null',
      due_date: m(hospital.due_date).format('YYYY-MM-DD HH:mm:ss'),
      ack: m(acknowledgement.ack).format('YYYY-MM-DD HH:mm:ss'),
      ack_status: acknowledgement.ack_status,
      ack_desc: acknowledgement.ack_desc,
      analysis: m(analysis.analysis).format('YYYY-MM-DD HH:mm:ss'),
      follow_up: m(follow_up.follow_up).format('YYYY-MM-DD HH:mm:ss'),
      follow_status: follow_up.follow_status,
      follow_desc: follow_up.follow_desc,
      accounting: m(accounting.accounting).format('YYYY-MM-DD HH:mm:ss'),
      admin: m(admin.admin).format('YYYY-MM-DD HH:mm:ss'),
      closure: m(closure.closure).format('YYYY-MM-DD HH:mm:ss'),
      user_id: req.body.user_id,
  }
  result = await (dbFunctions.updateQuery('new_recon ', data, [`id=${id}`]));

  for (let alys of analysis.analysisRows){
    data = {
      reconId: result.insertId,
      analysis_status: alys.analysis_status,
      analysis_desc: alys.analysis_desc
    }
    await (dbFunctions.updateQuery('analysis', data, [`id=${id}`]));
 }
});

module.exports = router;
