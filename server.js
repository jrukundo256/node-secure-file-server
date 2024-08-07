import express from "express";
import session from "express-session";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

// M/W
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Session M/W
app.use(
  session({
    secret: "secret12345",
    resave: false,
    saveUninitialized: true,
  })
);

// M/W func for authentication
const authenticateUser = (req, res, next) => {
  if (req.session && req.session.authenticated) {
    next();
  } else {
    res.redirect("/login");
  }
};

// Routes
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/login", (req, res) => {
  const { password } = req.body;
  const correctPassword = "kanzu123";

  console.log(`PWD: ${password}`);

  if (password === correctPassword) {
    req.session.authenticated = true;
    res.redirect("/node-course");
    console.log(`Howdy..`);
  } else {
    res.redirect("/login");
  }
});

app.get("/node-course", authenticateUser, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "node-course.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});