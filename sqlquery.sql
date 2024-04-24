CREATE TABLE tasks (
    task_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36), -- users テーブルの user_id 列を参照
    title VARCHAR(100),
    body TEXT,
    status ENUM('NEW', 'PROCESS', 'DONE'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(user_id)
);

