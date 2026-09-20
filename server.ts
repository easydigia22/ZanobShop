import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: '.env.local' });
dotenv.config();

// In-memory rate limiter (per IP)
const rlStore = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const rec = rlStore.get(ip);
  if (!rec || now > rec.resetAt) {
    rlStore.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (rec.count >= limit) return false;
  rec.count++;
  return true;
}
// Sanitize string inputs: trim and cap length
function sanitize(val: unknown, maxLen = 500): string {
  return typeof val === 'string' ? val.trim().slice(0, maxLen) : '';
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security headers
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  app.use(express.json({ limit: "1mb" }));

  // Initialize Gemini AI Client safely
  let aiClient: GoogleGenAI | null = null;
  const getAiClient = () => {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  };

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Social Post Generation Endpoint using Gemini 3.6 Flash
  app.post("/api/ai/generate-post", async (req, res) => {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(ip, 20, 60_000)) {
      return res.status(429).json({ error: "Trop de requêtes. Veuillez réessayer dans un moment." });
    }

    try {
      const productName  = sanitize(req.body?.productName, 200);
      const categoryName = sanitize(req.body?.categoryName, 100);
      const description  = sanitize(req.body?.description, 1000);
      const price        = sanitize(req.body?.price, 20);
      const promoPrice   = sanitize(req.body?.promoPrice, 20);
      const style        = sanitize(req.body?.style, 50);
      const platform     = sanitize(req.body?.platform, 50);
      const customNotes  = sanitize(req.body?.customNotes, 500);

      if (!productName) {
        return res.status(400).json({ error: "Le nom du produit est requis." });
      }

      const client = getAiClient();
      if (!client) {
        // Fallback intelligent generator if GEMINI_API_KEY is not yet active
        const fallbackTitle = `✨ Découvrez ${productName} — Collection ${categoryName || 'Exclusive'}`;
        const fallbackContent = `Découvrez notre ${productName} ! ${description || 'Un produit d\'exception conçu avec soin.'}\n\nUn style ${style || 'Élégant'} parfait pour sublimer votre tenue au quotidien.`;
        const fallbackCta = `📲 Commandez directement via WhatsApp au prix de ${promoPrice || price} MAD !`;
        const fallbackHashtags = [`#${productName.replace(/[^a-zA-Z0-0]/g, '')}`, '#SmartBoutique', '#FashionMaroc', '#BoutiqueShopping', '#StyleDuJour'];
        
        return res.json({
          title: fallbackTitle,
          content: fallbackContent,
          cta: fallbackCta,
          hashtags: fallbackHashtags,
          variants: [
            `Incontournable : ${productName} à ${promoPrice || price} MAD. Contactez-nous par WhatsApp !`,
            `Coup de cœur HAJARSHOP : ${productName}. Réservez votre pièce dès aujourd'hui.`
          ]
        });
      }

      const prompt = `Tu es un expert marketing digital spécialiste du e-commerce de mode et prêt-à-porter de luxe pour la marque "HAJARSHOP".
Génère une publication pour les réseaux sociaux (${platform || 'Tous les réseaux'}) pour le produit suivant :

- Nom du produit : ${productName}
- Catégorie : ${categoryName || 'Boutique'}
- Description : ${description || 'Produit de qualité supérieure'}
- Prix officiel : ${price} MAD
${promoPrice ? `- Prix Promotionnel : ${promoPrice} MAD` : ''}
- Style souhaité : ${style || 'Élégant'} (Ex: Promotionnel, Élégant, Familial, Court, Storytelling)
- Instructions complémentaires : ${customNotes || 'Met en avant la qualité et la possibilité de commander par WhatsApp.'}

Ta réponse DOIT ÊTRE UN OBJET JSON valide avec exactement les clés suivantes :
{
  "title": "Un titre accrocheur pour la publication",
  "content": "Le corps complet du texte du post avec emojis adaptés et retours à la ligne élégants",
  "cta": "Un appel à l'action clair et incitatif (ex: commande WhatsApp)",
  "hashtags": ["#Hashtag1", "#Hashtag2", "#Hashtag3", "#Hashtag4", "#Hashtag5"],
  "variants": [
    "Une variante plus courte pour story ou post rapide",
    "Une variante orientée storytelling/émotion"
  ]
}`;

      const response = await client.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const textOutput = response.text;
      if (!textOutput) {
        throw new Error("Aucune réponse générée par l'IA.");
      }

      const parsedData = JSON.parse(textOutput.trim());
      return res.json(parsedData);
    } catch (err: any) {
      console.error("Erreur lors de la génération IA:", err);
      return res.status(500).json({ error: "Erreur lors de la génération du contenu IA." });
    }
  });

  // Simulated Automated Posting & Scheduler Endpoint (Trigger.dev job emulation)
  app.post("/api/trigger/run-jobs", (req, res) => {
    return res.json({
      status: "success",
      executedAt: new Date().toISOString(),
      jobsRun: [
        { job: "check_scheduled_posts", status: "completed", processed: 1 },
        { job: "inventory_low_stock_audit", status: "completed", alertsFound: 2 },
      ],
    });
  });

  // Serve static files in production or vite middleware in dev
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
