import React, { useState, useEffect } from "react";
import "./styles.css";

const PRODUCTS = [
  {
    id: 1,
    name: "Samsung Galaxy S24",
    price: 79999,
    rating: 4.5,
    discount: 10,
    popularity: 90,
    category: "Mobile",
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    price: 129999,
    rating: 4.8,
    discount: 5,
    popularity: 98,
    category: "Mobile",
  },
  {
    id: 3,
    name: "OnePlus 12",
    price: 65999,
    rating: 4.3,
    discount: 8,
    popularity: 85,
    category: "Mobile",
  },
  {
    id: 4,
    name: "MacBook Air M3",
    price: 139999,
    rating: 4.7,
    discount: 12,
    popularity: 95,
    category: "Laptop",
  },
  {
    id: 5,
    name: "HP Spectre x360",
    price: 119999,
    rating: 4.4,
    discount: 15,
    popularity: 88,
    category: "Laptop",
  },
  {
    id: 6,
    name: "Dell XPS 13",
    price: 124999,
    rating: 4.6,
    discount: 10,
    popularity: 92,
    category: "Laptop",
  },
];

const rankProducts = (products) => {
  return [...products].sort((a, b) => {
    const scoreA = a.rating * 0.5 + a.popularity * 0.3 + a.discount * 0.2;
    const scoreB = b.rating * 0.5 + b.popularity * 0.3 + b.discount * 0.2;
    return scoreB - scoreA;
  });
};

const findSimilarProducts = (target, products) => {
  return products.filter(
    (p) => p.category === target.category && p.id !== target.id
  );
};

export default function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    if (query.length > 1) {
      const filtered = PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(rankProducts(filtered).slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSelect = (product) => {
    if (!compareList.some((p) => p.id === product.id)) {
      setCompareList([...compareList, product]);
    }
    setQuery("");
    setSuggestions([]);
  };

  const removeProduct = (id) => {
    setCompareList(compareList.filter((p) => p.id !== id));
  };

  return (
    <div className="app-container">
      <h1 className="heading">🛒 Smart Product Comparison</h1>

      {/* Centered Search Bar */}
      <div className="search-bar-container">
        <div className="relative w-full max-w-2xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 Search for products (e.g., iPhone, Laptop)..."
            className="search-input"
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-box">
              {suggestions.map((s) => (
                <li
                  key={s.id}
                  onClick={() => handleSelect(s)}
                  className="suggestion-item"
                >
                  {s.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      {compareList.length > 0 && (
        <div className="table-container">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Rating ⭐</th>
                <th>Discount (%)</th>
                <th>Popularity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {compareList.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>₹{p.price.toLocaleString()}</td>
                  <td>{p.rating}</td>
                  <td>{p.discount}</td>
                  <td>{p.popularity}</td>
                  <td>
                    <button
                      onClick={() => removeProduct(p.id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recommendations */}
      {compareList.length === 1 && (
        <div className="recommend-container">
          <h2 className="recommend-heading">🔍 Similar Products:</h2>
          <div className="recommend-grid">
            {findSimilarProducts(compareList[0], PRODUCTS).map((rec) => (
              <div key={rec.id} className="recommend-card">
                <p className="rec-name">{rec.name}</p>
                <p>₹{rec.price.toLocaleString()}</p>
                <p className="rating">⭐ {rec.rating}</p>
                <button
                  onClick={() => handleSelect(rec)}
                  className="compare-btn"
                >
                  Add to Compare
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
