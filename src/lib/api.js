// api.js (OFILINK Backend + AIConta Fiscal Shield v1)
// CommonJS ONLY (no mezclar con import/export)

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

/* =========================
   1) CORS (PRIMERO SIEMPRE)
========================= */

// Railway ENV recomendado:
// CORS_ORIGINS="https://ofilink-frontend.vercel.app,https://ofilink-frontend-8u6v.vercel.app,http://localhost:5173"

const corsOriginsEnv = process.env.CORS_ORIGINS || "";
const allowedOrigins = corsOriginsEnv
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// Permitir todos los previews de Vercel sin estar agregando dominios
function isVercelPreview(origin) {
  try {
    const u = new URL(origin);
    return u.hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

function isAllowedOrigin(origin) {
  if (!origin) return true; // server-to-server / Postman
  if (allowedOrigins.includes(origin)) return true;
  if (isVercelPreview(origin)) return true;
  return false;
}

// Rechazo explícito (403) si el Origin no está permitido
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin) return next(); // no browser origin
  if (!isAllowedOrigin(origin)) {
    return res.status(403).json({
      ok: false,
      message: `CORS bloqueado: ${origin}`,
      hint:
        "Agrega este origin en Railway -> Variables -> CORS_ORIGINS, o usa dominio *.vercel.app",
    });
  }
  return next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      // si no hay origin, permitir
      if (!origin) return callback(null, true);
      // ya validamos arriba, aquí solo confirmamos
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

// Preflight global
app.options("*", cors());

// JSON body
app.use(express.json({ limit: "10mb" }));

/* =========================
   2) Persistencia JSON
========================= */
const DATA_FILE = process.env.DATA_FILE || "./data/data.json";
const dataPath = path.resolve(DATA_FILE);

function ensureDataFile() {
  const dir = path.dirname(dataPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (!fs.existsSync(dataPath)) {
    const seed = { nextClienteId: 1, nextTicketId: 1, clientes: [], tickets: [] };
    fs.writeFileSync(dataPath, JSON.stringify(seed, null, 2), "utf-8");
  }
}

function readData() {
  ensureDataFile();
  const raw = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(raw);
}

function writeData(data) {
  ensureDataFile();
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
}

/* =========================
   3) Routes - Core OFILINK
========================= */
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "OFILINK 2.0 API viva" });
});

app.get("/api/clientes", (req, res) => {
  const data = readData();
  res.json(data.clientes || []);
});

app.post("/api/clientes", (req, res) => {
  const { empresa, nombre, monto, etapa, origen, asesor } = req.body || {};
  if (!empresa || !nombre) {
    return res.status(400).json({ ok: false, message: "empresa y nombre son obligatorios" });
  }

  const data = readData();
  const nuevo = {
    id: data.nextClienteId++,
    empresa,
    nombre,
    monto: Number(monto) || 0,
    etapa: etapa || "prospecto",
    origen: origen || "",
    asesor: asesor || "",
  };

  data.clientes.push(nuevo);
  writeData(data);
  res.status(201).json(nuevo);
});

app.get("/api/tickets", (req, res) => {
  const data = readData();
  res.json(data.tickets || []);
});

app.post("/api/tickets", (req, res) => {
  const { canal, empresa, cliente, asunto, prioridad, asignadoA, estado, creadoEn } = req.body || {};
  if (!empresa || !cliente || !asunto) {
    return res.status(400).json({ ok: false, message: "empresa, cliente y asunto son obligatorios" });
  }

  const data = readData();
  const nuevo = {
    id: data.nextTicketId++,
    canal: canal || "Otro",
    empresa,
    cliente,
    asunto,
    prioridad: prioridad || "Media",
    asignadoA: asignadoA || "",
    estado: estado || "Abierto",
    creadoEn: creadoEn || new Date().toISOString().slice(0, 16).replace("T", " "),
  };

  data.tickets.unshift(nuevo);
  writeData(data);
  res.status(201).json(nuevo);
});

/* =========================
   4) AIConta - Fiscal Shield v1
========================= */
const aiconta = express.Router();

aiconta.get("/health", (req, res) => {
  res.json({ ok: true, service: "aiconta", message: "AIConta API viva" });
});

aiconta.get("/companies", (req, res) => {
  res.json({
    ok: true,
    items: [
      {
        id: "contax",
        legalName: "CONTAX SOLUTIONS AND BUSINESS ADMINISTRATION SAS DE CV",
        country: "MX",
        defaultCurrency: "MXN",
        active: true,
      },
    ],
  });
});

aiconta.post("/compliance/analyze", async (req, res) => {
  const payload = req.body || {};

  res.json({
    ok: true,
    bot: "FiscalShield",
    version: "v1",
    inputEcho: payload,
    result: {
      overall: "yellow", // green | yellow | red
      summary:
        "V1 demo: estructura lista. Pendiente motor experto + EFOS/69-B + expediente materialidad.",
      findings: [
        {
          code: "MATERIALIDAD_BASE",
          severity: "medium",
          title: "Expediente incompleto",
          detail: "Faltan evidencias mínimas ligadas a contrato/OC/pedido.",
          suggestedNext: [
            "Subir contrato firmado",
            "Adjuntar orden de compra/pedido",
            "Evidencia de entrega/servicio (correo, fotos, bitácora)",
          ],
        },
      ],
      citations: [],
    },
  });
});

app.use("/api/aiconta", aiconta);

/* =========================
   5) 404 + Error handler
========================= */
app.use((req, res) => res.status(404).json({ ok: false, message: "Ruta no encontrada" }));

app.use((err, req, res, next) => {
  console.error("API Error:", err);
  res.status(500).json({ ok: false, message: err?.message || "Error interno de servidor" });
});

/* =========================
   6) Start
========================= */
app.listen(PORT, () => {
  console.log("OFILINK 2.0 API escuchando en puerto", PORT);
  console.log("DATA_FILE:", dataPath);
  console.log("CORS_ORIGINS allowlist:", allowedOrigins);
});

module.exports = app;
