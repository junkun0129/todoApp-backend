const router = require("express").Router();
const controller = require("../controller/test.controller");
router.get("/slk", controller.testController);
router.get("", (req, res) => {
  res.send("<h1>its working</h1>");
});
module.exports = router;

// create table USERS(
//    user_id int auto_increment primary key,
//    first_name varchar(50) not null,
//    last_name varchar(50) not null,
//    email varchar(50) not null,
//    password varchar(100) not null,
//    img varchar(100) not null
// )

// create table TASKGROUP(
//   taskgroup_id int auto_increment primary key,
//   name varchar(50) not null,
//   order_num int
// )

// create table TASKS(
//   task_id int auto_increment primary key,
//   user_id int,
//   taskgroup_id int,
//   title varchar(50) not null,
//   description varchar(200) not null,
//   status enum('new', 'in_process', 'done') not null,
//   created_at timestamp default current_timestamp,
//   foreign key (user_id) references USERS (user_id),
//   foreign key (taskgroup_id) references TASKGROUP (taskgroup_id)
// )
