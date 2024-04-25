CREATE TABLE tasks (
    task_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36), -- users テーブルの user_id 列を参照
    title VARCHAR(100),
    body TEXT,
    status ENUM('NEW', 'PROCESS', 'DONE'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(user_id)
);

create table dailytask (
    datilytask_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    task_id VARCHAR(36),
    plan text,
    result text,
    improve text,
    CONSTRAINT fk_daily_user_id FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_task_id FOREIGN KEY (task_id) REFERENCES tasks(task_id)
);

