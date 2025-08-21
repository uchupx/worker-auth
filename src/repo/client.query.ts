export const clientQuery = {
    insert: 'INSERT INTO clients (name, secret) VALUES (?,?)',
    findBySecret: `SELECT * FROM clients WHERE secret =?`,
    //... other queries
}