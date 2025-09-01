-- migrate:up
    ALTER TABLE users DROP INDEX email;


-- migrate:down
    ALTER TABLE users ADD UNIQUE (email);