const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// 🔥 PORT ko environment se lo (Render ke liye important)
const PORT = process.env.PORT || 3000;

// Uploads folder banado agar nahi hai
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let messages = []; // Chat history

// Login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle login
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (password === "AyushRanjan@123") {
    res.redirect(`/chat.html?username=${encodeURIComponent(username)}`);
  } else {
    res.send('<h2>Incorrect Password!</h2><a href="/">Try again</a>');
  }
});

// Chat page
app.get('/chat.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Upload route
app.post('/upload', upload.single('image'), (req, res) => {
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

// Socket.io
io.on('connection', (socket) => {
  console.log('A user connected');

  const username = new URL(socket.handshake.headers.referer).searchParams.get("username") || "Anonymous";
  socket.emit('set username', username);

  // Send old messages
  socket.emit('load messages', messages);

  // New message handler
  socket.on('chat message', (msg) => {
    const messageData = { user: msg.user, text: msg.text || "", type: msg.type || "text" };
    messages.push(messageData);
    io.emit('chat message', messageData);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

http.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
