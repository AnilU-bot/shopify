import React, { useState, useEffect } from "react";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [socketMessage, setSocketMessage] = useState("");

  useEffect(() => {
    // Fetch products data
    fetch("https://messold101.myshopify.com/admin/api/2022-01/products.json ")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok " + res.statusText);
        }
        return res.json();
      })
      .then(
        (res) => {
          console.log(res.products);
          setProducts(res.products);
          setIsLoaded(true);
        },
        (error) => {
          setError(error);
          setIsLoaded(true);
        }
      );

    // WebSocket connection
    const socket = new WebSocket("ws://localhost:3000/ws");

    // Connection opened
    socket.addEventListener("open", function (event) {
      console.log("WebSocket connected");
    });

    // Listen for messages
    socket.addEventListener("message", function (event) {
      console.log("Message from server:", event.data);
      setSocketMessage(event.data);
    });

    // Listen for errors
    socket.addEventListener("error", function (event) {
      console.error("WebSocket error:", event);
    });

    // Listen for close
    socket.addEventListener("close", function (event) {
      console.log("WebSocket connection closed");
    });
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Product Table</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <b>Product ID</b>: {product.id} <br />
            <b>Title</b>: {product.title} <br />
            <b>Description</b>: {product.body_html} <br />
            <b>Category</b>: {product.product_type} <br />
            <b>Tags</b>: {product.tags} <br />
            <h4>Variants:</h4>
            <ul>
              {product.variants.map((variant) => (
                <li key={variant.id}>
                  <b>Variant ID</b>: {variant.id} <br />
                  <b>Title</b>: {variant.title} <br />
                  <b>Price</b>: {variant.price} <br />
                  <b>Compared Price</b>: {variant.compare_at_price} <br />
                  <b>SKU</b>: {variant.sku} <br />
                  <b>Quantity</b>: {variant.inventory_quantity} <br />
                </li>
              ))}
            </ul>
            <hr />
          </li>
        ))}
      </ul>
      <div>WebSocket Message: {socketMessage}</div>
    </div>
  );
}
