import React, {Component} from 'react';
import SQLite from 'react-native-sqlite-storage';
SQLite.enablePromise(true);
// SQLite.DEBUG(true);

const db_name = 'ScanIt.db';
let db;

export const DB_CONSTS = {
  DOCSTABLE: 'DocsTable',
  FILESTABLE: 'FilesTable',
  DOCID: 'docId',
  DOCNAME: 'docName',
  DOCPATH: 'docPath',
  FILEID: 'fileId',
  FILENAME: 'fileName',
  FILEPATH: 'filePath',
  DATECREATED: 'dateCreated',
};

const DocTableCreation = `CREATE TABLE IF NOT EXISTS ${DB_CONSTS.DOCSTABLE} (${DB_CONSTS.DOCID} INTEGER PRIMARY KEY AUTOINCREMENT, ${DB_CONSTS.DOCNAME} TEXT NOT NULL, ${DB_CONSTS.DOCPATH} TEXT NOT NULL, ${DB_CONSTS.DATECREATED} TEXT NOT NULL)`;
const FileTableCreation = `CREATE TABLE IF NOT EXISTS ${DB_CONSTS.FILESTABLE} (${DB_CONSTS.FILEID} INTEGER PRIMARY KEY AUTOINCREMENT, ${DB_CONSTS.FILENAME} TEXT NOT NULL, ${DB_CONSTS.DOCNAME} TEXT NOT NULL, ${DB_CONSTS.FILEPATH} TEXT NOT NULL, ${DB_CONSTS.DATECREATED} TEXT NOT NULL)`;

class DBThings extends Component {
  //   constructor() {
  //       super()

  //   }
  
  async getDB() {
    try {
      console.log('Opening DB....');
      db = await SQLite.openDatabase({
        name: db_name,
        createFromLocation: 1,
      });
      console.log('DB is open for queries..');
    } catch (error) {
      console.log(`Error in Openeing DB >>> ${error.message}`);
    }
    //Creating Tables
    try {
      await db
        .transaction((tx) => {
          tx.executeSql(DocTableCreation);
        })
        .then(() => {
          console.log(`>> ${DB_CONSTS.DOCSTABLE} created successfully`);
        })
        .catch((error) => {
          `Could not create ${DB_CONSTS.DOCSTABLE} err : ${error.message}`;
        });
    } catch (error) {
      console.log(`Docs Table Error >>> ${error.message}`);
    }

    try {
      await db
        .transaction((tx) => {
          tx.executeSql(FileTableCreation);
        })
        .then(() => {
          console.log(`>> ${DB_CONSTS.FILESTABLE} created successfully`);
        })
        .catch((error) => {
          `Could not create ${DB_CONSTS.FILESTABLE} err : ${error.message}`;
        });
    } catch (error) {
      console.log(`Files table Error >>> ${error.message}`);
    }
  }
  getTimeStamp() {
    let date = new Date();
    let comps = [
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ];
    return comps.join('');
  }

  ExecuteQuery = (query, params = []) =>
    new Promise((resolve, reject) => {
      db.transaction((trans) => {
        trans.executeSql(
          query,
          params,
          (trans, result) => {
            resolve(result);
          },
          (error) => {
            reject(error);
          },
        );
      });
    });

  async insertDOCQuery(docName, docPath, timeStamp) {
    await this.getDB();
    console.log(
      `Docname : ${docName} >> DocPath : ${docPath} >> timeStamp : ${timeStamp}`,
    );
    let insertResult = await this.ExecuteQuery(
      `INSERT INTO ${DB_CONSTS.DOCSTABLE} (${DB_CONSTS.DOCNAME},${DB_CONSTS.DOCPATH},${DB_CONSTS.DATECREATED}) VALUES('${docName}','${docPath}','${timeStamp}')`,
      [],
    );
    console.log(insertResult);
  }

  async insertFileQuery(fileName, filePath, docName, timeStamp) {
    await this.getDB();
    let insertResult = await this.ExecuteQuery(
      `INSERT INTO ${DB_CONSTS.FILESTABLE} (${DB_CONSTS.FILENAME},${DB_CONSTS.DOCNAME},${DB_CONSTS.FILEPATH},${DB_CONSTS.DATECREATED}) VALUES('${fileName}','${docName}','${filePath}','${timeStamp}')`,
      [],
    );
    return insertResult;
  }

  async fileListQuery() {
    await this.getDB();
    let res = await this.ExecuteQuery(
      `SELECT * FROM ${DB_CONSTS.DOCSTABLE}`,
      [],
    );
    var queryRes = [];
    for (let index = 0; index < res.rows.length; index++) {
      queryRes.push(res.rows.item(index));
    }
    return queryRes;
  }

  async galleryQuery(floderName) {
    await this.getDB();
    let res = await this.ExecuteQuery(
      `SELECT * FROM  ${DB_CONSTS.FILESTABLE} WHERE ${DB_CONSTS.DOCNAME} = '${floderName}'`,
      [],
    );
    var queryRes = [];
    for (let index = 0; index < res.rows.length; index++) {
      queryRes.push(res.rows.item(index));
    }
    return queryRes;
  }

  async fileQuery(filePath) {
    await this.getDB();
    let fileResult = await this.ExecuteQuery(
      `SELECT * FROM ${DB_CONSTS.FILESTABLE} WHERE ${DB_CONSTS.FILEPATH} = '${filePath}'`,
      [],
    );
    var queryRes = [];
    for (let index = 0; index < fileResult.rows.length; index++) {
      queryRes.push(fileResult.rows.item(index));
    }
    return queryRes;
  }

  async deleteFileQuery(folderName){
    await this.getDB();
    let fileResult = await this.ExecuteQuery(
      `SELECT * FROM ${DB_CONSTS.FILESTABLE} WHERE ${DB_CONSTS.DOCNAME} = '${folderName}'`,
      [],
    );
    if (fileResult.rows.length === 1) {
      await this.ExecuteQuery(`DELETE FROM ${DB_CONSTS.FILESTABLE} WHERE ${DB_CONSTS.DOCNAME} = '${folderName}'`);
      await this.ExecuteQuery(`DELETE FROM ${DB_CONSTS.DOCSTABLE} WHERE ${DB_CONSTS.DOCNAME} = '${folderName}'`);
    }else{
      await this.ExecuteQuery(`DELETE FROM ${DB_CONSTS.FILESTABLE} WHERE ${DB_CONSTS.DOCNAME} = '${folderName}'`);
    }

  }

  async deleteFolderQuery(floderName) {
    await this.getDB();
    await this.ExecuteQuery(
      `DELETE FROM ${DB_CONSTS.DOCSTABLE} WHERE ${DB_CONSTS.DOCNAME} = '${floderName}'`,
      [],
    );
    await this.ExecuteQuery(
      `DELETE FROM ${DB_CONSTS.FILESTABLE} WHERE ${DB_CONSTS.DOCNAME} = '${floderName}'`,
    );
  }

  async dropTable() {
    await this.getDB();
    await this.ExecuteQuery(`DROP TABLE IF EXISTS ${DB_CONSTS.DOCSTABLE}`);
    await this.ExecuteQuery(`DROP TABLE IF EXISTS ${DB_CONSTS.FILESTABLE}`);
  }
}

export default DBThings;
