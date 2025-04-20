import express from "express";
import { createRequestHandler } from "@remix-run/express";
import shopify from "./app/shopify.server.js";

const app = express();
app.use(express.static("public"));

app.all("*", async (req, res, next) => {
  // Hämta shop-domänen från query eller session
  const shop = req.query.shop || req.session?.shop;

  // Sätt rätt frame-ancestors-header
  if (shop) {
    res.setHeader(
      "Content-Security-Policy",
      `frame-ancestors https://${shop} https://admin.shopify.com;`
    );
  } else {
    // fallback om route inte är embedded
    res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");
  }

  return createRequestHandler({
    build: require("./build"),
    mode: process.env.NODE_ENV
  })(req, res, next);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server igång på port ${port}`)); 