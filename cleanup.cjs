const path = require('path');
const Database = require('better-sqlite3');
const db = new Database('database.db');
const stmt = db.prepare("DELETE FROM content_blocks WHERE block_key LIKE '%_track' AND page = 'contactPage'");
const info = stmt.run();
console.log(`Deleted ${info.changes} rows.`);
