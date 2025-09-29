export const clientQuery = {
    insert: 'INSERT INTO clients (name, secret, redirect_uris) VALUES (?,?,?)',
    findBySecret: `SELECT *
                   FROM clients
                   WHERE secret = ?`,

    update: `UPDATE clients
             SET name          = ?,
                 redirect_uris = ?
             WHERE id = ?`,

    findById: `SELECT * FROM clients WHERE id = ?`,

    finds: `SELECT id, name, created_at, updated_at, redirect_uris
            from clients
            limit __limit__ OFFSET __offset__`,
    //... other queries
}