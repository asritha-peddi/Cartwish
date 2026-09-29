import React, { useEffect, useState, useContext } from "react";
import UserContext from "../../contexts/UserContext";
import "./CartPage.css";
import Table from "../Common/Table";
import QuantityInput from "../SingleProduct/QuantityInput";
import remove from "../../assets/remove.png";
import CartContext from "../../contexts/CartContext";
import { toast } from "react-toastify";
import { checkoutAPI } from "../../Services/orderServices";

const CartPage = () => {
    const [subTotal, setSubTotal] = useState(0);
    const userObj = useContext(UserContext);
    const { cart, removeFromCart, updateCart, setCart } =
        useContext(CartContext);

    useEffect(() => {
        let total = 0;

        cart.forEach((item) => {
            total += item.product.price * item.quantity;
        });

        setSubTotal(total);
    }, [cart]);

    const checkout = () => {
        const oldCart = [...cart];
        setCart([]);

        checkoutAPI()
            .then(() => {
                toast.success("Order placed successfully!");
            })
            .catch(() => {
                toast.error("Order failed!");
                setCart(oldCart);
            });
    };

    return (
        <section className="align_center cart_page">
            <div className="align_center user_info">
                <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/profile/${userObj?.profilePic}`}
                    alt="user profile"
                />

                <div>
                    <p className="user_name">Name: {userObj?.name}</p>
                    <p className="user_email">Email: {userObj?.email}</p>
                    <p className="user_account">
                        Account: {userObj?.account}
                    </p>
                </div>
            </div>

            <Table headings={["Item", "Price", "Quantity", "Total", "Remove"]}>
                <tbody>
                    {cart.map(({ product, quantity }) => (
                        <tr key={product._id}>
                            <td>{product.title}</td>
                            <td>${product.price}</td>

                            <td className="align_center table_quantity_input">
                                <QuantityInput
                                    quantity={quantity}
                                    stock={product.stock}
                                    setQuantity={updateCart}
                                    cartPage={true}
                                    productId={product._id}
                                />
                            </td>

                            <td>${product.price * quantity}</td>

                            <td>
                                <img
                                    src={remove}
                                    alt="remove icon"
                                    className="cart_remove_icon"
                                    onClick={() => removeFromCart(product._id)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <table className="cart_bill">
                <tbody>
                    <tr>
                        <td>Subtotal</td>
                        <td>${subTotal}</td>
                    </tr>

                    <tr>
                        <td>Shipping Charge</td>
                        <td>${cart.length > 0 ? "5.00" : "0.00"}</td>
                    </tr>

                    <tr className="cart_bill_final">
                        <td>Total</td>
                        <td>${cart.length > 0 ? subTotal + 5 : 0}</td>
                    </tr>
                </tbody>
            </table>

            <button
                className="search_button Checkout_button"
                onClick={checkout}
                disabled={cart.length === 0}
            >
                Checkout
            </button>
        </section>
    );
};

export default CartPage;