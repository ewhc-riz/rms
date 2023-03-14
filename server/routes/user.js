const express = require("express");
const router = express.Router();
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const con = require("../config/dbconfig");
/* GET users listing. */

router.post("/register", async function (req, res, next) {
  try {
    let { username, email, password } = req.body;

    const hashed_password = md5(password.toString());
    const checkUsername = `Select username FROM users WHERE username = ?`;

    con.query(checkUsername, [username], (err, result, fields) => {
      if (!result.length) {
        const sql = `Insert Into users (username, email, password) VALUES ( ?, ?, ? )`;
        con.query(
          sql,
          [username, email, hashed_password],
          (err, result, fields) => {
            if (err) {
              res.send({ status: 0, data: err });
            } else {
              let token = jwt.sign({ data: result }, "secret");
              res.send({ status: 1, data: result, token: token });
            }
          }
        );
      }
    });
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});

router.get("/", function (req, res) {
  const sql = "SELECT users.* FROM users";
  con.query(sql, function (err, result, fields) {
    // console.log(result);
    if (err) {
      throw err;
      console.log(err);
    } else {
      res.send({ status: 1, data: result });
    }
  });
});

router.post("/login", async function (req, res, next) {
  try {
    let { email, password } = req.body;

    const hashed_password = md5(password.toString());
    const sql = `SELECT * FROM users WHERE email = ? AND user_password = ?`;
    con.query(sql, [email, hashed_password], function (err, result, fields) {
      //   console.log(result);
      if (result.length == 0) {
        res.send({ status: 0, data: err });
        //  console.log(firstname.toString());
        console.log(hashed_password);
      } else if (err) {
        console.log(err.message);
      } else {
        let token = jwt.sign({ data: result }, "secret");
        res.send({ status: 1, data: result, token: token });
        // console.log(res);
      }
    });
  } catch (error) {
    // console.log(error.message);
    res.send({ status: 0, error: error });
  }
});

router.post("/add-user", async function (req, res, next) {
  try {
    let {
      firstname,
      lastname,
      email,
      department,
      user_password,
      confirm_password,
      user_level,
    } = req.body;

    const sql = `SELECT * FROM users WHERE email = ?`;
    con.query(sql, [email], function (err, result, fields) {
      //   console.log(result);
      if (err) {
        console.log(err);
      }
      if (result.length > 0) {
        res.send({
          status: 0,
          message: "Email address of user already exists!",
        });

        //  console.log(username.toString());
        // console.log(hashed_password);
      } else {
        let hashed_password = md5(user_password);
        con.query(
          "INSERT INTO users (firstname, lastname, email, department, user_password, user_level) VALUES (?, ?, ?, ?, ?, ?) ",
          [firstname, lastname, email, department, hashed_password, user_level],
          function (err, result) {
            if (err) {
              console.log(err);
              res.send({ status: 0, err: err, message: err });
            } else {
              res.send({ status: 1, message: "User successfully added!" });
            }
          }
        );
      }
    });
  } catch (error) {
    console.log(error.message);
    res.send({ status: 0, error: error, message: error });
  }
});

router.get("/", async function (req, res, next) {
  try {
    const sql = `SELECT * FROM users order by id DESC`;
    con.query(sql, function (err, result, fields) {
      //  console.log(result);
      if (result.length == 0) {
        res.send({ status: 0, data: err });
        //  console.log(username.toString());
        // console.log(hashed_password);
      } else if (err) {
        console.log(err.message);
      } else {
        res.send({ status: 1, data: result });
        //console.log(res);
      }
    });
  } catch (ex) {
    res.send({ status: 0, data: ex, error: ex });
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    console.log(id);
    const sql = `SELECT * FROM users  WHERE id=` + id;
    con.query(sql, function (err, result, fields) {
      //  console.log(result);
      if (result.length == 0) {
        res.send({ status: 0, data: err });
        // console.log(username.toString());
        // console.log(hashed_password);
      } else if (err) {
        console.log(err.message);
      } else {
        res.send(result);
        //console.log(res);
      }
    });
  } catch (ex) {
    res.send({ status: 0, data: ex, error: ex });
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    console.log(id);
    const sql = `DELETE FROM users WHERE id=` + id;
    con.query(sql, function (err, result) {
      //  console.log(result);
      if (err) {
        console.log(err.message);
      } else {
        res.send({ status: 1, data: result });
        //console.log(res);
      }
    });
  } catch (ex) {
    console.log(ex.message);
    res.send({ status: 0, data: ex, error: ex });
  }
});

router.put("/:id", async function (req, res, next) {
  try {
    var sql;
    let {
      id,
      firstname,
      lastname,
      email,
      position,
      user_password,
      confirm_password,
      user_level,
    } = req.body;
    if (req.body.user_password == "") {
      sql =
        `UPDATE users
               SET firstname='` +
        firstname +
        `',` +
        `lastname = '` +
        lastname +
        `', ` +
        `position = '` +
        position +
        `', ` +
        `user_level = '` +
        user_level +
        `', ` +
        `email = '` +
        email +
        `' ` +
        `WHERE id=` +
        id;
    } else {
      sql =
        `UPDATE user_login 
      SET firstname='` +
        firstname +
        `',` +
        `lastname = '` +
        lastname +
        `', ` +
        `position = '` +
        position +
        `', ` +
        `user_level = '` +
        user_level +
        `', ` +
        `email = '` +
        email +
        `', ` +
        `user_password = '` +
        md5(user_password) +
        `' ` +
        `WHERE id=` +
        id;
    }
    con.query(sql, function (err, result, fields) {
      //  console.log(result);
      if (result.length == 0) {
        res.send({ status: 0, data: err });
      } else if (err) {
        console.log(err.message);
      } else {
        res.send({ status: 1 });
        //console.log(res);
      }
    });
  } catch (ex) {
    res.send({ status: 0, data: ex, error: ex.message });
    console.log(ex.message);
  }
});

module.exports = router;
