const express = require("express");
const router = express.Router();
const con = require("../config/dbconfig");





router.get("/", async function (req, res, next) {
  const sql = `SELECT * FROM new_recon`;
  // res.send(await dbFunction.executeQuery(sql));
  con.query(sql, function (err, result, fields) {
    // console.log(result);
    if (err) {
      throw err;
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

// router.post('/add-franchise', async function (req, res) {
//   try {

//       let franchise = req.body;
//       const filePath = './uploads/';
//       const file = req.files.file;
//       const file_name = franchise.franchise_code + '_' + file.name;
//       file.mv(`${filePath}${file_name}`, (err) => {
//           if (err) {
//               console.log(err.message);
//               res.send({ status: 0, message: err.message, code: 200 });

//           }

//       });
//       await dbFunction.insertQuery("new_franchise", data);
//       res.send({ status: 1, message: 'File Uploaded Successfully' });

//   }
//   // console.log(req.files.file, req.body);
//   catch (error) {
//       console.log(error.message);
//       res.send({ status: 0, error: error, message: error });
//   }
// });

// router.put("/:id", async function (req, res, next) {
//   try {
//     let { id, address } = req.body;
//     // console.log(id);
//     const sql = `UPDATE company SET address=? WHERE id=?`;
//     con.query(sql, [address, id], function (err, result, fields) {
//       //  console.log(result);
//       if (result.length == 0) {
//         res.send({ status: 0, data: err });
//       } else if (err) {
//         console.log(err.message);
//       } else {
//         res.send({ status: 1 });
//         // // res.send(result);
//         // console.log(data);
//       }
//     });
//   } catch (ex) {
//     res.send({ status: 0, data: ex, error: ex });
//   }
// });

// router.delete("/:id", async function (req, res, next) {
//   try {
//     let id = req.params.id;
//     console.log(id);
//     const sql = `DELETE FROM company WHERE id=` + id;
//     con.query(sql, function (err, result) {
//       //  console.log(result);
//       if (err) {
//         console.log(err.message);
//       } else {
//         res.send({ status: 1, data: result });
//         //console.log(res);
//       }
//     });
//   } catch (ex) {
//     console.log(ex.message);
//     res.send({ status: 0, data: ex, error: ex });
//   }
// });

module.exports = router;
