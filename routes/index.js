const express = require("express");
//const { Client } = require('pg');
const { Pool } = require('pg');
require("dotenv").config();
var router = express.Router();

/*const con = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
con.connect().then(() => console.log("connected"));*/


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, 
  max: 20
});

pool.connect().then(() => console.log("connected to Neon"))
  .catch(err => console.error('Connection error:', err));


router.get("/", (req,res) => {
    res.render('landing');
});

router.get("/cry_form", (req, res) => {
    res.render('cry_login', { showSuccess: false });
});

router.post("/cry_form", async (req, res) => {
    const { intensity, mood, reason, description } = req.body;
    console.log(intensity, mood, reason, description);
    
    try {
        await con.query(
            "INSERT INTO cries (cry_date, intensity, mood, reason, description) VALUES (CURRENT_DATE, $1, $2, $3, $4)",
            [intensity, mood, reason, description]
        );
        res.render('cry_login', { showSuccess: true });
    } catch(err) {
        console.error(err);
        res.send("Error saving data");
    }
    
});

router.get("/stats", async (req, res) => {
    try {
        const totalRes = await con.query("SELECT COUNT(*) FROM cries");
        const intensityRes = await con.query("SELECT intensity, COUNT(*) FROM cries GROUP BY intensity");
        const moodRes = await con.query("SELECT mood, COUNT(*) FROM cries GROUP BY mood");
        const reasonRes = await con.query("SELECT reason, COUNT(*) FROM cries GROUP BY reason");

        res.render('stats', {
            total: totalRes.rows[0].count,
            intensity: intensityRes.rows,
            mood: moodRes.rows,
            reason: reasonRes.rows
        });
    } catch (err) {
        console.error(err);
        res.send("Error fetching stats");
    }
});


module.exports = router;
