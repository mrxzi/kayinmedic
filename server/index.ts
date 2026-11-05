import express from 'express';
import cors from 'cors';
import { 
  pool, 
  initPostgres, 
  isPostgresConnected, 
  postgresError, 
  loadLocalStore, 
  saveLocalStore 
} from './db';
import { testS3Connection, isS3Configured } from './storage';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize DB on boot
initPostgres();

// 1. Health, Database & Neon Storage Status
app.get('/api/status', async (req, res) => {
  const s3Status = await testS3Connection();
  res.json({
    status: 'ok',
    postgresConnected: isPostgresConnected,
    postgresError: postgresError,
    neonS3Configured: isS3Configured,
    neonS3Connected: s3Status.success,
    neonS3Error: s3Status.error || null,
    provider: 'Neon Cloud (Serverless PostgreSQL + S3 Storage)',
    timestamp: new Date().toISOString(),
  });
});

// 2. Schedule: Get & Set by Admin
app.get('/api/schedule', async (req, res) => {
  try {
    if (isPostgresConnected) {
      const result = await pool.query('SELECT * FROM toilet_schedule ORDER BY id DESC LIMIT 1');
      if (result.rows.length > 0) {
        const row = result.rows[0];
        return res.json({
          maxToiletVisits: row.max_toilet_visits,
          hydrationTargetMl: row.hydration_target_ml,
          adminNotes: row.admin_notes,
          warningThreshold: row.warning_threshold,
          updatedAt: row.updated_at,
        });
      }
    }
  } catch (err) {
    console.warn('DB query fallback for schedule');
  }

  const store = loadLocalStore();
  res.json(store.schedule);
});

app.post('/api/schedule', async (req, res) => {
  const { maxToiletVisits, hydrationTargetMl, adminNotes, warningThreshold } = req.body;
  const store = loadLocalStore();
  
  store.schedule = {
    maxToiletVisits: Number(maxToiletVisits) || 3,
    hydrationTargetMl: Number(hydrationTargetMl) || 2500,
    adminNotes: adminNotes || '',
    warningThreshold: Number(warningThreshold) || (Number(maxToiletVisits) + 1),
    updatedAt: new Date().toISOString(),
  };
  saveLocalStore(store);

  if (isPostgresConnected) {
    try {
      await pool.query(
        `INSERT INTO toilet_schedule (max_toilet_visits, hydration_target_ml, admin_notes, warning_threshold, updated_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [store.schedule.maxToiletVisits, store.schedule.hydrationTargetMl, store.schedule.adminNotes, store.schedule.warningThreshold]
      );
    } catch (err) {
      console.error('Postgres schedule insert error:', err);
    }
  }

  res.json({ success: true, schedule: store.schedule });
});

// 3. In-App Direct Chat Messages
app.get('/api/messages', async (req, res) => {
  try {
    if (isPostgresConnected) {
      const result = await pool.query('SELECT * FROM chat_messages ORDER BY created_at ASC');
      const messages = result.rows.map(r => ({
        id: r.id,
        senderRole: r.sender_role,
        senderName: r.sender_name,
        content: r.content,
        createdAt: r.created_at,
      }));
      return res.json(messages);
    }
  } catch (err) {
    console.warn('DB query fallback for messages');
  }

  const store = loadLocalStore();
  res.json(store.messages);
});

app.post('/api/messages', async (req, res) => {
  const { senderRole, senderName, content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  const newMessage = {
    id: Date.now().toString(),
    senderRole: senderRole === 'admin' ? 'admin' : 'patient',
    senderName: senderName || (senderRole === 'admin' ? 'Pendamping' : 'Pasien'),
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };

  const store = loadLocalStore();
  store.messages.push(newMessage);
  saveLocalStore(store);

  if (isPostgresConnected) {
    try {
      await pool.query(
        `INSERT INTO chat_messages (id, sender_role, sender_name, content, created_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [newMessage.id, newMessage.senderRole, newMessage.senderName, newMessage.content, newMessage.createdAt]
      );
    } catch (err) {
      console.error('Postgres message insert error:', err);
    }
  }

  res.json({ success: true, message: newMessage });
});

app.delete('/api/messages', async (req, res) => {
  const store = loadLocalStore();
  store.messages = [];
  saveLocalStore(store);

  if (isPostgresConnected) {
    try {
      await pool.query('DELETE FROM chat_messages');
    } catch (err) {
      console.error('Postgres messages delete error:', err);
    }
  }

  res.json({ success: true, message: 'All chat messages cleared successfully' });
});

// 4. Toilet & Bristol Logs
app.get('/api/logs', async (req, res) => {
  try {
    if (isPostgresConnected) {
      const result = await pool.query('SELECT * FROM toilet_logs ORDER BY created_at DESC');
      const logs = result.rows.map(r => ({
        id: r.id,
        type: r.stool_type,
        painLevel: r.pain_level,
        notes: r.notes,
        createdAt: r.created_at,
      }));
      return res.json(logs);
    }
  } catch (err) {
    console.warn('DB query fallback for logs');
  }

  const store = loadLocalStore();
  res.json(store.toiletLogs);
});

app.post('/api/logs', async (req, res) => {
  const { type, painLevel, notes } = req.body;
  const newLog = {
    id: Date.now().toString(),
    type: Number(type) || 4,
    painLevel: Number(painLevel) || 2,
    notes: notes?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  const store = loadLocalStore();
  store.toiletLogs.unshift(newLog);
  saveLocalStore(store);

  if (isPostgresConnected) {
    try {
      await pool.query(
        `INSERT INTO toilet_logs (id, stool_type, pain_level, notes, created_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [newLog.id, newLog.type, newLog.painLevel, newLog.notes || null, newLog.createdAt]
      );
    } catch (err) {
      console.error('Postgres log insert error:', err);
    }
  }

  res.json({ success: true, log: newLog });
});

app.delete('/api/logs/:id', async (req, res) => {
  const { id } = req.params;
  const store = loadLocalStore();
  store.toiletLogs = store.toiletLogs.filter(l => l.id !== id);
  saveLocalStore(store);

  if (isPostgresConnected) {
    try {
      await pool.query('DELETE FROM toilet_logs WHERE id = $1', [id]);
    } catch (err) {
      console.error('Postgres log delete error:', err);
    }
  }

  res.json({ success: true });
});

// 5. Hydration state
app.get('/api/hydration', async (req, res) => {
  const store = loadLocalStore();
  res.json(store.hydration);
});

app.post('/api/hydration', async (req, res) => {
  const { waterGlasses, oralitGlasses } = req.body;
  const store = loadLocalStore();
  store.hydration = {
    waterGlasses: Number(waterGlasses) >= 0 ? Number(waterGlasses) : store.hydration.waterGlasses,
    oralitGlasses: Number(oralitGlasses) >= 0 ? Number(oralitGlasses) : store.hydration.oralitGlasses,
    updatedAt: new Date().toISOString(),
  };
  saveLocalStore(store);

  res.json({ success: true, hydration: store.hydration });
});

// 6. Profiles & Avatars
app.get('/api/profiles', async (req, res) => {
  try {
    if (isPostgresConnected) {
      const result = await pool.query('SELECT * FROM user_profiles ORDER BY id DESC LIMIT 1');
      if (result.rows.length > 0) {
        const row = result.rows[0];
        return res.json({
          patientName: row.patient_name,
          adminName: row.admin_name,
          adminWa: row.admin_wa,
          patientAvatar: row.patient_avatar || undefined,
          adminAvatar: row.admin_avatar || undefined,
        });
      }
    }
  } catch (err) {
    console.warn('DB query fallback for profiles');
  }

  const store = loadLocalStore();
  res.json(store.users);
});

app.post('/api/profiles', async (req, res) => {
  const { patientName, adminName, adminWa, patientAvatar, adminAvatar } = req.body;
  const store = loadLocalStore();
  store.users = {
    patientName: patientName !== undefined ? patientName.trim() : store.users.patientName,
    adminName: adminName !== undefined ? adminName.trim() : store.users.adminName,
    adminWa: adminWa !== undefined ? adminWa.trim() : store.users.adminWa,
    patientAvatar: patientAvatar !== undefined ? patientAvatar : store.users.patientAvatar,
    adminAvatar: adminAvatar !== undefined ? adminAvatar : store.users.adminAvatar,
  };
  saveLocalStore(store);

  if (isPostgresConnected) {
    try {
      const countRes = await pool.query('SELECT COUNT(*) FROM user_profiles');
      if (parseInt(countRes.rows[0].count, 10) === 0) {
        await pool.query(
          `INSERT INTO user_profiles (patient_name, admin_name, admin_wa, patient_avatar, admin_avatar, updated_at)
           VALUES ($1, $2, $3, $4, $5, NOW())`,
          [store.users.patientName, store.users.adminName, store.users.adminWa, store.users.patientAvatar || null, store.users.adminAvatar || null]
        );
      } else {
        await pool.query(
          `UPDATE user_profiles 
           SET patient_name = $1, admin_name = $2, admin_wa = $3, patient_avatar = $4, admin_avatar = $5, updated_at = NOW()
           WHERE id = (SELECT id FROM user_profiles ORDER BY id DESC LIMIT 1)`,
          [store.users.patientName, store.users.adminName, store.users.adminWa, store.users.patientAvatar || null, store.users.adminAvatar || null]
        );
      }
    } catch (err) {
      console.error('Postgres profile update error:', err);
    }
  }

  res.json({ success: true, users: store.users });
});

app.listen(PORT, () => {
  console.log(`🚀 Medic Care Server berjalan di http://localhost:${PORT}`);
});
