const express = require("express");
const cors = require("cors");
const app = express();
const port = 8070;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

// Validate Token Middleware
const validateToken = (req, res, next) => {
  const { authorization } = req.headers;
  const expectedToken = "Bearer YOUR_VALID_TOKEN_HERE"; // Replace with your actual valid token

  if (!authorization || authorization !== expectedToken) {
    return res.status(401).json({ error: "Invalid or missing token" });
  }

  next();
};

app.get("/api/products", validateToken, async (req, res) => {
  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(
      "https://messold101.myshopify.com/admin/api/2022-01/products.json",
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": "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", // Your Shopify access token
        },
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Proxy server is running on http://localhost:${port}`);
});
