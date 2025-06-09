-- migrate:up
CREATE TABLE user_activities (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    activity_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- migrate:down
DROP TABLE IF EXISTS user_activities;
