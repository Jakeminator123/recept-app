import express from "express";
import { createRequestHandler } from "@remix-run/express";
import shopify from "./app/shopify.server.js";
// Ändra tillbaka sökvägen för att undvika dubbla app-kataloger i Docker
import * as build from "./build/index.js";

const app = express();
app.use(express.static("public"));

app.all("*", async (req, res, next) => {
  // Hämta shop-domänen från query eller session
  const shop = req.query.shop || req.session?.shop;

  // Sätt rätt frame-ancestors-header
  if (shop) {
    res.setHeader(
      "Content-Security-Policy",
      `frame-ancestors https://${shop} https://admin.shopify.com https://1tmiwd-eq.myshopify.com;`
    );
  } else {
    // fallback om route inte är embedded
    res.setHeader("Content-Security-Policy", "frame-ancestors 'none' https://1tmiwd-eq.myshopify.com;");
  }

  return createRequestHandler({
    // Ersätt require med den importerade build-modulen
    build,
    mode: process.env.NODE_ENV
  })(req, res, next);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server igång på port ${port}`));