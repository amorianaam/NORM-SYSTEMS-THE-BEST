var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_express_rate_limit = __toESM(require("express-rate-limit"), 1);
var import_better_sqlite3 = __toESM(require("better-sqlite3"), 1);
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var import_multer = __toESM(require("multer"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_child_process = require("child_process");
var JWT_SECRET = process.env.JWT_SECRET || "norm_super_secret_key_2026";
var PORT = process.env.PORT || 3e3;
var db = new import_better_sqlite3.default("database.db");
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS cms_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor',
    last_login DATETIME
  );

  CREATE TABLE IF NOT EXISTS content_blocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page TEXT NOT NULL,
    slug TEXT NOT NULL,
    block_key TEXT NOT NULL,
    content_ar TEXT,
    content_en TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER,
    UNIQUE(page, slug, block_key)
  );

  CREATE TABLE IF NOT EXISTS insights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    category TEXT,
    summary_ar TEXT,
    summary_en TEXT,
    pdf_path TEXT,
    is_active INTEGER DEFAULT 1,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS insights_news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_ar TEXT NOT NULL,
    content_en TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity TEXT,
    challenge TEXT,
    name TEXT,
    position TEXT,
    email TEXT,
    phone TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS talent_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    identity TEXT,
    email TEXT,
    phone TEXT,
    context TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS insight_readers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    organization TEXT,
    insight_id INTEGER,
    download_time DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    user_name TEXT,
    action TEXT,
    resource TEXT,
    details TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cms_audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    user_name TEXT,
    action_type TEXT,
    affected_resource TEXT,
    details TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS global_settings (
    setting_key TEXT PRIMARY KEY,
    setting_value TEXT
  );

  CREATE TABLE IF NOT EXISTS seo_metadata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT UNIQUE NOT NULL,
    title_ar TEXT,
    title_en TEXT,
    description_ar TEXT,
    description_en TEXT,
    keywords_ar TEXT,
    keywords_en TEXT,
    og_title_ar TEXT,
    og_title_en TEXT,
    og_desc_ar TEXT,
    og_desc_en TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS image_metadata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT UNIQUE NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS api_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    status INTEGER,
    duration_ms INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS client_errors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT,
    stack TEXT,
    url TEXT,
    component TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS system_backups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
  );

  CREATE TABLE IF NOT EXISTS partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    src TEXT NOT NULL,
    order_index INTEGER DEFAULT 0
  );
`);
var defaultPages = [
  { path: "/", title_en: "Home - NORM | Decision Architecture House", title_ar: "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629 - \u0646\u0648\u0631\u0645 | \u062F\u0627\u0631 \u0647\u0646\u062F\u0633\u0629 \u0627\u0644\u0642\u0631\u0627\u0631", description_en: "NORM House of Decision Architecture", description_ar: "\u062F\u0627\u0631 \u0647\u0646\u062F\u0633\u0629 \u0627\u0644\u0642\u0631\u0627\u0631 - \u0646\u0648\u0631\u0645" },
  { path: "/about", title_en: "About NORM", title_ar: "\u0639\u0646 \u0646\u0648\u0631\u0645", description_en: "Learn about NORM, our methodology and mission", description_ar: "\u062A\u0639\u0631\u0641 \u0639\u0644\u0649 \u0646\u0648\u0631\u0645\u060C \u0645\u0646\u0647\u062C\u064A\u062A\u0646\u0627 \u0648\u0631\u0633\u0627\u0644\u062A\u0646\u0627" },
  { path: "/services", title_en: "Our Services", title_ar: "\u062E\u062F\u0645\u0627\u062A\u0646\u0627", description_en: "Explore consulting and strategic advisory options", description_ar: "\u0627\u0633\u062A\u0643\u0634\u0641 \u0627\u0644\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u0627\u0633\u062A\u0634\u0627\u0631\u064A\u0629 \u0648\u0627\u0644\u062A\u0648\u062C\u064A\u0647 \u0627\u0644\u0627\u0633\u062A\u0631\u0627\u062A\u064A\u062C\u064A" },
  { path: "/contact", title_en: "Contact Us", title_ar: "\u0627\u062A\u0635\u0644 \u0628\u0646\u0627", description_en: "Get in touch with NORM office", description_ar: "\u062A\u0648\u0627\u0635\u0644 \u0645\u0639 \u0645\u0643\u062A\u0628 \u0646\u0648\u0631\u0645" }
];
for (const page of defaultPages) {
  try {
    const exists = db.prepare("SELECT 1 FROM seo_metadata WHERE path = ?").get(page.path);
    if (!exists) {
      db.prepare(`
        INSERT INTO seo_metadata (path, title_en, title_ar, description_en, description_ar, keywords_en, keywords_ar)
        VALUES (?, ?, ?, ?, ?, '', '')
      `).run(page.path, page.title_en, page.title_ar, page.description_en, page.description_ar);
    }
  } catch (err) {
    console.error("Failed to seed SEO metadata:", err);
  }
}
function logAudit(userId, userName, action, resource, details) {
  try {
    db.prepare(`
      INSERT INTO audit_logs (user_id, user_name, action, resource, details)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, userName, action, resource, details);
    db.prepare(`
      INSERT INTO cms_audit_logs (user_id, user_name, action_type, affected_resource, details)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, userName, action, resource, details);
  } catch (err) {
    console.error("Failed to write audit logs:", err);
  }
}
var defaultAdmin = db.prepare("SELECT * FROM cms_users WHERE email = ?").get("admin@norm.com");
if (!defaultAdmin) {
  const hash = import_bcryptjs.default.hashSync("AdminNorm2026!", 10);
  db.prepare("INSERT INTO cms_users (name, email, password_hash, role) VALUES (?, ?, ?, ?)").run(
    "Super Admin",
    "admin@norm.com",
    hash,
    "admin"
  );
}
var uploadDir = import_path.default.join(process.cwd(), "uploads");
if (!import_fs.default.existsSync(uploadDir)) {
  import_fs.default.mkdirSync(uploadDir);
}
var storage = import_multer.default.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});
var upload = (0, import_multer.default)({ storage });
async function startServer() {
  const app = (0, import_express.default)();
  app.use(import_express.default.json());
  app.use("/uploads", import_express.default.static(uploadDir));
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      const endpoint = req.originalUrl || req.url;
      if (endpoint.startsWith("/api/")) {
        const method = req.method;
        const status = res.statusCode;
        try {
          db.prepare(`
            INSERT INTO api_metrics (endpoint, method, status, duration_ms)
            VALUES (?, ?, ?, ?)
          `).run(endpoint.split("?")[0], method, status, duration);
        } catch (e) {
        }
      }
    });
    next();
  });
  const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      import_jsonwebtoken.default.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };
  const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.sendStatus(403);
    }
  };
  app.get("/api/auth/verify", authenticate, (req, res) => {
    res.json({ success: true, user: req.user });
  });
  app.post("/api/client_errors", (req, res) => {
    const { message, stack, url, component } = req.body;
    try {
      db.prepare(`
        INSERT INTO client_errors (message, stack, url, component)
        VALUES (?, ?, ?, ?)
      `).run(message, stack, url, component || "UnknownComponent");
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/system/backup/json", authenticate, requireAdmin, (req, res) => {
    try {
      const tables = [
        "cms_users",
        "content_blocks",
        "insights",
        "inquiries",
        "insight_readers",
        "audit_logs",
        "cms_audit_logs",
        "seo_metadata",
        "image_metadata",
        "api_metrics",
        "client_errors"
      ];
      const snapshot = {};
      for (const table of tables) {
        try {
          snapshot[table] = db.prepare(`SELECT * FROM ${table}`).all();
        } catch (e) {
          snapshot[table] = [];
        }
      }
      res.setHeader("Content-disposition", "attachment; filename=database_backup.json");
      res.setHeader("Content-type", "application/json");
      res.send(JSON.stringify(snapshot, null, 2));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/system/backup/archive", authenticate, requireAdmin, (req, res) => {
    const archivePath = import_path.default.join(process.cwd(), `temp_download_${Date.now()}.tar.gz`);
    (0, import_child_process.exec)(`tar -czf "${archivePath}" database.db uploads`, (error, stdout, stderr) => {
      if (error) {
        console.error("Tar compression failed:", error, stderr);
        return res.status(500).json({ error: "Failed to create compressed backup archive." });
      }
      res.download(archivePath, "norm_full_system_backup.tar.gz", (err) => {
        if (import_fs.default.existsSync(archivePath)) {
          try {
            import_fs.default.unlinkSync(archivePath);
          } catch (e) {
          }
        }
      });
    });
  });
  app.post("/api/system/backup/internal", authenticate, requireAdmin, (req, res) => {
    const backupsDir = import_path.default.join(process.cwd(), "backups");
    if (!import_fs.default.existsSync(backupsDir)) {
      import_fs.default.mkdirSync(backupsDir);
    }
    const filename = `norm_server_backup_${Date.now()}.tar.gz`;
    const archivePath = import_path.default.join(backupsDir, filename);
    (0, import_child_process.exec)(`tar -czf "${archivePath}" database.db uploads`, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: "Failed to create internal backup." });
      }
      try {
        db.prepare("INSERT INTO system_backups (filename, type, created_by) VALUES (?, ?, ?)").run(filename, "full", req.user.id);
        logAudit(req.user.id, req.user.name, "CREATE", "system_backups", `\u0625\u0646\u0634\u0627\u0621 \u0648\u062D\u0641\u0638 \u0646\u0633\u062E\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629 \u0641\u064A \u0627\u0644\u062E\u0627\u062F\u0645: ${filename}`);
        res.json({ success: true, filename });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  });
  app.get("/api/system/audit_logs", authenticate, (req, res) => {
    try {
      const logs = db.prepare("SELECT * FROM audit_logs ORDER BY timestamp DESC").all();
      res.json(logs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/seo", (req, res) => {
    try {
      const list = db.prepare("SELECT * FROM seo_metadata ORDER BY id ASC").all();
      res.json(list);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/seo", authenticate, (req, res) => {
    const {
      path: path2,
      title_ar,
      title_en,
      description_ar,
      description_en,
      keywords_ar,
      keywords_en,
      og_title_ar,
      og_title_en,
      og_desc_ar,
      og_desc_en
    } = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO seo_metadata (
          path, title_ar, title_en, description_ar, description_en,
          keywords_ar, keywords_en, og_title_ar, og_title_en, og_desc_ar, og_desc_en
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const info = stmt.run(
        path2,
        title_ar || "",
        title_en || "",
        description_ar || "",
        description_en || "",
        keywords_ar || "",
        keywords_en || "",
        og_title_ar || "",
        og_title_en || "",
        og_desc_ar || "",
        og_desc_en || ""
      );
      logAudit(req.user.id, req.user.name, "CREATE", "seo_metadata", `\u0625\u0636\u0627\u0641\u0629 \u0625\u0639\u062F\u0627\u062F\u0627\u062A SEO \u0644\u0635\u0641\u062D\u0629: ${path2}`);
      res.json({ success: true, id: info.lastInsertRowid });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.put("/api/seo/:id", authenticate, (req, res) => {
    const {
      title_ar,
      title_en,
      description_ar,
      description_en,
      keywords_ar,
      keywords_en,
      og_title_ar,
      og_title_en,
      og_desc_ar,
      og_desc_en
    } = req.body;
    try {
      db.prepare(`
        UPDATE seo_metadata SET 
          title_ar = ?, title_en = ?,
          description_ar = ?, description_en = ?,
          keywords_ar = ?, keywords_en = ?,
          og_title_ar = ?, og_title_en = ?,
          og_desc_ar = ?, og_desc_en = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        title_ar || "",
        title_en || "",
        description_ar || "",
        description_en || "",
        keywords_ar || "",
        keywords_en || "",
        og_title_ar || "",
        og_title_en || "",
        og_desc_ar || "",
        og_desc_en || "",
        req.params.id
      );
      const pageInfo = db.prepare("SELECT path FROM seo_metadata WHERE id = ?").get(req.params.id);
      const details = pageInfo ? `\u062A\u0639\u062F\u064A\u0644 \u0625\u0639\u062F\u0627\u062F\u0627\u062A SEO \u0644\u0635\u0641\u062D\u0629: ${pageInfo.path}` : `Updated SEO metadata for ID: ${req.params.id}`;
      logAudit(req.user.id, req.user.name, "UPDATE", "seo_metadata", details);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/images", authenticate, (req, res) => {
    try {
      const files = import_fs.default.existsSync(uploadDir) ? import_fs.default.readdirSync(uploadDir) : [];
      const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"];
      const imgFiles = files.filter((f) => imageExtensions.includes(import_path.default.extname(f).toLowerCase()));
      for (const filename of imgFiles) {
        const exists = db.prepare("SELECT 1 FROM image_metadata WHERE filename = ?").get(filename);
        if (!exists) {
          db.prepare("INSERT INTO image_metadata (filename, url, alt_text) VALUES (?, ?, ?)").run(filename, `/uploads/${filename}`, "");
        }
      }
      const images = db.prepare("SELECT * FROM image_metadata ORDER BY created_at DESC").all();
      res.json(images);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.put("/api/images/:id", authenticate, (req, res) => {
    const { alt_text } = req.body;
    try {
      db.prepare("UPDATE image_metadata SET alt_text = ? WHERE id = ?").run(alt_text, req.params.id);
      logAudit(req.user.id, req.user.name, "UPDATE", "image_metadata", `Updated alt text of image #${req.params.id} to: ${alt_text}`);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/system/metrics", authenticate, (req, res) => {
    try {
      const totalCalls = db.prepare("SELECT COUNT(*) as count FROM api_metrics").get();
      const endpointCalls = db.prepare(`
        SELECT endpoint, method, COUNT(*) as count, AVG(duration_ms) as avg_duration 
        FROM api_metrics 
        GROUP BY endpoint, method 
        ORDER BY count DESC
      `).all();
      const errorCalls = db.prepare(`
        SELECT COUNT(*) as count 
        FROM api_metrics 
        WHERE status >= 400
      `).get();
      const timeline = db.prepare(`
        SELECT strftime('%Y-%m-%d %H:00:00', timestamp) as hour, COUNT(*) as count, AVG(duration_ms) as avg_duration
        FROM api_metrics
        GROUP BY hour
        ORDER BY hour DESC
        LIMIT 24
      `).all();
      const recentErrors = db.prepare(`
        SELECT * FROM client_errors
        ORDER BY timestamp DESC
        LIMIT 20
      `).all();
      res.json({
        total: totalCalls?.count || 0,
        errors: errorCalls?.count || 0,
        endpoints: endpointCalls,
        timeline,
        clientErrors: recentErrors
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/content_overrides", (req, res) => {
    try {
      const blocks = db.prepare("SELECT * FROM content_blocks").all();
      const overrides = blocks.reduce((acc, block) => {
        acc[`${block.page}.${block.slug}.${block.block_key}`] = {
          en: block.content_en,
          ar: block.content_ar
        };
        return acc;
      }, {});
      res.json(overrides);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch overrides" });
    }
  });
  app.post("/api/auth/login", (req, res) => {
    try {
      const { email, password } = req.body;
      const user = db.prepare("SELECT * FROM cms_users WHERE email = ?").get(email);
      if (user && import_bcryptjs.default.compareSync(password, user.password_hash)) {
        const token = import_jsonwebtoken.default.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, {
          expiresIn: "24h"
        });
        db.prepare("UPDATE cms_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?").run(user.id);
        logAudit(user.id, user.name, "LOGIN", "auth", `User standard login: ${email}`);
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    } catch (e) {
      console.error("Login Error:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  const formLimiter = (0, import_express_rate_limit.default)({
    windowMs: 1 * 60 * 1e3,
    // 1 minute
    max: 5,
    message: { error: "Too many requests, please try again later." }
  });
  app.post("/api/inquiries", formLimiter, (req, res) => {
    const { entity, challenge, name, position, email, phone } = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO inquiries (entity, challenge, name, position, email, phone) 
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      stmt.run(entity, challenge, name, position, email, phone);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get("/api/inquiries", authenticate, (req, res) => {
    const inquiries = db.prepare("SELECT * FROM inquiries ORDER BY created_at DESC").all();
    res.json(inquiries);
  });
  app.put("/api/inquiries/:id/status", authenticate, (req, res) => {
    const { status } = req.body;
    try {
      db.prepare("UPDATE inquiries SET status = ? WHERE id = ?").run(status, req.params.id);
      logAudit(req.user.id, req.user.name, "UPDATE", "inquiries", `Updated status of inquiry #${req.params.id} to '${status}'`);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.post("/api/applications", formLimiter, (req, res) => {
    const { identity, email, phone, context } = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO talent_applications (identity, email, phone, context) 
        VALUES (?, ?, ?, ?)
      `);
      const info = stmt.run(identity, email, phone, context);
      res.json({ success: true, id: info.lastInsertRowid });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get("/api/applications", authenticate, (req, res) => {
    try {
      const apps = db.prepare("SELECT * FROM talent_applications ORDER BY created_at DESC").all();
      res.json(apps);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.patch("/api/applications/:id/status", authenticate, (req, res) => {
    const { status } = req.body;
    try {
      db.prepare("UPDATE talent_applications SET status = ? WHERE id = ?").run(status, req.params.id);
      logAudit(req.user.id, req.user.name, "UPDATE", "talent_applications", `Updated status of application #${req.params.id} to '${status}'`);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.post("/api/insight_readers", formLimiter, (req, res) => {
    const { name, email, organization, insight_id } = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO insight_readers (name, email, organization, insight_id) 
        VALUES (?, ?, ?, ?)
      `);
      stmt.run(name, email, organization, insight_id);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get("/api/insight_readers", authenticate, (req, res) => {
    const readers = db.prepare("SELECT r.*, i.title_en as insight_title FROM insight_readers r LEFT JOIN insights i ON r.insight_id = i.id ORDER BY download_time DESC").all();
    res.json(readers);
  });
  app.get("/api/insights_news", (req, res) => {
    const news = db.prepare("SELECT * FROM insights_news ORDER BY created_at DESC").all();
    res.json(news);
  });
  app.post("/api/insights_news", authenticate, (req, res) => {
    const { content_ar, content_en } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO insights_news (content_ar, content_en) VALUES (?, ?)");
      const result = stmt.run(content_ar || "", content_en || "");
      logAudit(req.user.id, req.user.name, "CREATE", "insights_news", `\u0625\u0636\u0627\u0641\u0629 \u062E\u0628\u0631 \u062C\u062F\u064A\u062F \u0641\u064A \u0627\u0644\u0634\u0631\u064A\u0637 \u0627\u0644\u0625\u062E\u0628\u0627\u0631\u064A`);
      res.json({ success: true, id: result.lastInsertRowid });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.put("/api/insights_news/:id", authenticate, (req, res) => {
    const { content_ar, content_en } = req.body;
    try {
      const stmt = db.prepare("UPDATE insights_news SET content_ar = ?, content_en = ? WHERE id = ?");
      stmt.run(content_ar || "", content_en || "", req.params.id);
      logAudit(req.user.id, req.user.name, "UPDATE", "insights_news", `\u062A\u0639\u062F\u064A\u0644 \u062E\u0628\u0631 \u0641\u064A \u0627\u0644\u0634\u0631\u064A\u0637 \u0627\u0644\u0625\u062E\u0628\u0627\u0631\u064A \u0630\u0648 \u0627\u0644\u0645\u0639\u0631\u0641: ${req.params.id}`);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.delete("/api/insights_news/:id", authenticate, requireAdmin, (req, res) => {
    try {
      const stmt = db.prepare("DELETE FROM insights_news WHERE id = ?");
      stmt.run(req.params.id);
      logAudit(req.user.id, req.user.name, "DELETE", "insights_news", `\u062D\u0630\u0641 \u062E\u0628\u0631 \u0645\u0646 \u0627\u0644\u0634\u0631\u064A\u0637 \u0627\u0644\u0625\u062E\u0628\u0627\u0631\u064A \u0630\u0648 \u0627\u0644\u0645\u0639\u0631\u0641: ${req.params.id}`);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get("/api/insights", (req, res) => {
    const insights = db.prepare("SELECT * FROM insights WHERE is_active = 1 ORDER BY published_at DESC").all();
    res.json(insights);
  });
  app.post("/api/insights", authenticate, upload.fields([{ name: "pdf", maxCount: 1 }, { name: "pdf_en", maxCount: 1 }, { name: "pdf_ar", maxCount: 1 }, { name: "image", maxCount: 1 }]), (req, res) => {
    const { title_ar, title_en, category_ar, category_en, summary_ar, summary_en } = req.body;
    try {
      const files = req.files;
      const pdf_path = files?.["pdf"] ? `/uploads/${files["pdf"][0].filename}` : null;
      const pdf_path_en = files?.["pdf_en"] ? `/uploads/${files["pdf_en"][0].filename}` : null;
      const pdf_path_ar = files?.["pdf_ar"] ? `/uploads/${files["pdf_ar"][0].filename}` : null;
      const image_path = files?.["image"] ? `/uploads/${files["image"][0].filename}` : null;
      const info = db.prepare(`
        INSERT INTO insights (title_ar, title_en, category_ar, category_en, summary_ar, summary_en, pdf_path, pdf_path_en, pdf_path_ar, image_path)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(title_ar, title_en, category_ar, category_en, summary_ar, summary_en, pdf_path, pdf_path_en, pdf_path_ar, image_path);
      logAudit(req.user.id, req.user.name, "CREATE", "insights", `Uploaded new insight: ${title_en}`);
      res.json({ success: true, id: info.lastInsertRowid });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.put("/api/insights/:id", authenticate, upload.fields([{ name: "pdf", maxCount: 1 }, { name: "pdf_en", maxCount: 1 }, { name: "pdf_ar", maxCount: 1 }, { name: "image", maxCount: 1 }]), (req, res) => {
    const { title_ar, title_en, category_ar, category_en, summary_ar, summary_en, remove_pdf, remove_pdf_en, remove_pdf_ar, remove_image } = req.body;
    try {
      const oldInsight = db.prepare("SELECT pdf_path, pdf_path_en, pdf_path_ar, image_path FROM insights WHERE id = ?").get(req.params.id);
      const safeUnlink = (p) => {
        if (!p) return;
        const targetPath = import_path.default.join(process.cwd(), p);
        if (import_fs.default.existsSync(targetPath)) {
          try {
            import_fs.default.unlinkSync(targetPath);
          } catch (e) {
          }
        }
      };
      const files = req.files;
      let updateFields = ["title_ar = ?", "title_en = ?", "category_ar = ?", "category_en = ?", "summary_ar = ?", "summary_en = ?"];
      let params = [title_ar, title_en, category_ar, category_en, summary_ar, summary_en];
      if (remove_pdf === "true" || files?.["pdf"]) {
        if (oldInsight?.pdf_path) safeUnlink(oldInsight.pdf_path);
      }
      if (remove_pdf_en === "true" || files?.["pdf_en"]) {
        if (oldInsight?.pdf_path_en) safeUnlink(oldInsight.pdf_path_en);
      }
      if (remove_pdf_ar === "true" || files?.["pdf_ar"]) {
        if (oldInsight?.pdf_path_ar) safeUnlink(oldInsight.pdf_path_ar);
      }
      if (remove_image === "true" || files?.["image"]) {
        if (oldInsight?.image_path) safeUnlink(oldInsight.image_path);
      }
      if (remove_pdf === "true") {
        updateFields.push("pdf_path = ?");
        params.push(null);
      } else if (files?.["pdf"]) {
        updateFields.push("pdf_path = ?");
        params.push(`/uploads/${files["pdf"][0].filename}`);
      }
      if (remove_pdf_en === "true") {
        updateFields.push("pdf_path_en = ?");
        params.push(null);
      } else if (files?.["pdf_en"]) {
        updateFields.push("pdf_path_en = ?");
        params.push(`/uploads/${files["pdf_en"][0].filename}`);
      }
      if (remove_pdf_ar === "true") {
        updateFields.push("pdf_path_ar = ?");
        params.push(null);
      } else if (files?.["pdf_ar"]) {
        updateFields.push("pdf_path_ar = ?");
        params.push(`/uploads/${files["pdf_ar"][0].filename}`);
      }
      if (remove_image === "true") {
        updateFields.push("image_path = ?");
        params.push(null);
      } else if (files?.["image"]) {
        updateFields.push("image_path = ?");
        params.push(`/uploads/${files["image"][0].filename}`);
      }
      params.push(req.params.id);
      db.prepare(`
        UPDATE insights SET ${updateFields.join(", ")} WHERE id = ?
      `).run(...params);
      logAudit(req.user.id, req.user.name, "UPDATE", "insights", `Updated insight ID: ${req.params.id}`);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.delete("/api/insights/:id", authenticate, requireAdmin, (req, res) => {
    try {
      const oldInsight = db.prepare("SELECT pdf_path, pdf_path_en, pdf_path_ar, image_path FROM insights WHERE id = ?").get(req.params.id);
      if (oldInsight) {
        const safeUnlink = (p) => {
          if (!p) return;
          const targetPath = import_path.default.join(process.cwd(), p);
          if (import_fs.default.existsSync(targetPath)) {
            try {
              import_fs.default.unlinkSync(targetPath);
            } catch (e) {
            }
          }
        };
        safeUnlink(oldInsight.pdf_path);
        safeUnlink(oldInsight.pdf_path_en);
        safeUnlink(oldInsight.pdf_path_ar);
        safeUnlink(oldInsight.image_path);
      }
      db.prepare("DELETE FROM insights WHERE id = ?").run(req.params.id);
      logAudit(req.user.id, req.user.name, "DELETE", "insights", `Deleted insight ID: ${req.params.id}`);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get("/api/content_blocks", (req, res) => {
    const blocks = db.prepare("SELECT * FROM content_blocks").all();
    res.json(blocks);
  });
  app.put("/api/content_blocks/:id", authenticate, (req, res) => {
    const { content_ar, content_en } = req.body;
    try {
      db.prepare("UPDATE content_blocks SET content_ar = ?, content_en = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(content_ar, content_en, req.user.id, req.params.id);
      const blockInfo = db.prepare("SELECT page, block_key FROM content_blocks WHERE id = ?").get(req.params.id);
      const details = blockInfo ? `\u062A\u0639\u062F\u064A\u0644 \u0645\u062D\u062A\u0648\u0649 \u0642\u0633\u0645 (${blockInfo.block_key}) \u0641\u064A \u0635\u0641\u062D\u0629 (${blockInfo.page})` : `Updated content block ID: ${req.params.id}`;
      logAudit(req.user.id, req.user.name, "UPDATE", "content_blocks", details);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.post("/api/content_blocks", authenticate, (req, res) => {
    const { page, slug, block_key, content_ar, content_en } = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO content_blocks (page, slug, block_key, content_ar, content_en, updated_by)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(page, slug, block_key) DO UPDATE SET
        content_ar = excluded.content_ar,
        content_en = excluded.content_en,
        updated_by = excluded.updated_by,
        updated_at = CURRENT_TIMESTAMP
      `);
      stmt.run(page, slug, block_key, content_ar, content_en, req.user.id);
      logAudit(req.user.id, req.user.name, "UPDATE", "content_blocks", `\u062A\u062D\u062F\u064A\u062B/\u0625\u0636\u0627\u0641\u0629 \u0645\u062D\u062A\u0648\u0649 \u0642\u0633\u0645 (${block_key}) \u0641\u064A \u0635\u0641\u062D\u0629 (${page})`);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get("/api/cms_users", authenticate, requireAdmin, (req, res) => {
    const users = db.prepare("SELECT id, name, email, role, last_login FROM cms_users").all();
    res.json(users);
  });
  app.post("/api/cms_users", authenticate, requireAdmin, (req, res) => {
    const { name, email, password } = req.body;
    try {
      const hash = import_bcryptjs.default.hashSync(password, 10);
      db.prepare("INSERT INTO cms_users (name, email, password_hash, role) VALUES (?, ?, ?, ?)").run(
        name,
        email,
        hash,
        "editor"
      );
      logAudit(req.user.id, req.user.name, "CREATE", "cms_users", `Registered CMS user: ${name} (${email}) with role 'editor'`);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.put("/api/cms_users/:id", authenticate, requireAdmin, (req, res) => {
    const { name, email, password } = req.body;
    try {
      const userToUpdate = db.prepare("SELECT * FROM cms_users WHERE id = ?").get(req.params.id);
      if (!userToUpdate) return res.status(404).json({ error: "User not found" });
      const finalRole = userToUpdate.role === "admin" ? "admin" : "editor";
      if (password) {
        const hash = import_bcryptjs.default.hashSync(password, 10);
        db.prepare("UPDATE cms_users SET name = ?, email = ?, password_hash = ?, role = ? WHERE id = ?").run(name, email, hash, finalRole, req.params.id);
      } else {
        db.prepare("UPDATE cms_users SET name = ?, email = ?, role = ? WHERE id = ?").run(name, email, finalRole, req.params.id);
      }
      logAudit(req.user.id, req.user.name, "UPDATE", "cms_users", `Updated CMS user: ${name}`);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.delete("/api/cms_users/:id", authenticate, requireAdmin, (req, res) => {
    try {
      const userToDelete = db.prepare("SELECT * FROM cms_users WHERE id = ?").get(req.params.id);
      if (!userToDelete) return res.status(404).json({ error: "User not found" });
      if (userToDelete.role === "admin") {
        return res.status(403).json({ error: "Cannot delete the Super Admin account." });
      }
      db.prepare("DELETE FROM cms_users WHERE id = ?").run(req.params.id);
      logAudit(req.user.id, req.user.name, "DELETE", "cms_users", `Deleted CMS user: ${userToDelete.email}`);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get("/api/settings/tourism-media", (req, res) => {
    try {
      const settings = db.prepare("SELECT * FROM global_settings").all();
      const settingsMap = settings.reduce((acc, row) => {
        acc[row.setting_key] = row.setting_value;
        return acc;
      }, {});
      res.json(settingsMap);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.post("/api/settings/tourism-media", authenticate, upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const { key } = req.body;
    const validKeys = ["tourism_logo_path", "tourism_favicon_path", "tourism_og_image_path", "gateway_logo_path"];
    if (!validKeys.includes(key)) return res.status(400).json({ error: "Invalid setting key" });
    try {
      const newPath = `/uploads/${req.file.filename}`;
      const oldSetting = db.prepare("SELECT setting_value FROM global_settings WHERE setting_key = ?").get(key);
      if (oldSetting && oldSetting.setting_value) {
        const oldFilePath = import_path.default.join(process.cwd(), oldSetting.setting_value);
        if (import_fs.default.existsSync(oldFilePath)) {
          try {
            import_fs.default.unlinkSync(oldFilePath);
          } catch (err) {
            console.error("Failed to delete old tourism media:", err);
          }
        }
      }
      db.prepare(`
        INSERT INTO global_settings (setting_key, setting_value)
        VALUES (?, ?)
        ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value
      `).run(key, newPath);
      logAudit(req.user.id, req.user.name, "UPDATE", "global_settings", `Updated tourism media: ${key}`);
      res.json({ message: "Media updated successfully", path: newPath });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });
  app.delete("/api/settings/tourism-media/:key", authenticate, (req, res) => {
    const { key } = req.params;
    const validKeys = ["tourism_logo_path", "tourism_favicon_path", "tourism_og_image_path", "gateway_logo_path"];
    if (!validKeys.includes(key)) return res.status(400).json({ error: "Invalid setting key" });
    try {
      const oldSetting = db.prepare("SELECT setting_value FROM global_settings WHERE setting_key = ?").get(key);
      if (oldSetting && oldSetting.setting_value) {
        const oldFilePath = import_path.default.join(process.cwd(), oldSetting.setting_value);
        if (import_fs.default.existsSync(oldFilePath)) {
          try {
            import_fs.default.unlinkSync(oldFilePath);
          } catch (err) {
            console.error("Failed to delete old tourism media:", err);
          }
        }
      }
      db.prepare("DELETE FROM global_settings WHERE setting_key = ?").run(key);
      logAudit(req.user.id, req.user.name, "DELETE", "global_settings", `Deleted tourism media: ${key}`);
      res.json({ message: "Media deleted successfully" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });
  app.post("/api/media/static", authenticate, upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const type = req.body.type;
    const validTypes = ["logo", "favicon", "og-image", "about"];
    if (!validTypes.includes(type)) return res.status(400).json({ error: "Invalid type" });
    const fileMap = {
      "logo": "logo.png",
      "favicon": "favicon.png",
      "og-image": "og-image.png",
      "about": "about.png"
    };
    const targetPath = import_path.default.join(process.cwd(), "public", fileMap[type]);
    try {
      import_fs.default.copyFileSync(req.file.path, targetPath);
      import_fs.default.unlinkSync(req.file.path);
      logAudit(req.user.id, req.user.name, "UPDATE", "static_media", `\u062A\u062D\u062F\u064A\u062B \u0635\u0648\u0631\u0629 \u0627\u0644\u0646\u0638\u0627\u0645 \u0627\u0644\u062B\u0627\u0628\u062A\u0629: ${type}`);
      res.json({ message: "File updated successfully", path: `/${fileMap[type]}` });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to save file" });
    }
  });
  app.delete("/api/media/static/:type", authenticate, (req, res) => {
    const type = req.params.type;
    const fileMap = {
      "logo": "logo.png",
      "favicon": "favicon.png",
      "og-image": "og-image.png",
      "about": "about.png"
    };
    if (!fileMap[type]) return res.status(400).json({ error: "Invalid type" });
    const targetPath = import_path.default.join(process.cwd(), "public", fileMap[type]);
    try {
      if (import_fs.default.existsSync(targetPath)) {
        import_fs.default.unlinkSync(targetPath);
      }
      logAudit(req.user.id, req.user.name, "DELETE", "static_media", `\u062D\u0630\u0641 \u0635\u0648\u0631\u0629 \u0627\u0644\u0646\u0638\u0627\u0645 \u0627\u0644\u062B\u0627\u0628\u062A\u0629: ${type}`);
      res.json({ message: "File deleted successfully" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to delete file" });
    }
  });
  app.get("/api/partners", (req, res) => {
    try {
      const partners = db.prepare("SELECT * FROM partners ORDER BY id ASC").all();
      res.json(partners);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch partners" });
    }
  });
  app.post("/api/partners", authenticate, upload.single("image"), (req, res) => {
    try {
      const { name } = req.body;
      if (!name || !req.file) return res.status(400).json({ error: "Name and image required" });
      const targetName = `partner_${Date.now()}_${req.file.originalname}`;
      const targetDir = import_path.default.join(process.cwd(), "public", "partners");
      if (!import_fs.default.existsSync(targetDir)) import_fs.default.mkdirSync(targetDir, { recursive: true });
      const targetPath = import_path.default.join(targetDir, targetName);
      import_fs.default.copyFileSync(req.file.path, targetPath);
      import_fs.default.unlinkSync(req.file.path);
      const src = `/partners/${targetName}`;
      const result = db.prepare("INSERT INTO partners (name, src) VALUES (?, ?)").run(name, src);
      logAudit(req.user.id, req.user.name, "CREATE", "partners", `\u0625\u0636\u0627\u0641\u0629 \u0634\u0631\u064A\u0643 \u0646\u062C\u0627\u062D \u062C\u062F\u064A\u062F: ${name}`);
      res.json({ id: result.lastInsertRowid, name, src });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to create partner" });
    }
  });
  app.put("/api/partners/:id", authenticate, upload.single("image"), (req, res) => {
    try {
      const { id } = req.params;
      const { name, remove_image } = req.body;
      let srcUpdate = "";
      const params = [name];
      if (req.file || remove_image === "true") {
        const oldPartner = db.prepare("SELECT src FROM partners WHERE id = ?").get(id);
        if (oldPartner && oldPartner.src) {
          const oldPath = import_path.default.join(process.cwd(), "public", oldPartner.src);
          if (import_fs.default.existsSync(oldPath)) {
            try {
              import_fs.default.unlinkSync(oldPath);
            } catch (e) {
            }
          }
        }
      }
      if (req.file) {
        const targetName = `partner_${Date.now()}_${req.file.originalname}`;
        const targetDir = import_path.default.join(process.cwd(), "public", "partners");
        if (!import_fs.default.existsSync(targetDir)) import_fs.default.mkdirSync(targetDir, { recursive: true });
        const targetPath = import_path.default.join(targetDir, targetName);
        import_fs.default.copyFileSync(req.file.path, targetPath);
        import_fs.default.unlinkSync(req.file.path);
        srcUpdate = ", src = ?";
        params.push(`/partners/${targetName}`);
      } else if (remove_image === "true") {
        srcUpdate = ", src = ?";
        params.push("");
      }
      params.push(id);
      db.prepare(`UPDATE partners SET name = ?${srcUpdate} WHERE id = ?`).run(...params);
      logAudit(req.user.id, req.user.name, "UPDATE", "partners", `\u062A\u0639\u062F\u064A\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0634\u0631\u064A\u0643: ${name}`);
      res.json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to update partner" });
    }
  });
  app.delete("/api/partners/:id", authenticate, (req, res) => {
    try {
      const { id } = req.params;
      const partner = db.prepare("SELECT src FROM partners WHERE id = ?").get(id);
      if (partner && partner.src) {
        const targetPath = import_path.default.join(process.cwd(), "public", partner.src);
        if (import_fs.default.existsSync(targetPath)) import_fs.default.unlinkSync(targetPath);
      }
      db.prepare("DELETE FROM partners WHERE id = ?").run(id);
      logAudit(req.user.id, req.user.name, "DELETE", "partners", `\u062D\u0630\u0641 \u0634\u0631\u064A\u0643 \u0627\u0644\u0646\u062C\u0627\u062D \u0630\u0648 \u0627\u0644\u0645\u0639\u0631\u0641: ${id}`);
      res.json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to delete partner" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  function checkAndRunAutoBackup() {
    try {
      const lastBackup = db.prepare("SELECT created_at FROM system_backups WHERE type = 'auto' ORDER BY created_at DESC LIMIT 1").get();
      const now = /* @__PURE__ */ new Date();
      if (lastBackup) {
        const lastBackupDate = /* @__PURE__ */ new Date(lastBackup.created_at + "Z");
        const hoursSinceLastBackup = Math.abs(now.getTime() - lastBackupDate.getTime()) / 36e5;
        if (hoursSinceLastBackup < 24) {
          return;
        }
      }
      const backupsDir = import_path.default.join(process.cwd(), "backups");
      if (!import_fs.default.existsSync(backupsDir)) {
        import_fs.default.mkdirSync(backupsDir);
      }
      const filename = `norm_auto_backup.tar.gz`;
      const archivePath = import_path.default.join(backupsDir, filename);
      (0, import_child_process.exec)(`tar -czf "${archivePath}" database.db uploads`, (error) => {
        if (error) {
          console.error("Auto-backup failed:", error);
          return;
        }
        try {
          db.prepare("DELETE FROM system_backups WHERE type = 'auto'").run();
          db.prepare("INSERT INTO system_backups (filename, type, created_by) VALUES (?, 'auto', 0)").run(filename);
          console.log("Automated daily backup completed successfully.");
        } catch (e) {
          console.error("Failed to log auto-backup in db", e);
        }
      });
    } catch (err) {
      console.error("Auto-backup check error:", err);
    }
  }
  setInterval(checkAndRunAutoBackup, 60 * 60 * 1e3);
  setTimeout(checkAndRunAutoBackup, 1e4);
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
