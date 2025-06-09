export const userQuery = {
  findById: `SELECT * FROM users WHERE id = ?`,
  findByUsername: `SELECT id, username, email, password, created_at, updated_at, deleted_at FROM users WHERE username = ?`,
  insert: `INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())`,
}
