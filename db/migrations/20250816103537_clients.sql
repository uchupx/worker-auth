-- migrate:up
CREATE TABLE clients(
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name varchar(255) NOT NULL,
    secret varchar(255) NOT NULL,
    redirect_uris TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO clients (name, secret, redirect_uris) VALUES ("Worker", "itsasecretyouknow", "[https://example.com/callback]");

ALTER TABLE users ADD COLUMN client_id CHAR(36) REFERENCES clients(id);

-- migrate:down
DROP TABLE IF EXISTS clients;
