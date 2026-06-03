import express from "express";
import cors from "cors";
import { router as studentsRouter } from "./routes/students.routes.js";

// Routing refers to determining how an application responds to a client request to a particular endpoint,
// which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
// Each route can have one or more handler functions, which are executed when the route is matched.

// Route definition takes the following structure:
// app.METHOD(PATH, HANDLER)
const app = express();
const PORT = process.env.PORT || 3030;
// 0.0.0.0 means that the server will be accessible from everywhere
// 127.0.0.1 means that it will be accessible from the local machine
const HOST = process.env.HOST || "0.0.0.0";

// Our server can accept JSON formats =) in the request
app.use(express.json());

// set cors policy
// The cors() middleware automatically adds the necessary headers to the response, allowing cross-origin requests
// This is crucial when your front-end and back-end are served from different domains or ports
app.use(cors());

// import the students router
app.use("/api", studentsRouter); // use the "api" in the route - convention

// It will return Hello World when accessing localhost:3000
// For every other route ut will return 404 Not Found
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, HOST, () => {
  console.log(`App listening on port ${PORT}`);
});
