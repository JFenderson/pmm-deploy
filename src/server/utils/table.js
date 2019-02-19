import { row, rows, empty, executeQuery, generatePlaceholders } from '../config/db';

class Table {
    constructor(tableName) {
        if (!tableName) {
            throw new TypeError('You must pass a MySQL table name into the Table object constructor.');
        }
        this.tableName = tableName;
    }

    getOne(id) {
        let sql = `SELECT * FROM ${this.tableName} WHERE id = ${id};`;
        return executeQuery(sql, [id])
        .then((results) => results[0]);
    }

    getAll() {
        let sql = `SELECT * FROM ${this.tableName}`;
        return executeQuery(sql);
    }

    find(query) {
        let columns = Object.keys(query);
        let values = Object.values(query);
        let conditions = columns.map((columnName) => {
            return `${columnName} LIKE ?`;
        });
        let sql = `SELECT * FROM ${this.tableName} WHERE ${conditions.join(' AND ')};`;
        return executeQuery(sql, values);
    }

    insert(row) {
        let columns = Object.keys(row);
        let values = Object.values(row);
        let placeholderString = generatePlaceholders(values);
        let sql = `INSERT INTO ${this.tableName} (${columns.join(',')}) VALUES (${placeholderString});`;
        return executeQuery(sql, values)
        .then((results) => ({id: results.insertId }));
    }

    // userExists(first, last){
    //     let sql = `SELECT * FROM members WHERE first_name = ${first} AND last_name = ${last} LIMIT 1`
    //     return executeQuery(sql)
    //     .then((result) => {
    //         console.log('User exists:', result)
    //     })    
    //     .catch(err => {
    //         console.log(err)
    //     })
    //     // return new Promise((resolve) => {
    //     //   connection.query(
    //     //    sql,
    //     //     (error, result) => {
    //     //       if (error) return reject(error);
      
    //     //       if (result && result[0]) {
    //     //         console.log('User exists:', result); // for debug purposes
    //     //         return resolve(true);
    //     //       }
      
    //     //       resolve(false);
    //     //     });
    //     // });
    //   };
      

    update(id, row) {
        let columns = Object.keys(row);
        let values = Object.values(row);
        let updates = columns.map((columnName) => {
            return `${columnName} = ?`;
        });
        let sql = `UPDATE ${this.tableName} SET ${updates.join(',')} WHERE id = ${id};`;
        return executeQuery(sql, values);
    }

    delete(id) {
        let sql = `DELETE FROM ${this.tableName} WHERE id = ${id}`;
        return executeQuery(sql);
    }
}

export default Table;