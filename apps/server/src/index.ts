import express from "express";
const app = express();

app.get("/api/posts/:slug", (req, res) => {
  res.json({
    title: `Post ${req.params.slug}`,
    content: `Generated at ${new Date().toISOString()}`,
  });
});

app.listen(4000, () => {
  console.log("API server running at http://localhost:4000");
});
