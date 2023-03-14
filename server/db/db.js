const dbconfig = require("../config/dbconfig");

exports.dbFunctions = {
  insertQuery(tableName, data) {
    return new Promise((resolve, reject) => {
      let sql = ``;
      let insertInto = `INSERT INTO ` + tableName + ` (`;
      let values = ` VALUES (`;
      Object.keys(data).forEach(function (key) {
        insertInto += key + ",";

        if (data[key] == "null") {
          values += `null,`;
        } else {
          values += `'` + data[key] + `',`;
        }
      });
      insertInto = insertInto.slice(0, -1);

      insertInto += `) `;
      values = values.slice(0, -1);
      values += `) `;
      sql = insertInto + values;

      dbconfig.query(sql, (err, result) => {
        if (err) {
          console.log(err.message);
          reject(err);
        } else {
          console.log(sql);
          return resolve(result);
        }
      });
    });
  },

  updateQuery(tableName, data, cond = []) {
    return new Promise((resolve, reject) => {
      let sql = ``;
      let updateTable = `UPDATE ` + tableName + " SET ";
      let fieldsValues = ``;
      let whereClause = ``;
      let andClause = ``;
      Object.keys(data).forEach(function (key) {
        if (data[key] == "null") {
          fieldsValues += key + ` = null,`;
        } else {
          fieldsValues += key + ` = '` + data[key] + `',`;
        }
      });

      fieldsValues = fieldsValues.slice(0, -1);
      if (cond.length == 0) {
        andClause = ``;
        whereClause = ``;
      } else {
        whereClause = ` WHERE 1 `;
        for (let c of cond) {
          andClause += ` AND ` + c;
        }
      }
      sql = updateTable + fieldsValues + whereClause + andClause;
      dbconfig.query(sql, (err, result) => {
        if (err) {
          console.log(err.message);
          return reject(err);
        } else {
          console.log(sql);
          return resolve(result);
        }
      });
    });
  },

  executeQuery(query, cond = []) {
    return new Promise((resolve, reject) => {
      let sql = ``;
      let andClause = ``;
      let whereClause = ``;
      if (cond.length == 0) {
        andClause = ``;
        whereClause = ``;
      } else {
        whereClause = ` WHERE true `;
        for (let c of cond) {
          andClause += ` AND ` + c;
        }
      }

      sql = query + whereClause + andClause;

      dbconfig.query(sql, (err, result) => {
        if (err) {
          console.log(err.message);
          reject(err);
        } else {
          // console.log(sql);
          return resolve(result);
        }
      });
    });
  },
};