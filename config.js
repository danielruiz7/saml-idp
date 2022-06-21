const MongoClient = require('mongodb').MongoClient;

let users = new Promise((resolve, reject) => {

  MongoClient.connect('mongodb://localhost:27017/dad', function (err, client) {
    if (err) { return }
    console.log("Connected successfully to server");

    const db = client.db('dad');
    const collection = db.collection('users');

    // Find some documents
    collection.find({}, { fields: { uid: 1, email: 1, firstName: 1, lastName: 1, idNum: 1 } }).toArray(function (err, docs) {
      resolve(docs.map(doc => {
        return {
          userName: doc.email.address,
          nameIdFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
          givenName: doc.firstName,
          sn: doc.lastName,
          schacPersonalUniqueID: doc.idNum,
          eduPersonPrincipalName: doc.uid,
          irisMailMainAddress: doc.email.address
        }
      }));
      client.close();
    });
  });
});

/**
 * User Profile
 */
// let profile = {
//   userName: 'daniel.ruiz@alu.uma.es',
//   nameIdFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
//   givenName: 'Daniel',
//   sn: 'Ruiz',
//   schacPersonalUniqueID: '75893408D',
//   eduPersonPrincipalName: '061123123X',
//   irisMailMainAddress: 'daniel.ruiz@alu.uma.es'
// }

/**
 * SAML Attribute Metadata
 */
let metadata = [{
  id: "givenName",
  optional: false,
  displayName: 'Nombre',
  description: 'Nombre del usuario',
  multiValue: false
}, {
  id: "sn",
  optional: false,
  displayName: 'Apellidos',
  description: 'Apellidos del usuario',
  multiValue: false
}, {
  id: "schacPersonalUniqueID",
  optional: false,
  displayName: 'DNI',
  description: 'Documento de identidad',
  multiValue: false
}, {
  id: "eduPersonPrincipalName",
  optional: false,
  displayName: 'UID UMA',
  description: 'El identificador único de la UMA',
  multiValue: false
}, {
  id: "irisMailMainAddress",
  optional: false,
  displayName: 'Email',
  description: 'Email del usuario',
  multiValue: false
}];

module.exports = {
  metadata: metadata,
  users: users,
}
