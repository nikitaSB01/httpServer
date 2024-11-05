import express from "express";
import path from "path"; // Импорт модуля path
import cors from "cors";
import bodyParser from "body-parser";
import * as crypto from "crypto";
import pino from "pino";
import pinoPretty from "pino-pretty";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const logger = pino(pinoPretty());

app.use(cors());
app.use(bodyParser.json());

// Массив для хранения тикетов
let tickets = [
  {
    id: "1",
    name: "Ticket 1",
    description: "Description for ticket 1",
    status: false,
    created: new Date(),
  },
  {
    id: "2",
    name: "Ticket 2",
    description: "Description for ticket 2",
    status: true,
    created: new Date(),
  },
];

// Обработчики API
app.get("/tickets", (req, res) => {
  res.json(tickets);
});

app.get("/tickets/:id", (req, res) => {
  const id = req.params.id;
  const ticket = tickets.find((t) => t.id === id);
  if (ticket) {
    res.json(ticket);
  } else {
    res.status(404).json({ error: "Ticket not found" });
  }
});

app.post("/tickets", (req, res) => {
  const { name, description, status } = req.body;
  const newTicket = {
    id: crypto.randomUUID(),
    name,
    description,
    status,
    created: new Date(),
  };
  tickets.push(newTicket);
  res.status(201).json(newTicket);
});

app.put("/tickets/:id", (req, res) => {
  const id = req.params.id;
  const ticketIndex = tickets.findIndex((t) => t.id === id);
  if (ticketIndex !== -1) {
    tickets[ticketIndex] = { ...tickets[ticketIndex], ...req.body };
    res.json(tickets[ticketIndex]);
  } else {
    res.status(404).json({ error: "Ticket not found" });
  }
});

app.delete("/tickets/:id", (req, res) => {
  const id = req.params.id;
  const ticketIndex = tickets.findIndex((t) => t.id === id);
  if (ticketIndex !== -1) {
    tickets.splice(ticketIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: "Ticket not found" });
  }
});

// Статические файлы
app.use(express.static(path.join(__dirname, "../httpFrontend/dist")));

// Запуск сервера
const PORT = 7070;
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
