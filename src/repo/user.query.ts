export const userQuery = {
  findById: `SELECT * FROM users WHERE id = ?`,
  insert: `INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())`,
}
