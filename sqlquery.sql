CREATE TABLE tasks (
    task_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36), -- users テーブルの user_id 列を参照
    title VARCHAR(100),
    body TEXT,
    status ENUM('NEW', 'PROCESS', 'DONE'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(user_id)
);

create table dailytasks (
    datilytask_id VARCHAR(36) PRIMARY KEY,
    report_id VARCHAR(36),
    task_id VARCHAR(36),
    result text,
    improve text,
    CONSTRAINT fk_report_id FOREIGN KEY (report_id) REFERENCES reports(report_id),
    CONSTRAINT fk_task_id FOREIGN KEY (task_id) REFERENCES tasks(task_id)
);


create table taskcomments (
    taskcomment_id VARCHAR(36) PRIMARY KEY,
    task_id VARCHAR(36),
    user_id VARCHAR(36),
    body text,
    CONSTRAINT fk_tasks_taskcomments FOREIGN KEY (task_id) REFERENCES tasks(task_id),
    CONSTRAINT fk_users_taskcomments FOREIGN KEY (user_id) REFERENCES tasks(user_id)
)
    

 `SELECT r.title, u.user_name, u.img, r.created_at
  FROM ${tables.reports} r
  JOIN ${tables.users} u ON r.user_id = u.user_id
  WHERE 1=1
  `;

