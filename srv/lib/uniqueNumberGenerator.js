'strict';

const cds = require('@sap/cds/lib');

module.exports = class uniqueNumberGenerator {
  static async getNextNumber(sequenceName, dbKind, poetrySlamID) {
    let nextNumber;
    let result;
    switch (dbKind) {
      case 'hana':
        // With HANA Cloud, the embedded functionality of numbering by sequence is used.
        // The sequence is a database object that is used to automatically generate the incremented list of numeric values.
        // Sequence specification file used in the generating process: ./db/src/poetrySlamNumber.hdbsequence

        // NEXTVAL function is used to retrieve the next value in the sequence
        nextNumber = await cds.run(
          `SELECT "${sequenceName}".NEXTVAL AS NEXTNO FROM DUMMY`
        );
        // Return the result as string
        return nextNumber[0]['NEXTNO'].toString();
      case 'sqlite':
        // With sqlite db, Auto-increment is used.
        // Auto increment generates a unique number automatically when a new record is inserted into a table.

        // First, check if sequencename pattern is correct
        if (!sequenceName.match(/^[A-Za-z0-9_-]*$/)) {
          throw new Error(`Invalid Sequencename: ${sequenceName}`);
        }
        try {
          await cds.run(
            INSERT.into(sequenceName).columns('ID').values(poetrySlamID)
          );
        } catch (error) {
          // If the table does not exist, it has to be created under the name: sequencename.
          console.log(
            `[PoetrySlam uniqueNumberGenerator.js]: sqlite SEQUENCE not found - creating sequence (error: ${error})`
          );
          await cds.run(
            `CREATE TABLE "${sequenceName}" (number INTEGER PRIMARY KEY AUTOINCREMENT, ID TEXT NOT NULL)`
          );
          await cds.run(
            INSERT.into(sequenceName).columns('ID').values(poetrySlamID)
          );
        }
        // Read the number of the newly inserted record
        result = await cds.run(
          SELECT.one
            .from(sequenceName)
            .columns('number')
            .where({ ID: poetrySlamID })
        );
        return result.number.toString();

      default:
        throw new Error(`Invalid Database type: ${dbKind}`);
    }
  }
};
