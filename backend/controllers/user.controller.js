const db = require('../database/db');

const jwt = require(`jsonwebtoken`);
const DEV_KEY = "DEV_KEY";


class UserController {
    async createUser(req, res) {
        const {passwordUser, loginUser} = req.body;
        const startAvatar = "https://sun9-80.userapi.com/impg/RH628Kuv1cGIgNv2yWAtmZb8aSoxX0IGmGWSaw/CLXMzSiqy7Y.jpg?size=564x564&quality=95&sign=32088835caa526a99ec559215346efda&c_uniq_tag=2lZ4ismg6JmQzFW29jeUAH5RMbF5zEmBDazoqhsH2x8&type=album";
        try {
            const newUser = await db.query(`INSERT INTO userS (loginUser, passwordUser, avatarUser, descriptionUser, sale) values ($1, $2, $3, $4, $5) RETURNING *`, [loginUser, passwordUser, startAvatar, "", 15]);
            res.send(newUser.rows[0]);
        } catch (err) {
            res.send(err);
        }
    }

    async getUser(req, res) {
        const id = req.query.id;
        try {
            const user = await db.query(`SELECT * FROM userS where id = $1`, [id]);
            res.send(user.rows[0]);
        } catch (err) {
            res.sendStatus(404);
        }
    }

    async getAllUsers(req, res) {
        const users = await db.query(`SELECT * FROM userS`);
        res.send(users.rows);
    }

    async authentication(req, res) {
        const {loginUser, passwordUser} = req.body;

        try {
            const user = await db.query(`SELECT * FROM userS where loginUser = $1 and passwordUser = $2`, [loginUser, passwordUser]);

            const token = jwt.sign(({
                login: user.rows[0].loginuser,
                avatar: user.rows[0].avataruser,
                id: user.rows[0].id
            }), DEV_KEY);

            res.send({token: token});
        } catch (err) {
            res.sendStatus(404);
        }
    }

    async updateUser(req, res) {
        const {loginUser, passwordUser, avatarUser, id, descriptionUser} = req.body;

        try {
            const user = await db.query(`UPDATE userS set loginUser = $1, passwordUser = $2, avatarUser = $3, descriptionUser = $4 where id = $5 RETURNING *`, [loginUser, passwordUser, avatarUser, descriptionUser, id]);

            res.send(user.rows);
        } catch (err) {
            res.sendStatus(400);
        }
    }
}

module.exports = new UserController();