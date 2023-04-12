module.exports = {
   dev:{
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'project_sis'
   },
   prod:{
    connectionLimit: 5,
    // host: '34.30.18.208',
    user: 'root',
    password: process.env.PASSWORD,
    database: 'proyect-sistmes',
    // socketPath: "mysql-tech:us-central1:alan"
   }
};