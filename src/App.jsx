import React, { useEffect, useState } from "react";
import { getJwt, getUser } from "./Services/userServices";
import UserContext from "./contexts/UserContext";
import CartContext from "./contexts/CartContext";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Routing from "./components/Routing/Routing";
import setAuthToken from "./utils/setAuthToken";
import {
    addToCartAPI,
    decreaseProductAPI,
    increaseProductAPI,
    getCartAPI,
    removeFromCartAPI
} from "./components/Cart/cartServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

setAuthToken(getJwt());

const App = () => {
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        try {
            const jwtUser = getUser();

            if (Date.now() >= jwtUser.exp * 1000) {
                localStorage.removeItem("token");
                location.reload();
            } else {
                setUser(jwtUser);
            }
        } catch (error) {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        if (user) {
            getCartAPI()
                .then((res) => {
                    setCart(res.data);
                })
                .catch(() => {
                    toast.error("Failed to fetch cart items.");
                });
        }
    }, [user]);

    const addToCart = (product, quantity) => {
        const oldCart = [...cart];
        const updatedCart = [...cart];

        const productIndex = updatedCart.findIndex(
            (item) => item.product._id === product._id
        );

        if (productIndex === -1) {
            updatedCart.push({ product, quantity });
        } else {
            updatedCart[productIndex].quantity += quantity;
        }

        setCart(updatedCart);

        addToCartAPI(product._id, quantity)
            .then(() => {
                toast.success("Product added to cart successfully!");
            })
            .catch(() => {
                toast.error("Failed to add product to cart.");
                setCart(oldCart);
            });
    };

    const removeFromCart = (id) => {
        const oldCart = [...cart];
        const updatedCart = cart.filter(
            (item) => item.product._id !== id
        );

        setCart(updatedCart);

        removeFromCartAPI(id)
            .then(() => {
                toast.success("Product removed from cart successfully!");
            })
            .catch(() => {
                toast.error("Failed to remove product from cart.");
                setCart(oldCart);
            });
    };

    const updateCart = (type, id) => {
        const oldCart = [...cart];
        const updatedCart = cart.map((item) => ({
            ...item,
            product: { ...item.product }
        }));

        const productIndex = updatedCart.findIndex(
            (item) => item.product._id === id
        );

        if (productIndex === -1) {
            return;
        }

        if (type === "increase") {
            updatedCart[productIndex].quantity += 1;
            setCart(updatedCart);

            increaseProductAPI(id).catch(() => {
                toast.error("Failed to increase product quantity.");
                setCart(oldCart);
            });
        }

        if (type === "decrease") {
            updatedCart[productIndex].quantity -= 1;
            setCart(updatedCart);

            decreaseProductAPI(id).catch(() => {
                toast.error("Failed to decrease product quantity.");
                setCart(oldCart);
            });
        }
    };

    return (
        <UserContext.Provider value={user}>
            <CartContext.Provider
                value={{
                    cart,
                    addToCart,
                    removeFromCart,
                    updateCart,
                    setCart
                }}
            >
                <div className="app">
                    <Navbar />

                    <main>
                        <ToastContainer position="bottom-right" />
                        <Routing />
                    </main>
                </div>
            </CartContext.Provider>
        </UserContext.Provider>
    );
};

export default App;