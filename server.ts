import express from "express";
import path from "path";
import rateLimit from "express-rate-limit";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import { exec } from "child_process";

const JWT_SECRET = process.env.JWT_SECRET || "norm_super_secret_key_2026";
const PORT = process.env.PORT || 3000;

let db = new Database("database.db");

// Restore-mode lock: blocks all API traffic during 1-click restore
let isRestoring = false;

// Initialize Database Tables
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

// Seeding Default SEO Metadata Paths
const defaultPages = [
  { path: "/", title_en: "Home - NORM | Decision Architecture House", title_ar: "الرئيسية - نورم | دار هندسة القرار", description_en: "NORM House of Decision Architecture", description_ar: "دار هندسة القرار - نورم" },
  { path: "/about", title_en: "About NORM", title_ar: "عن نورم", description_en: "Learn about NORM, our methodology and mission", description_ar: "تعرف على نورم، منهجيتنا ورسالتنا" },
  { path: "/services", title_en: "Our Services", title_ar: "خدماتنا", description_en: "Explore consulting and strategic advisory options", description_ar: "استكشف الخدمات الاستشارية والتوجيه الاستراتيجي" },
  { path: "/contact", title_en: "Contact Us", title_ar: "اتصل بنا", description_en: "Get in touch with NORM office", description_ar: "تواصل مع مكتب نورم" },
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

// Audit Logger helper
function logAudit(userId: number, userName: string, action: string, resource: string, details: string) {
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

// Insert default admin if not exists
const defaultAdmin = db.prepare("SELECT * FROM cms_users WHERE email = ?").get("admin@norm.com");
if (!defaultAdmin) {
  const hash = bcrypt.hashSync("AdminNorm2026!", 10);
  db.prepare("INSERT INTO cms_users (name, email, password_hash, role) VALUES (?, ?, ?, ?)").run(
    "Super Admin", "admin@norm.com", hash, "admin"
  );
}

// Multer setup for PDF uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

async function startServer() {
  const app = express();
  
  app.use(express.json());
  app.use('/uploads', express.static(uploadDir));

  // Global 503 lock: all API requests are blocked during restore operation
  app.use((req, res, next) => {
    if (isRestoring && req.path.startsWith('/api') && req.path !== '/api/system/restore') {
      return res.status(503).json({ error: "Server is currently restoring a backup. Please wait." });
    }
    next();
  });

  // API Performance Metrics Logger Middleware
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      const endpoint = req.originalUrl || req.url;
      // Filter out non-api requests
      if (endpoint.startsWith("/api/")) {
        const method = req.method;
        const status = res.statusCode;
        try {
          db.prepare(`
            INSERT INTO api_metrics (endpoint, method, status, duration_ms)
            VALUES (?, ?, ?, ?)
          `).run(endpoint.split('?')[0], method, status, duration);
        } catch (e) {
          // ignore database busy or temporary lock errors
        }
      }
    });
    next();
  });

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
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

  const requireAdmin = (req: any, res: any, next: any) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.sendStatus(403);
    }
  };

  // JWT Token Verification Endpoint
  app.get("/api/auth/verify", authenticate, (req: any, res) => {
    res.json({ success: true, user: req.user });
  });

  /* =======================
        API ENDPOINTS
     ======================= */

  // Client side errors logging
  app.post("/api/client_errors", (req, res) => {
    const { message, stack, url, component } = req.body;
    try {
      db.prepare(`
        INSERT INTO client_errors (message, stack, url, component)
        VALUES (?, ?, ?, ?)
      `).run(message, stack, url, component || 'UnknownComponent');
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // System Backup Endpoints
  app.get("/api/system/backup/json", authenticate, requireAdmin, (req, res) => {
    try {
      const tables = [
        'cms_users', 'content_blocks', 'insights', 
        'inquiries', 'insight_readers', 'audit_logs', 
        'cms_audit_logs', 'seo_metadata', 'image_metadata', 
        'api_metrics', 'client_errors'
      ];
      const snapshot: Record<string, any[]> = {};
      for (const table of tables) {
        try {
          snapshot[table] = db.prepare(`SELECT * FROM ${table}`).all();
        } catch (e) {
          snapshot[table] = [];
        }
      }
      res.setHeader('Content-disposition', 'attachment; filename=database_backup.json');
      res.setHeader('Content-type', 'application/json');
      res.send(JSON.stringify(snapshot, null, 2));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ─── LOCAL DOWNLOAD: Full backup archive (database.db + uploads/ + public/) ───
  app.get("/api/system/backup/archive", authenticate, requireAdmin, (req, res) => {
    const archivePath = path.join(process.cwd(), `temp_download_${Date.now()}.tar.gz`);
    // Flush WAL to main DB file before archiving to ensure all recent writes are captured
    db.pragma('wal_checkpoint(TRUNCATE)');
    exec(`tar -czf "${archivePath}" database.db uploads public`, (error, stdout, stderr) => {
      if (error) {
        console.error("Tar compression failed:", error, stderr);
        return res.status(500).json({ error: "Failed to create compressed backup archive." });
      }
      res.download(archivePath, "norm_full_system_backup.tar.gz", () => {
        if (fs.existsSync(archivePath)) {
          try { fs.unlinkSync(archivePath); } catch (e) {}
        }
      });
    });
  });

  // ─── INTERNAL COPY: Static filename enforces max-1-copy rotation ───────────
  app.post("/api/system/backup/internal", authenticate, requireAdmin, (req: any, res) => {
    const backupsDir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(backupsDir)) fs.mkdirSync(backupsDir, { recursive: true });
    // Static filename = previous copy is automatically overwritten (max 1 retained)
    const filename = `norm_manual_backup.tar.gz`;
    const archivePath = path.join(backupsDir, filename);

    // Flush WAL to main DB file before archiving to ensure all recent writes are captured
    db.pragma('wal_checkpoint(TRUNCATE)');
    exec(`tar -czf "${archivePath}" database.db uploads public`, (error) => {
      if (error) return res.status(500).json({ error: "Failed to create internal backup." });
      try {
        // Keep only one manual record in DB
        db.prepare("DELETE FROM system_backups WHERE type = 'full'").run();
        db.prepare("INSERT INTO system_backups (filename, type, created_by) VALUES (?, ?, ?)").run(filename, 'full', req.user.id);
        logAudit(req.user.id, req.user.name, 'CREATE', 'system_backups', `حفظ نسخة احتياطية يدوية داخلية: ${filename}`);
        res.json({ success: true, filename });
      } catch (err: any) {
        res.status(500).json({ error: err.message });
      }
    });
  });

  // ─── RESTORE ENGINE: 4-Step 1-Click Disaster Recovery ────────────────────────
  app.post("/api/system/restore", authenticate, requireAdmin, (req: any, res) => {
    const backupsDir = path.join(process.cwd(), "backups");
    const archivePath = path.join(backupsDir, "norm_manual_backup.tar.gz");

    if (!fs.existsSync(archivePath)) {
      return res.status(404).json({ error: "No internal backup found. Please create a manual backup first." });
    }

    // STEP 1: Engage global 503 lock — blocks all other API traffic
    isRestoring = true;
    res.json({ success: true, message: "Restore initiated. Server will reload momentarily." });

    // STEP 2: Close SQLite connection safely to prevent SQLITE_BUSY corruption
    setTimeout(() => {
      try { db.close(); } catch (e) { console.error("DB close error:", e); }

      // Clean up lingering WAL/SHM files to prevent DB corruption on restore
      const walPath = path.join(process.cwd(), "database.db-wal");
      const shmPath = path.join(process.cwd(), "database.db-shm");
      if (fs.existsSync(walPath)) try { fs.unlinkSync(walPath); } catch (e) {}
      if (fs.existsSync(shmPath)) try { fs.unlinkSync(shmPath); } catch (e) {}

      // STEP 3: Extract archive over existing files (overwrites database.db, uploads/, public/)
      exec(`tar -xzf "${archivePath}" -C "${process.cwd()}"`, (error) => {
        if (error) {
          console.error("Restore extraction failed:", error);
          // Reopen DB even on failure to prevent permanent lock
          db = new Database("database.db");
          db.pragma("journal_mode = WAL");
          isRestoring = false;
          return;
        }

        // STEP 4: Reopen DB connection and release global lock
        db = new Database("database.db");
        db.pragma("journal_mode = WAL");
        isRestoring = false;
        console.log("[RESTORE] Disaster recovery completed successfully.");
      });
    }, 500);
  });

  // System Audit Logs Endpoint
  app.get("/api/system/audit_logs", authenticate, (req, res) => {
    try {
      const logs = db.prepare("SELECT * FROM audit_logs ORDER BY timestamp DESC").all();
      res.json(logs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Dynamic SEO Metadata Endpoints
  app.get("/api/seo", (req, res) => {
    try {
      const list = db.prepare("SELECT * FROM seo_metadata ORDER BY id ASC").all();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/seo", authenticate, (req: any, res) => {
    const { 
      path, title_ar, title_en, 
      description_ar, description_en, 
      keywords_ar, keywords_en, 
      og_title_ar, og_title_en, 
      og_desc_ar, og_desc_en 
    } = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO seo_metadata (
          path, title_ar, title_en, description_ar, description_en,
          keywords_ar, keywords_en, og_title_ar, og_title_en, og_desc_ar, og_desc_en
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const info = stmt.run(
        path,
        title_ar || '', title_en || '', 
        description_ar || '', description_en || '', 
        keywords_ar || '', keywords_en || '', 
        og_title_ar || '', og_title_en || '', 
        og_desc_ar || '', og_desc_en || ''
      );
      logAudit(req.user.id, req.user.name, 'CREATE', 'seo_metadata', `إضافة إعدادات SEO لصفحة: ${path}`);
      res.json({ success: true, id: info.lastInsertRowid });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/seo/:id", authenticate, (req: any, res) => {
    const { 
      title_ar, title_en, 
      description_ar, description_en, 
      keywords_ar, keywords_en, 
      og_title_ar, og_title_en, 
      og_desc_ar, og_desc_en 
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
        title_ar || '', title_en || '', 
        description_ar || '', description_en || '', 
        keywords_ar || '', keywords_en || '', 
        og_title_ar || '', og_title_en || '', 
        og_desc_ar || '', og_desc_en || '', 
        req.params.id
      );
      
      const pageInfo = db.prepare("SELECT path FROM seo_metadata WHERE id = ?").get(req.params.id) as any;
      const details = pageInfo ? `تعديل إعدادات SEO لصفحة: ${pageInfo.path}` : `Updated SEO metadata for ID: ${req.params.id}`;
      logAudit(req.user.id, req.user.name, 'UPDATE', 'seo_metadata', details);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Images Asset Alt-text Endpoints
  app.get("/api/images", authenticate, (req, res) => {
    try {
      const files = fs.existsSync(uploadDir) ? fs.readdirSync(uploadDir) : [];
      const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
      const imgFiles = files.filter(f => imageExtensions.includes(path.extname(f).toLowerCase()));
      
      // Auto insert any new image files
      for (const filename of imgFiles) {
        const exists = db.prepare("SELECT 1 FROM image_metadata WHERE filename = ?").get(filename);
        if (!exists) {
          db.prepare("INSERT INTO image_metadata (filename, url, alt_text) VALUES (?, ?, ?)")
            .run(filename, `/uploads/${filename}`, '');
        }
      }
      
      const images = db.prepare("SELECT * FROM image_metadata ORDER BY created_at DESC").all();
      res.json(images);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/images/:id", authenticate, (req: any, res) => {
    const { alt_text } = req.body;
    try {
      db.prepare("UPDATE image_metadata SET alt_text = ? WHERE id = ?").run(alt_text, req.params.id);
      logAudit(req.user.id, req.user.name, 'UPDATE', 'image_metadata', `Updated alt text of image #${req.params.id} to: ${alt_text}`);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Aggregated Performance metrics
  app.get("/api/system/metrics", authenticate, (req, res) => {
    try {
      const totalCalls = db.prepare("SELECT COUNT(*) as count FROM api_metrics").get() as any;
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
      `).get() as any;
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
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Public Content Overrides
  app.get("/api/content_overrides", (req, res) => {
    try {
      const blocks = db.prepare("SELECT * FROM content_blocks").all();
      const overrides = blocks.reduce((acc: any, block: any) => {
        acc[`${block.page}.${block.slug}.${block.block_key}`] = {
          en: block.content_en,
          ar: block.content_ar
        };
        return acc;
      }, {});
      res.json(overrides);
    } catch(e) {
      res.status(500).json({ error: "Failed to fetch overrides" });
    }
  });

  // Auth
  app.post("/api/auth/login", (req, res) => {
    try {
      const { email, password } = req.body;
      const user = db.prepare("SELECT * FROM cms_users WHERE email = ?").get(email) as any;
      
      if (user && bcrypt.compareSync(password, user.password_hash)) {
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, {
          expiresIn: "24h",
        });
        db.prepare("UPDATE cms_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?").run(user.id);
        logAudit(user.id, user.name, 'LOGIN', 'auth', `User standard login: ${email}`);
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    } catch (e: any) {
      console.error("Login Error:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Rate limiter for forms (Max 5 requests per minute)
  const formLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5,
    message: { error: "Too many requests, please try again later." }
  });

  // Inquiries (Public Submission, Protected Read)
  app.post("/api/inquiries", formLimiter, (req, res) => {
    const { entity, challenge, name, position, email, phone } = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO inquiries (entity, challenge, name, position, email, phone) 
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      stmt.run(entity, challenge, name, position, email, phone);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/inquiries", authenticate, (req, res) => {
    const inquiries = db.prepare("SELECT * FROM inquiries ORDER BY created_at DESC").all();
    res.json(inquiries);
  });

  app.put("/api/inquiries/:id/status", authenticate, (req: any, res) => {
    const { status } = req.body;
    try {
      db.prepare("UPDATE inquiries SET status = ? WHERE id = ?").run(status, req.params.id);
      logAudit(req.user.id, req.user.name, 'UPDATE', 'inquiries', `Updated status of inquiry #${req.params.id} to '${status}'`);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Talent Applications (Public Submission)
  app.post("/api/applications", formLimiter, (req, res) => {
    const { identity, email, phone, context } = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO talent_applications (identity, email, phone, context) 
        VALUES (?, ?, ?, ?)
      `);
      const info = stmt.run(identity, email, phone, context);
      res.json({ success: true, id: info.lastInsertRowid });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/applications", authenticate, (req, res) => {
    try {
      const apps = db.prepare("SELECT * FROM talent_applications ORDER BY created_at DESC").all();
      res.json(apps);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.patch("/api/applications/:id/status", authenticate, (req: any, res) => {
    const { status } = req.body;
    try {
      db.prepare("UPDATE talent_applications SET status = ? WHERE id = ?").run(status, req.params.id);
      logAudit(req.user.id, req.user.name, 'UPDATE', 'talent_applications', `Updated status of application #${req.params.id} to '${status}'`);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Insight Readers (Public Submission, Protected Read)
  app.post("/api/insight_readers", formLimiter, (req, res) => {
    const { name, email, organization, insight_id } = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO insight_readers (name, email, organization, insight_id) 
        VALUES (?, ?, ?, ?)
      `);
      stmt.run(name, email, organization, insight_id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/insight_readers", authenticate, (req, res) => {
    const readers = db.prepare("SELECT r.*, i.title_en as insight_title FROM insight_readers r LEFT JOIN insights i ON r.insight_id = i.id ORDER BY download_time DESC").all();
    res.json(readers);
  });

  // Insights News
  app.get("/api/insights_news", (req, res) => {
    const news = db.prepare("SELECT * FROM insights_news ORDER BY created_at DESC").all();
    res.json(news);
  });

  app.post("/api/insights_news", authenticate, (req: any, res) => {
    const { content_ar, content_en } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO insights_news (content_ar, content_en) VALUES (?, ?)");
      const result = stmt.run(content_ar || '', content_en || '');
      logAudit(req.user.id, req.user.name, 'CREATE', 'insights_news', `إضافة خبر جديد في الشريط الإخباري`);
      res.json({ success: true, id: result.lastInsertRowid });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/insights_news/:id", authenticate, (req: any, res) => {
    const { content_ar, content_en } = req.body;
    try {
      const stmt = db.prepare("UPDATE insights_news SET content_ar = ?, content_en = ? WHERE id = ?");
      stmt.run(content_ar || '', content_en || '', req.params.id);
      logAudit(req.user.id, req.user.name, 'UPDATE', 'insights_news', `تعديل خبر في الشريط الإخباري ذو المعرف: ${req.params.id}`);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/insights_news/:id", authenticate, requireAdmin, (req: any, res) => {
    try {
      const stmt = db.prepare("DELETE FROM insights_news WHERE id = ?");
      stmt.run(req.params.id);
      logAudit(req.user.id, req.user.name, 'DELETE', 'insights_news', `حذف خبر من الشريط الإخباري ذو المعرف: ${req.params.id}`);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Insights (Public Read, Protected Write)
  app.get("/api/insights", (req, res) => {
    const insights = db.prepare("SELECT * FROM insights WHERE is_active = 1 ORDER BY published_at DESC").all();
    res.json(insights);
  });

  app.post("/api/insights", authenticate, upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'pdf_en', maxCount: 1 }, { name: 'pdf_ar', maxCount: 1 }, { name: 'image', maxCount: 1 }]), (req: any, res) => {
    const { title_ar, title_en, category_ar, category_en, summary_ar, summary_en } = req.body;
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const pdf_path = files?.['pdf'] ? `/uploads/${files['pdf'][0].filename}` : null;
      const pdf_path_en = files?.['pdf_en'] ? `/uploads/${files['pdf_en'][0].filename}` : null;
      const pdf_path_ar = files?.['pdf_ar'] ? `/uploads/${files['pdf_ar'][0].filename}` : null;
      const image_path = files?.['image'] ? `/uploads/${files['image'][0].filename}` : null;
      
      const info = db.prepare(`
        INSERT INTO insights (title_ar, title_en, category_ar, category_en, summary_ar, summary_en, pdf_path, pdf_path_en, pdf_path_ar, image_path)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(title_ar, title_en, category_ar, category_en, summary_ar, summary_en, pdf_path, pdf_path_en, pdf_path_ar, image_path);
      
      logAudit(req.user.id, req.user.name, 'CREATE', 'insights', `Uploaded new insight: ${title_en}`);
      res.json({ success: true, id: info.lastInsertRowid });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/insights/:id", authenticate, upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'pdf_en', maxCount: 1 }, { name: 'pdf_ar', maxCount: 1 }, { name: 'image', maxCount: 1 }]), (req: any, res) => {
    const { title_ar, title_en, category_ar, category_en, summary_ar, summary_en, remove_pdf, remove_pdf_en, remove_pdf_ar, remove_image } = req.body;
    try {
      const oldInsight = db.prepare("SELECT pdf_path, pdf_path_en, pdf_path_ar, image_path FROM insights WHERE id = ?").get(req.params.id) as any;
      const safeUnlink = (p: string | null) => {
        if (!p) return;
        const targetPath = path.join(process.cwd(), p);
        if (fs.existsSync(targetPath)) {
          try { fs.unlinkSync(targetPath); } catch (e) {}
        }
      };

      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      let updateFields = ["title_ar = ?", "title_en = ?", "category_ar = ?", "category_en = ?", "summary_ar = ?", "summary_en = ?"];
      let params: any[] = [title_ar, title_en, category_ar, category_en, summary_ar, summary_en];

      if (remove_pdf === 'true' || files?.['pdf']) {
        if (oldInsight?.pdf_path) safeUnlink(oldInsight.pdf_path);
      }
      if (remove_pdf_en === 'true' || files?.['pdf_en']) {
        if (oldInsight?.pdf_path_en) safeUnlink(oldInsight.pdf_path_en);
      }
      if (remove_pdf_ar === 'true' || files?.['pdf_ar']) {
        if (oldInsight?.pdf_path_ar) safeUnlink(oldInsight.pdf_path_ar);
      }
      if (remove_image === 'true' || files?.['image']) {
        if (oldInsight?.image_path) safeUnlink(oldInsight.image_path);
      }

      if (remove_pdf === 'true') {
        updateFields.push("pdf_path = ?");
        params.push(null);
      } else if (files?.['pdf']) {
        updateFields.push("pdf_path = ?");
        params.push(`/uploads/${files['pdf'][0].filename}`);
      }

      if (remove_pdf_en === 'true') {
        updateFields.push("pdf_path_en = ?");
        params.push(null);
      } else if (files?.['pdf_en']) {
        updateFields.push("pdf_path_en = ?");
        params.push(`/uploads/${files['pdf_en'][0].filename}`);
      }

      if (remove_pdf_ar === 'true') {
        updateFields.push("pdf_path_ar = ?");
        params.push(null);
      } else if (files?.['pdf_ar']) {
        updateFields.push("pdf_path_ar = ?");
        params.push(`/uploads/${files['pdf_ar'][0].filename}`);
      }

      if (remove_image === 'true') {
        updateFields.push("image_path = ?");
        params.push(null);
      } else if (files?.['image']) {
        updateFields.push("image_path = ?");
        params.push(`/uploads/${files['image'][0].filename}`);
      }
      
      params.push(req.params.id);
      db.prepare(`
        UPDATE insights SET ${updateFields.join(", ")} WHERE id = ?
      `).run(...params);
      
      logAudit(req.user.id, req.user.name, 'UPDATE', 'insights', `Updated insight ID: ${req.params.id}`);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/insights/:id", authenticate, requireAdmin, (req: any, res) => {
    try {
      const oldInsight = db.prepare("SELECT pdf_path, pdf_path_en, pdf_path_ar, image_path FROM insights WHERE id = ?").get(req.params.id) as any;
      if (oldInsight) {
        const safeUnlink = (p: string | null) => {
          if (!p) return;
          const targetPath = path.join(process.cwd(), p);
          if (fs.existsSync(targetPath)) {
            try { fs.unlinkSync(targetPath); } catch (e) {}
          }
        };
        safeUnlink(oldInsight.pdf_path);
        safeUnlink(oldInsight.pdf_path_en);
        safeUnlink(oldInsight.pdf_path_ar);
        safeUnlink(oldInsight.image_path);
      }

      db.prepare("DELETE FROM insights WHERE id = ?").run(req.params.id);
      logAudit(req.user.id, req.user.name, 'DELETE', 'insights', `Deleted insight ID: ${req.params.id}`);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Content Blocks (Public Read, Protected Write)
  app.get("/api/content_blocks", (req, res) => {
    const blocks = db.prepare("SELECT * FROM content_blocks").all();
    res.json(blocks);
  });

  app.put("/api/content_blocks/:id", authenticate, (req: any, res) => {
    const { content_ar, content_en } = req.body;
    try {
      db.prepare("UPDATE content_blocks SET content_ar = ?, content_en = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(content_ar, content_en, req.user.id, req.params.id);
      const blockInfo = db.prepare("SELECT page, block_key FROM content_blocks WHERE id = ?").get(req.params.id) as any;
      const details = blockInfo ? `تعديل محتوى قسم (${blockInfo.block_key}) في صفحة (${blockInfo.page})` : `Updated content block ID: ${req.params.id}`;
      logAudit(req.user.id, req.user.name, 'UPDATE', 'content_blocks', details);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/content_blocks", authenticate, (req: any, res) => {
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
      logAudit(req.user.id, req.user.name, 'UPDATE', 'content_blocks', `تحديث/إضافة محتوى قسم (${block_key}) في صفحة (${page})`);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // CMS Users (Protected - Admin only)
  app.get("/api/cms_users", authenticate, requireAdmin, (req, res) => {
    const users = db.prepare("SELECT id, name, email, role, last_login FROM cms_users").all();
    res.json(users);
  });
  
  app.post("/api/cms_users", authenticate, requireAdmin, (req: any, res) => {
    const { name, email, password } = req.body;
    try {
      const hash = bcrypt.hashSync(password, 10);
      db.prepare("INSERT INTO cms_users (name, email, password_hash, role) VALUES (?, ?, ?, ?)").run(
        name, email, hash, 'editor'
      );
      logAudit(req.user.id, req.user.name, 'CREATE', 'cms_users', `Registered CMS user: ${name} (${email}) with role 'editor'`);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/cms_users/:id", authenticate, requireAdmin, (req: any, res) => {
    const { name, email, password } = req.body;
    try {
      const userToUpdate = db.prepare("SELECT * FROM cms_users WHERE id = ?").get(req.params.id) as any;
      if (!userToUpdate) return res.status(404).json({ error: "User not found" });

      const finalRole = userToUpdate.role === 'admin' ? 'admin' : 'editor';

      if (password) {
        const hash = bcrypt.hashSync(password, 10);
        db.prepare("UPDATE cms_users SET name = ?, email = ?, password_hash = ?, role = ? WHERE id = ?").run(name, email, hash, finalRole, req.params.id);
      } else {
        db.prepare("UPDATE cms_users SET name = ?, email = ?, role = ? WHERE id = ?").run(name, email, finalRole, req.params.id);
      }
      logAudit(req.user.id, req.user.name, 'UPDATE', 'cms_users', `Updated CMS user: ${name}`);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/cms_users/:id", authenticate, requireAdmin, (req: any, res) => {
    try {
      const userToDelete = db.prepare("SELECT * FROM cms_users WHERE id = ?").get(req.params.id) as any;
      if (!userToDelete) return res.status(404).json({ error: "User not found" });
      if (userToDelete.role === 'admin') {
        return res.status(403).json({ error: "Cannot delete the Super Admin account." });
      }

      db.prepare("DELETE FROM cms_users WHERE id = ?").run(req.params.id);
      logAudit(req.user.id, req.user.name, 'DELETE', 'cms_users', `Deleted CMS user: ${userToDelete.email}`);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });


  // --- Settings Endpoints ---
  app.get("/api/settings/tourism-media", (req, res) => {
    try {
      const settings = db.prepare("SELECT * FROM global_settings").all();
      const settingsMap = settings.reduce((acc: any, row: any) => {
        acc[row.setting_key] = row.setting_value;
        return acc;
      }, {});
      res.json(settingsMap);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/settings/tourism-media", authenticate, upload.single("image"), (req: any, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const { key } = req.body;
    const validKeys = ["tourism_logo_path", "tourism_favicon_path", "tourism_og_image_path", "gateway_logo_path"];
    if (!validKeys.includes(key)) return res.status(400).json({ error: "Invalid setting key" });

    try {
      const newPath = `/uploads/${req.file.filename}`;
      const oldSetting = db.prepare("SELECT setting_value FROM global_settings WHERE setting_key = ?").get(key) as any;
      
      if (oldSetting && oldSetting.setting_value) {
        const oldFilePath = path.join(process.cwd(), oldSetting.setting_value);
        if (fs.existsSync(oldFilePath)) {
          try {
            fs.unlinkSync(oldFilePath);
          } catch(err) {
            console.error("Failed to delete old tourism media:", err);
          }
        }
      }

      db.prepare(`
        INSERT INTO global_settings (setting_key, setting_value)
        VALUES (?, ?)
        ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value
      `).run(key, newPath);

      logAudit(req.user.id, req.user.name, 'UPDATE', 'global_settings', `Updated tourism media: ${key}`);
      res.json({ message: "Media updated successfully", path: newPath });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/settings/tourism-media/:key", authenticate, (req: any, res) => {
    const { key } = req.params;
    const validKeys = ["tourism_logo_path", "tourism_favicon_path", "tourism_og_image_path", "gateway_logo_path"];
    if (!validKeys.includes(key)) return res.status(400).json({ error: "Invalid setting key" });

    try {
      const oldSetting = db.prepare("SELECT setting_value FROM global_settings WHERE setting_key = ?").get(key) as any;
      
      if (oldSetting && oldSetting.setting_value) {
        const oldFilePath = path.join(process.cwd(), oldSetting.setting_value);
        if (fs.existsSync(oldFilePath)) {
          try {
            fs.unlinkSync(oldFilePath);
          } catch(err) {
            console.error("Failed to delete old tourism media:", err);
          }
        }
      }

      db.prepare("DELETE FROM global_settings WHERE setting_key = ?").run(key);

      logAudit(req.user.id, req.user.name, 'DELETE', 'global_settings', `Deleted tourism media: ${key}`);
      res.json({ message: "Media deleted successfully" });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // --- Media & Partners Endpoints ---
  app.post("/api/media/static", authenticate, upload.single("image"), (req: any, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const type = req.body.type;
    const validTypes = ["logo", "favicon", "og-image", "about", "gate-logo"];
    if (!validTypes.includes(type)) return res.status(400).json({ error: "Invalid type" });

    // Map type to target filename
    const fileMap: any = {
      "logo": "logo.png",
      "favicon": "favicon.png",
      "og-image": "og-image.png",
      "about": "about.png",
      "gate-logo": "logo-gate.png"
    };

    const targetPath = path.join(process.cwd(), "public", fileMap[type]);
    try {
      fs.copyFileSync(req.file.path, targetPath);
      // Clean up uploaded temp file
      fs.unlinkSync(req.file.path);
      logAudit(req.user.id, req.user.name, 'UPDATE', 'static_media', `تحديث صورة النظام الثابتة: ${type}`);
      res.json({ message: "File updated successfully", path: `/${fileMap[type]}` });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to save file" });
    }
  });

  app.delete("/api/media/static/:type", authenticate, (req: any, res) => {
    const type = req.params.type;
    const fileMap: any = {
      "logo": "logo.png",
      "favicon": "favicon.png",
      "og-image": "og-image.png",
      "about": "about.png",
      "gate-logo": "logo-gate.png"
    };
    if (!fileMap[type]) return res.status(400).json({ error: "Invalid type" });
    const targetPath = path.join(process.cwd(), "public", fileMap[type]);
    try {
      if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath);
      }
      logAudit(req.user.id, req.user.name, 'DELETE', 'static_media', `حذف صورة النظام الثابتة: ${type}`);
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

  app.post("/api/partners", authenticate, upload.single("image"), (req: any, res) => {
    try {
      const { name } = req.body;
      if (!name || !req.file) return res.status(400).json({ error: "Name and image required" });
      
      const targetName = `partner_${Date.now()}_${req.file.originalname}`;
      const targetDir = path.join(process.cwd(), "public", "partners");
      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
      
      const targetPath = path.join(targetDir, targetName);
      fs.copyFileSync(req.file.path, targetPath);
      fs.unlinkSync(req.file.path);
      
      const src = `/partners/${targetName}`;
      const result = db.prepare("INSERT INTO partners (name, src) VALUES (?, ?)").run(name, src);
      logAudit(req.user.id, req.user.name, 'CREATE', 'partners', `إضافة شريك نجاح جديد: ${name}`);
      res.json({ id: result.lastInsertRowid, name, src });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to create partner" });
    }
  });

  app.put("/api/partners/:id", authenticate, upload.single("image"), (req: any, res) => {
    try {
      const { id } = req.params;
      const { name, remove_image } = req.body;
      let srcUpdate = "";
      const params: any[] = [name];

      if (req.file || remove_image === 'true') {
        // Unlink old partner image
        const oldPartner = db.prepare("SELECT src FROM partners WHERE id = ?").get(id) as any;
        if (oldPartner && oldPartner.src) {
          const oldPath = path.join(process.cwd(), "public", oldPartner.src);
          if (fs.existsSync(oldPath)) {
            try { fs.unlinkSync(oldPath); } catch (e) {}
          }
        }
      }

      if (req.file) {
        const targetName = `partner_${Date.now()}_${req.file.originalname}`;
        const targetDir = path.join(process.cwd(), "public", "partners");
        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
        const targetPath = path.join(targetDir, targetName);
        fs.copyFileSync(req.file.path, targetPath);
        fs.unlinkSync(req.file.path);
        
        srcUpdate = ", src = ?";
        params.push(`/partners/${targetName}`);
      } else if (remove_image === 'true') {
        srcUpdate = ", src = ?";
        params.push("");
      }

      params.push(id);
      db.prepare(`UPDATE partners SET name = ?${srcUpdate} WHERE id = ?`).run(...params);
      logAudit(req.user.id, req.user.name, 'UPDATE', 'partners', `تعديل بيانات الشريك: ${name}`);
      res.json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to update partner" });
    }
  });

  app.delete("/api/partners/:id", authenticate, (req: any, res) => {
    try {
      const { id } = req.params;
      const partner = db.prepare("SELECT src FROM partners WHERE id = ?").get(id) as any;
      if (partner && partner.src) {
        const targetPath = path.join(process.cwd(), "public", partner.src);
        if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);
      }
      db.prepare("DELETE FROM partners WHERE id = ?").run(id);
      logAudit(req.user.id, req.user.name, 'DELETE', 'partners', `حذف شريك النجاح ذو المعرف: ${id}`);
      res.json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to delete partner" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Automated Daily Backup System
  function checkAndRunAutoBackup() {
    try {
      const lastBackup = db.prepare("SELECT created_at FROM system_backups WHERE type = 'auto' ORDER BY created_at DESC LIMIT 1").get() as any;
      const now = new Date();
      
      if (lastBackup) {
        // In SQLite CURRENT_TIMESTAMP is UTC format "YYYY-MM-DD HH:MM:SS"
        // Force it to parse correctly as UTC
        const lastBackupDate = new Date(lastBackup.created_at + "Z");
        const hoursSinceLastBackup = Math.abs(now.getTime() - lastBackupDate.getTime()) / 36e5;
        if (hoursSinceLastBackup < 24) {
          return; // Already backed up in the last 24 hours
        }
      }
      
      const backupsDir = path.join(process.cwd(), "backups");
      if (!fs.existsSync(backupsDir)) {
        fs.mkdirSync(backupsDir);
      }
      // We use a static filename for auto-backups to automatically overwrite the old one (preventing storage overload)
      const filename = `norm_auto_backup.tar.gz`;
      const archivePath = path.join(backupsDir, filename);

      // Flush WAL to main DB file before archiving to ensure all recent writes are captured
      db.pragma('wal_checkpoint(TRUNCATE)');
      exec(`tar -czf "${archivePath}" database.db uploads public`, (error) => {
        if (error) {
          console.error("Auto-backup failed:", error);
          return;
        }
        try {
          db.prepare("DELETE FROM system_backups WHERE type = 'auto'").run();
          db.prepare("INSERT INTO system_backups (filename, type, created_by) VALUES (?, 'auto', 0)").run(filename);
          console.log("Automated daily backup completed successfully.");
        } catch(e) {
          console.error("Failed to log auto-backup in db", e);
        }
      });
    } catch (err) {
      console.error("Auto-backup check error:", err);
    }
  }
  // Check auto-backup status every hour
  setInterval(checkAndRunAutoBackup, 60 * 60 * 1000);
  // Check 10 seconds after server starts
  setTimeout(checkAndRunAutoBackup, 10000);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
