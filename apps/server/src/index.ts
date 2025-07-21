import express from "express";

const app = express();
app.use(express.json());

app.get("/ping", (_, res) => res.send("pong"));

app.listen(4000, () => {
  console.log("Node server listening on http://localhost:4000");
});

app.get("/api/posts/:slug", (req, res) => {
  res.json({
    title: `Post ${req.params.slug}`,
    content: `Generated at ${new Date().toISOString()}`,
  });
});
