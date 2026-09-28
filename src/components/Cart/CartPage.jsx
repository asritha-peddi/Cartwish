import React, { useEffect, useState, useContext } from "react";
import UserContext from "../../contexts/UserContext";
import "./CartPage.css";
import user from "../../assets/user.webp"; // Assuming you have a user image
import Table from "../Common/Table"; // Assuming you have a Table component
import QuantityInput from "../SingleProduct/QuantityInput"; // Importing the QuantityInput component
import remove from "../../assets/remove.png"; // Assuming you have a remove icon
import CartContext from "../../contexts/CartContext"; // Importing CartContext
import { toast } from "react-toastify"; // Importing toast for notifications
import { set } from './../../../node_modules/zod/v4/classic/schemas';
import { checkoutAPI } from "../../Services/orderServices";
import IFrame from "../../iFrame/iFrame"; // Importing the IFrame component
import { getUser } from '../../Services/userServices';




const CartPage = () => {
	const [subTotal, setSubTotal] = useState(0);
	const userObj = useContext(UserContext); // Using UserContext to get user info
	const { cart, removeFromCart, updateCart, setCart } = useContext(CartContext);
	useEffect(() => {
		let total = 0;
		cart.forEach((item) => {
			
			total += item.product.price * item.quantity;
		});
		setSubTotal(total);
	}, [cart]);

	const checkout = () => {
		const oldCart = [...cart];
		setCart([]); // Clear the cart after successful checkout
		checkoutAPI()
			.then(() => {toast.success("Order placed successfully!");})
			.catch((error) => {toast.error("Order failed!");
				setCart(oldCart); // Restore old cart on error
			});
	};

	return (
		<><section className=" align_center cart_page">
			<div className="align_center user_info">
				<img
					src={`${import.meta.env.VITE_BACKEND_URL}/profile/${userObj?.profilePic}`}
					alt="user profile" />
				<div>
					<p className="user_name">Name: {userObj?.name}</p>
					<p className="user_email">Email: {userObj?.email}</p>
					<p className="user_account">Account: {userObj?.account}</p>  {/* modified*/}
				</div>
			</div>
			<Table headings={["Item", "Price", "Quantity", "Total", "Remove"]}>
				{/* Map through your data and create table rows here */}
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
									productId={product._id} />
							</td>
							<td>${product.price * quantity}</td>
							<td>
								<img
									src={remove}
									alt="remove icon"
									className="cart_remove_icon"
									onClick={() => removeFromCart(product._id)} />
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
						<td>$5.00</td>
					</tr>
					<tr className="cart_bill_final">
						<td>Total</td>
						<td>${subTotal + 5}</td>
					</tr>
				</tbody>
			</table>
			<button className="search_button Checkout_button" onClick={checkout}>Checkout</button>
		</section><div>
				<IFrame
					src="/iFrame/index.html"
					title="Example IFrame"
					width={600}
					height={800} 
					position="bottom-right"
					/>
			</div></>
	);
};



export default CartPage;
