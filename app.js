const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

// 创建 Express 应用
const app = express();

// 提供静态资源
app.use(express.static('public'));

// 创建数据库
const db = new sqlite3.Database('./mydata.sqlite3');

// 使用 bodyParser 中间件来解析 JSON 请求体
app.use(bodyParser.json());

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
// 创建数据表
db.run('CREATE TABLE IF NOT EXISTS mytable (id INTEGER PRIMARY KEY AUTOINCREMENT, data VARCHAR(255), red_light_straight_interval INT, red_light_left_turn_interval INT, red_light_right_turn_interval INT, green_light_straight_interval INT, green_light_left_turn_interval INT, green_light_right_turn_interval INT, creator VARCHAR(255) NOT NULL, creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, signal_light_number VARCHAR(255), longitude FLOAT, latitude FLOAT, update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updater VARCHAR(255), jurisdiction_number VARCHAR(255), person_in_charge VARCHAR(255), remark VARCHAR(255))');

// 定义 POST 接口插入数据
app.post('/api/v1/insert', (req, res) => {
    // 检查 creator 是否提供
    if (!req.body.creator) {
        return res.status(400).send({ error: "Field 'creator' is required." });
    }

    // 从请求体中获取其他字段
    const { data, red_light_straight_interval, red_light_left_turn_interval, red_light_right_turn_interval, green_light_straight_interval, green_light_left_turn_interval, green_light_right_turn_interval, creator, signal_light_number, longitude, latitude, updater, jurisdiction_number, person_in_charge, remark } = req.body;

    // 插入数据，不包括 creation_time
    const sql = `INSERT INTO mytable (data, red_light_straight_interval, red_light_left_turn_interval, red_light_right_turn_interval, green_light_straight_interval, green_light_left_turn_interval, green_light_right_turn_interval, creator, signal_light_number, longitude, latitude, updater, jurisdiction_number, person_in_charge, remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [data, red_light_straight_interval, red_light_left_turn_interval, red_light_right_turn_interval, green_light_straight_interval, green_light_left_turn_interval, green_light_right_turn_interval, creator, signal_light_number, longitude, latitude, updater, jurisdiction_number, person_in_charge, remark];

    db.run(sql, values, function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send({ error: err.message });
            return;
        }
        res.send({ message: 'Data inserted successfully', id: this.lastID });
    });
});



// 查询数据
app.get('/api/v1/list', (req, res) => {
    // 仅选择 creator, signal_light_number, longitude, 和 latitude 字段
    db.all('SELECT creator, signal_light_number, longitude, latitude FROM mytable', (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: err.message });
            return;
        }

        res.send(rows);
    });
});


app.get('/api/v1/detailById/:id', (req, res) => {
    // 从请求中获取 id 参数
    const id = req.params.id;

    // 使用参数化查询以防止 SQL 注入
    db.get('SELECT * FROM mytable WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: err.message });
            return;
        }

        // 如果找到了记录，返回它；否则返回 404 状态码
        if (row) {
            res.send(row);
        } else {
            res.status(404).send({ error: 'Record not found' });
        }
    });
});




// 启动 Express 应用
app.listen(3000, () => {
    console.log('Express app listening on port 3000!');
});
