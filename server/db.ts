import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const { Pool } = pg;

const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/karin_medic';

const isLocalhost = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');

export const pool = new Pool({
  connectionString: dbUrl,
  connectionTimeoutMillis: 5000,
  ssl: isLocalhost ? false : { rejectUnauthorized: false },
});

export let isPostgresConnected = false;
export let postgresError: string | null = null;

// Local persistent file fallback for 100% resilience
const DATA_FILE = path.join(process.cwd(), 'server', 'data_store.json');

export interface LocalDataStore {
  schedule: {
    maxToiletVisits: number;
    hydrationTargetMl: number;
    adminNotes: string;
    warningThreshold: number;
    updatedAt: string;
  };
  messages: Array<{
    id: string;
    senderRole: 'patient' | 'admin';
    senderName: string;
    content: string;
    createdAt: string;
  }>;
  toiletLogs: Array<{
    id: string;
    type: number;
    painLevel: number;
    notes?: string;
    createdAt: string;
  }>;
  hydration: {
    waterGlasses: number;
    oralitGlasses: number;
    updatedAt: string;
  };
  users: {
    patientName: string;
    adminName: string;
    adminWa: string;
    patientAvatar?: string;
    adminAvatar?: string;
  };
}

export function loadLocalStore(): LocalDataStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading local data store:', err);
  }

  const initialStore: LocalDataStore = {
    schedule: {
      maxToiletVisits: 3,
      hydrationTargetMl: 2500,
      adminNotes: 'minum yang banya ya sayang, mamnya harus teratur supaya punya tenaga',
      warningThreshold: 4,
      updatedAt: new Date().toISOString(),
    },
    messages: [
      {
        id: '1',
        senderRole: 'admin',
        senderName: 'ODE',
        content: 'Halo Karin sayang ❤️ Aku sudah setting jadwal observasi hari ini ya. Kalau ada apa-apa langsung chat di sini!',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
    toiletLogs: [],
    hydration: {
      waterGlasses: 2,
      oralitGlasses: 1,
      updatedAt: new Date().toISOString(),
    },
    users: {
      patientName: 'Karin',
      adminName: 'Ode',
      adminWa: '6281234567890',
    },
  };

  saveLocalStore(initialStore);
  return initialStore;
}

export function saveLocalStore(data: LocalDataStore) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local data store:', err);
  }
}

export async function initPostgres() {
  try {
    const client = await pool.connect();
    isPostgresConnected = true;
    postgresError = null;
    console.log('✅ Berhasil terhubung ke PostgreSQL database!');

    // Initialize Schema
    await client.query(`
      CREATE TABLE IF NOT EXISTS toilet_schedule (
        id SERIAL PRIMARY KEY,
        max_toilet_visits INTEGER NOT NULL DEFAULT 3,
        hydration_target_ml INTEGER NOT NULL DEFAULT 2500,
        admin_notes TEXT,
        warning_threshold INTEGER NOT NULL DEFAULT 4,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS chat_messages (
        id VARCHAR(64) PRIMARY KEY,
        sender_role VARCHAR(20) NOT NULL,
        sender_name VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS toilet_logs (
        id VARCHAR(64) PRIMARY KEY,
        stool_type INTEGER NOT NULL,
        pain_level INTEGER NOT NULL,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS hydration_state (
        id SERIAL PRIMARY KEY,
        water_glasses INTEGER NOT NULL DEFAULT 0,
        oralit_glasses INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        patient_name VARCHAR(100) DEFAULT 'Karin',
        admin_name VARCHAR(100) DEFAULT 'Ode',
        admin_wa VARCHAR(50) DEFAULT '6281234567890',
        patient_avatar TEXT,
        admin_avatar TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert initial schedule if empty
    const scheduleCheck = await client.query('SELECT COUNT(*) FROM toilet_schedule');
    if (parseInt(scheduleCheck.rows[0].count, 10) === 0) {
      await client.query(`
        INSERT INTO toilet_schedule (max_toilet_visits, hydration_target_ml, admin_notes, warning_threshold)
        VALUES (3, 2500, 'minum yang banya ya sayang, mamnya harus teratur supaya punya tenaga'', 4)
      `);
    }

    client.release();
  } catch (err: any) {
    isPostgresConnected = false;
    postgresError = err.message;
    console.warn(`⚠️ PostgreSQL belum terhubung (${err.message}). Menggunakan penyimpanan data lokal otomatis.`);
  }
}
