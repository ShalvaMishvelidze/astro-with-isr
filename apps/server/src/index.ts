import express from "express";

const app = express();

// Posts route
app.get("/api/posts/:slug", (req, res) => {
  res.json({
    title: `Post ${req.params.slug}`,
    content: `Generated at ${new Date().toISOString()}`,
  });
});

// 🆕 Products route from DummyJSON
app.get("/api/products/:id", async (req, res) => {
  try {
    const response = await fetch(
      `https://dummyjson.com/products/${req.params.id}`
    );
    const data = await response.json();
    console.log(data);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product data." });
  }
});

app.listen(4000, () => {
  console.log("API server running at http://localhost:4000");
});
