export const clientQuery = {
    insert: 'INSERT INTO clients (name, secret) VALUES (?,?)',
    findBySecret: `SELECT * FROM clients WHERE secret =?`,

    finds: `SELECT id, name, created_at, updated_at from clients limit __limit__ OFFSET __offset__`,
    //... other queries
}