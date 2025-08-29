export const userQuery = {
    findById: `SELECT *
               FROM users
               WHERE id = ?`,
    findByUsername: `SELECT u.id,
                            u.username,
                            u.email,
                            u.password,
                            u.created_at,
                            u.updated_at,
                            u.deleted_at
                     FROM users as u
                              LEFT JOIN clients as c ON u.client_id = c.id
                     WHERE username = ?
                       and c.secret = ?`,

    findByUsernameAndClientId: `SELECT u.id,
                                 u.username,
                                 u.email,
                                 u.password,
                                 u.created_at,
                                 u.updated_at,
                                 u.deleted_at
                          FROM users as u
                          WHERE username = ?
                            and u.client_id = ?`,
    insert: `INSERT INTO users (username, email, password, client_id, created_at)
             VALUES (?, ?, ?, ?, NOW())`,

    updatePassword: `UPDATE users
                     SET password   = ?,
                         updated_at = now()
                     WHERE id = ?`
}
