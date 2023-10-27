import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import { firestore } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import "./css/Favorites.css"; // Create a CSS file for your Favorites page styling

function Favorites() {
  const [user, setUser] = useState();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
  }, []);

  useEffect(() => {
    // Fetch user's favorites when the component mounts
    if (user) {
      const userId = user.uid;
      const userDocRef = doc(firestore, "user-favorite", userId);

      getDoc(userDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setFavorites(userData.favorites || []);
          }
        })
        .catch((error) => {
          console.error(
            "Error loading user's favorites from Firestore:",
            error
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  useEffect(() => {
    if (favorites.length > 0) {
      const productsRef = collection(firestore, "products");
      const favoriteProductsData = [];

      // Create an array of promises to fetch favorite products
      const fetchFavoriteProductsPromises = favorites.map(async (productId) => {
        const productDocRef = doc(productsRef, productId);
        const productDocSnapshot = await getDoc(productDocRef);

        if (productDocSnapshot.exists()) {
          const productData = productDocSnapshot.data();
          favoriteProductsData.push({ id: productId, ...productData });
        }
      });

      // Wait for all promises to resolve
      Promise.all(fetchFavoriteProductsPromises).then(() => {
        setFavoriteProducts(favoriteProductsData);
      });
    }
  }, [favorites]);

  return (
    <div>
      <Nav />

      <div className="favorites-container">
        <h2>Favorite Products</h2>
        {loading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
          </div>
        ) : (
          <div>
            {favoriteProducts.length > 0 ? (
              <div>
                {favoriteProducts.map((product) => (
                  <div className="favorite-product" key={product.id}>
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="product-image"
                      />
                    )}
                    <div className="product-details">
                      <h3>{product.name}</h3>
                      <p>Price: ${product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>You haven't added any products to your favorites.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;
