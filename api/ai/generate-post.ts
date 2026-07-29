import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;
const getAiClient = () => {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { productName, categoryName, description, price, promoPrice, style, platform, customNotes } = req.body;

    if (!productName) {
      return res.status(400).json({ error: 'Le nom du produit est requis.' });
    }

    const client = getAiClient();
    if (!client) {
      const fallbackTitle = `✨ Découvrez ${productName} — Collection ${categoryName || 'Exclusive'}`;
      const fallbackContent = `Découvrez notre ${productName} ! ${description || "Un produit d'exception conçu avec soin."}\n\nUn style ${style || 'Élégant'} parfait pour sublimer votre tenue au quotidien.`;
      const fallbackCta = `📲 Commandez directement via WhatsApp au prix de ${promoPrice || price} MAD !`;
      const fallbackHashtags = [`#${productName.replace(/[^a-zA-Z0-9]/g, '')}`, '#SmartBoutique', '#FashionMaroc', '#BoutiqueShopping', '#StyleDuJour'];

      return res.json({
        title: fallbackTitle,
        content: fallbackContent,
        cta: fallbackCta,
        hashtags: fallbackHashtags,
        variants: [
          `Incontournable : ${productName} à ${promoPrice || price} MAD. Contactez-nous par WhatsApp !`,
          `Coup de cœur Smart Boutique : ${productName}. Réservez votre pièce dès aujourd'hui.`,
        ],
      });
    }

    const prompt = `Tu es un expert marketing digital spécialiste du e-commerce de mode et prêt-à-porter de luxe pour la marque "Smart Boutique".
Génère une publication pour les réseaux sociaux (${platform || 'Tous les réseaux'}) pour le produit suivant :

- Nom du produit : ${productName}
- Catégorie : ${categoryName || 'Boutique'}
- Description : ${description || 'Produit de qualité supérieure'}
- Prix officiel : ${price} MAD
${promoPrice ? `- Prix Promotionnel : ${promoPrice} MAD` : ''}
- Style souhaité : ${style || 'Élégant'}
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
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json', temperature: 0.7 },
    });

    const textOutput = response.text;
    if (!textOutput) throw new Error("Aucune réponse générée par l'IA.");

    const parsedData = JSON.parse(textOutput.trim());
    return res.json(parsedData);
  } catch (err: any) {
    console.error('Erreur lors de la génération IA:', err);
    return res.status(500).json({ error: 'Erreur lors de la génération du contenu IA', details: err.message });
  }
}
