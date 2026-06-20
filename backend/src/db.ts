import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';
import { generateTransactionData } from './generators';

const DB_PATH = path.join(__dirname, '..', 'data', 'cityguard.db');

let db: Database.Database;

function getRules(): { mfaThreshold: number; autoBlockThreshold: number } {
  const rules = db.prepare('SELECT mfaThreshold, autoBlockThreshold FROM security_rules ORDER BY id DESC LIMIT 1').get() as any;
  return rules || { mfaThreshold: 60, autoBlockThreshold: 85 };
}

export function getDb(): Database.Database {
  if (!db) {
    const fs = require('fs');
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema();
    seedData();
    resetTransactions();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'analyst',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      amount REAL NOT NULL,
      merchant TEXT NOT NULL,
      merchantCategory TEXT NOT NULL DEFAULT 'General',
      status TEXT NOT NULL DEFAULT 'Verified',
      riskScore INTEGER NOT NULL DEFAULT 0,
      timestamp TEXT NOT NULL,
      location TEXT NOT NULL,
      cardType TEXT NOT NULL,
      deviceType TEXT NOT NULL,
      explainReasons TEXT DEFAULT '[]',
      customerEmail TEXT NOT NULL,
      riskFactors TEXT DEFAULT '{"failedAttempts":0,"amountAnomaly":0,"geoAnomaly":0,"timeAnomaly":0,"deviceReputation":0}'
    );

    CREATE TABLE IF NOT EXISTS security_rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mfaThreshold INTEGER NOT NULL DEFAULT 60,
      autoBlockThreshold INTEGER NOT NULL DEFAULT 85,
      behavioralAnalysisEnabled INTEGER NOT NULL DEFAULT 1,
      geofenceEnforcement INTEGER NOT NULL DEFAULT 1,
      dynamicMfaEnabled INTEGER NOT NULL DEFAULT 1
    );
  `);

  // Migration: add riskFactors column if missing (for existing databases)
  try {
    db.exec('ALTER TABLE transactions ADD COLUMN riskFactors TEXT DEFAULT \'{"failedAttempts":0,"amountAnomaly":0,"geoAnomaly":0,"timeAnomaly":0,"deviceReputation":0}\'');
  } catch (e) {
    // Column already exists — safe to ignore
  }
}

function seedData() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    const hashedPassword = bcrypt.hashSync('analyst123', 10);
    db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)').run(
      'analyst@cityguard.ai',
      hashedPassword,
      'analyst'
    );
  }

  const rulesCount = db.prepare('SELECT COUNT(*) as count FROM security_rules').get() as { count: number };
  if (rulesCount.count === 0) {
    db.prepare(`INSERT INTO security_rules (mfaThreshold, autoBlockThreshold, behavioralAnalysisEnabled, geofenceEnforcement, dynamicMfaEnabled)
      VALUES (60, 85, 1, 1, 1)`).run();
  }
}

function resetTransactions() {
  db.prepare('DELETE FROM transactions').run();

  const rules = getRules();
  const insert = db.prepare(`INSERT INTO transactions (id, amount, merchant, merchantCategory, status, riskScore, timestamp, location, cardType, deviceType, explainReasons, customerEmail, riskFactors)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  const seedTx = db.transaction((count: number) => {
    for (let i = 0; i < count; i++) {
      const tx = generateTransactionData(rules.mfaThreshold, rules.autoBlockThreshold);
      insert.run(
        tx.id, tx.amount, tx.merchant, tx.merchantCategory, tx.status, tx.riskScore,
        tx.timestamp, tx.location, tx.cardType, tx.deviceType, tx.explainReasons, tx.customerEmail,
        tx.riskFactors
      );
    }
  });

  seedTx(5 + Math.floor(Math.random() * 2)); // 5 or 6 entries
}

export function closeDb() {
  if (db) {
    db.close();
  }
}
