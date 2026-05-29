import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const API_URL = "/api/products";

async function fetchProducts(params) {
    const query = new URLSearchParams();

    query.set("page", params.page);
    query.set("limit", params.limit);
    query.set("sort", params.sort);
    query.set("order", params.order);

    if (params.category) {
        query.set("category", params.category);
    }
    if (params.priceMin !== "") {
        query.set("priceMin", params.priceMin);
    }
    if (params.priceMax !== "") {
        query.set("priceMax", params.priceMax);
    }
    if (params.inStock) {
        query.set("inStock", "true");
    }

    const res = await fetch(`${API_URL}?${query.toString()}`);

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Erreur HTTP ${res.status}`);
    }

    return res.json();
}

export default function App() {
    // [val, setVal]
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("createdAt");
    const [order, setOrder] = useState("desc");
    const [priceMin, setPriceMin] = useState("");
    const [priceMax, setPriceMax] = useState("");
    const [inStock, setInStock] = useState(false);

    function handleFilterChange(setter) {
        return (value) => {
            setPage(1);
            setter(value);
        };
    }

    // useQuery AVANT d'utiliser data
    const { data, isLoading, isError, error, isFetching } = useQuery({
        queryKey: [
            "products",
            page,
            limit,
            category,
            sort,
            order,
            priceMin,
            priceMax,
            inStock,
        ],
        queryFn: () =>
            fetchProducts({
                page,
                limit,
                category,
                sort,
                order,
                priceMin,
                priceMax,
                inStock,
            }),
        keepPreviousData: true,
    });

    let products;
    if (data && data.data) {
        products = data.data;
    } else {
        products = [];
    }

    let pagination;
    if (data && data.pagination) {
        pagination = data.pagination;
    } else {
        pagination = null;
    }

    return (
        <div className="app">
            <div className="header">
                <h1>Catalogue produits</h1>
                <div className="filters">
                    <select
                        value={category}
                        onChange={(e) =>
                            handleFilterChange(setCategory)(e.target.value)
                        }
                    >
                        <option value="">Toutes catégories</option>
                        <option value="shoes">Chaussures</option>
                        <option value="clothing">Vêtements</option>
                        <option value="accessories">Accessoires</option>
                        <option value="bags">Sacs</option>
                    </select>
                    <select
                        value={sort}
                        onChange={(e) =>
                            handleFilterChange(setSort)(e.target.value)
                        }
                    >
                        <option value="createdAt">Nouveauté</option>
                        <option value="price">Prix</option>
                        <option value="stock">Stock</option>
                        <option value="name">Nom</option>
                    </select>
                    <select
                        value={order}
                        onChange={(e) =>
                            handleFilterChange(setOrder)(e.target.value)
                        }
                    >
                        <option value="desc">Décroissant</option>
                        <option value="asc">Croissant</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Prix min"
                        value={priceMin}
                        min={0}
                        onChange={(e) =>
                            handleFilterChange(setPriceMin)(e.target.value)
                        }
                        className="price-input"
                    />
                    <input
                        type="number"
                        placeholder="Prix max"
                        value={priceMax}
                        min={0}
                        onChange={(e) =>
                            handleFilterChange(setPriceMax)(e.target.value)
                        }
                        className="price-input"
                    />
                    <label className="instock-label">
                        <input
                            type="checkbox"
                            checked={inStock}
                            onChange={(e) =>
                                handleFilterChange(setInStock)(e.target.checked)
                            }
                        />
                        En stock
                    </label>
                </div>
            </div>

            {isFetching && !isLoading && (
                <p className="fetching">Mise à jour...</p>
            )}
            {isLoading && <p className="loading">Chargement...</p>}
            {isError && <p className="error">Erreur : {error.message}</p>}

            {!isLoading && !isError && (
                <>
                    {products.length === 0 ? (
                        <p className="empty">Aucun produit trouvé.</p>
                    ) : (
                        <div className="product-grid">
                            {products.map((product) => (
                                <div key={product._id} className="product-card">
                                    <p className="category">
                                        {product.category}
                                    </p>
                                    <h2>{product.name}</h2>
                                    <p className="price">
                                        {product.price.toFixed(2)} €
                                    </p>
                                    <p className="stock">
                                        {product.stock > 0
                                            ? `${product.stock} en stock`
                                            : "Rupture de stock"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                    {pagination && (
                        <div className="pagination">
                            <button
                                onClick={() => setPage((p) => p - 1)}
                                disabled={page === 1}
                            >
                                ← Précédent
                            </button>
                            <span className="page-info">
                                Page {pagination.page} / {pagination.totalPages}{" "}
                                ({pagination.total} produits)
                            </span>
                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={page === pagination.totalPages}
                            >
                                Suivant →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
