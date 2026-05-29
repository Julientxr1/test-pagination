const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

// Whitelist des valeurs autorisées pour sort et category
const ALLOWED_SORT = ["price", "stock", "createdAt", "name"];
const ALLOWED_ORDER = ["asc", "desc"];
const ALLOWED_CATEGORY = ["shoes", "clothing", "accessories", "bags"];

// Format de query :
// GET /api/products?page=2&category=shoes&priceMin=20&inStock=true
// parse par Express de maniere automatique !
//  {
//    page:     "2",
//    category: "shoes",
//    priceMin: "20",
//    inStock:  "true"
//  }
function validateParams(query) {
    let page = parseInt(query.page);
    if (isNaN(page)) {
        page = 1;
    }

    let limit = parseInt(query.limit);
    if (isNaN(limit)) {
        limit = 10;
    }

    if (page < 1) {
        return { error: "Le paramètre 'page' doit être un entier >= 1" };
    }
    if (limit < 1) {
        return { error: "Le paramètre 'limit' doit être un entier >= 1" };
    }
    if (limit > 100) {
        return { error: "Le paramètre 'limit' ne peut pas dépasser 100" };
    }

    // Category
    let category;
    if (query.category) {
        category = query.category;
    } else {
        category = "";
    }

    if (category && !ALLOWED_CATEGORY.includes(category)) {
        return {
            error: `Catégorie invalide. Valeurs autorisées : ${ALLOWED_CATEGORY.join(", ")}`,
        };
    }

    // Sort
    let sort;
    if (ALLOWED_SORT.includes(query.sort)) {
        sort = query.sort;
    } else {
        sort = "createdAt";
    }

    // Order
    let order;
    if (ALLOWED_ORDER.includes(query.order)) {
        order = query.order;
    } else {
        order = "desc";
    }

    // Prix
    let priceMin;
    if (query.priceMin) {
        priceMin = parseFloat(query.priceMin);
    } else {
        priceMin = null;
    }
    let priceMax;
    if (query.priceMax) {
        priceMax = parseFloat(query.priceMax);
    } else {
        priceMax = null;
    }

    // check prix
    if (priceMin !== null && isNaN(priceMin))
        return { error: "priceMin doit être un nombre" };
    if (priceMax !== null && isNaN(priceMax))
        return { error: "priceMax doit être un nombre" };
    if (priceMin !== null && priceMin < 0)
        return { error: "priceMin doit être positif" };
    if (priceMax !== null && priceMax < 0)
        return { error: "priceMax doit être positif" };
    if (priceMin !== null && priceMax !== null && priceMin > priceMax) {
        return { error: "priceMin ne peut pas être supérieur à priceMax" };
    }

    // Stock
    let inStock = false;
    if (query.inStock === "true") {
        inStock = true;
    }

    return { page, limit, category, sort, order, priceMin, priceMax, inStock };
}

async function start() {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log("Connecté à MongoDB");

    const db = client.db("shop");
    app.locals.db = db;

    app.use(cors());
    app.use(express.json());

    app.get("/api/products", async (req, res) => {
        const params = validateParams(req.query);
        if (params.error) {
            return res.status(400).json({ error: params.error });
        }

        const {
            page,
            limit,
            category,
            sort,
            order,
            priceMin,
            priceMax,
            inStock,
        } = params;

        try {
            const collection = req.app.locals.db.collection("products");

            // Filtre pour la BDD
            const filter = {};

            if (category) {
                filter.category = category;
            }

            if (priceMin !== null || priceMax !== null) {
                filter.price = {};
                if (priceMin !== null) {
                    filter.price.$gte = priceMin;
                }
                if (priceMax !== null) {
                    filter.price.$lte = priceMax;
                }
            }

            if (inStock) {
                filter.stock = { $gt: 0 };
            }

            let check_order = -1;
            if (order === "asc") {
                check_order = 1;
            }

            // Creation de la requete
            const total = await collection.countDocuments(filter); // Nb de pages d'articles correspond au filtre
            const products = await collection
                .find(filter)
                .sort({ [sort]: check_order })
                .skip((page - 1) * limit)
                .limit(limit)
                .toArray();

            // Réponse structurée
            return res.json({
                data: products,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            });
        } catch (err) {
            console.error("Erreur MongoDB :", err.message); // Erreur côté BDD
            return res.status(500).json({ error: "Erreur interne du serveur" });
        }
    });

    app.listen(PORT, () =>
        console.log("Serveur démarré sur http://localhost:" + PORT),
    );
}

start().catch((err) => {
    console.error("Erreur de connexion MongoDB :", err.message);
    process.exit(1);
});
