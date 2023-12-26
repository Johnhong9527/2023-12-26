const sqlite3 = require('sqlite3').verbose();
const express = require('express');

// 创建Express 应用
const app = express();

// 创建数据库
const db = new sqlite3.Database('./mydata.sqlite3');


/*
创建人:creator
创建时间:creation_time
红灯直行间隔:red_light_straight_interval
红灯左转间隔:red_light_left_turn_interval
红灯右转间隔:red_light_right_turn_interval
绿灯直行间隔:green_light_straight_interval
绿灯左转间隔:green_light_left_turn_interval
绿灯右转间隔:green_light_right_turn_interval
信号灯编号:signal_light_number
经度:longitude
纬度:latitude
更新时间:update_time
更新人:updater
负责人:person_in_charge
归属辖区编号:jurisdiction_number
备注:remark
*/
db.run('CREATE TABLE IF NOT EXISTS mytable (id INT PRIMARY KEY, data VARCHAR(255), red_light_straight_interval INT, red_light_left_turn_interval INT, red_light_right_turn_interval INT, green_light_straight_interval INT, green_light_left_turn_interval INT, green_light_right_turn_interval INT, creator VARCHAR(255), creation_time TIMESTAMP, signal_light_number VARCHAR(255), longitude FLOAT, latitude FLOAT, update_time TIMESTAMP, updater VARCHAR(255), jurisdiction_number VARCHAR(255), person_in_charge VARCHAR(255), remark VARCHAR(255))');

// 查询数据
app.get('/api/data', (req, res) => {
    db.all('SELECT * FROM mytable', (err, rows) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
            return;
        }

        res.send(rows);
    });
});

// 启动 Express 应用
app.listen(3000, () => {
    console.log('Express app listening on port 3000!');
});
