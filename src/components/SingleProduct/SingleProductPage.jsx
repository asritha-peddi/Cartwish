import React, { useContext, useState } from 'react';
import './SingleProductPage.css';
import QuantityInput from './QuantityInput';
import { useParams } from 'react-router-dom';
import useData from '../../hooks/useData'; // Assuming you have a custom hook for fetching data
import Loader from '../../components/Common/Loader';
import CartContext from '../../contexts/CartContext'; // Importing CartContext
import UserContext from '../../contexts/UserContext';


const SingleProductPage = () => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const { id } = useParams();
    const {data: product, error, isLoading} = useData(`/products/${id}`);
    const { addToCart } = useContext(CartContext); // Assuming you have a CartContext to manage cart state
    const user = useContext(UserContext);
  return (
    <section className="align_center single_product">
        {error && <em className="form_error"> {error}</em>}
        {isLoading && <Loader />}
     {product && <> <div className="align_center">
        <div className="single_product_thumbnails">
            {
                product.images.map((image, index) => (
                    <img key={index} src={`${import.meta.env.VITE_BACKEND_URL}/products/${image}`} alt={product.title} className={selectedImage === index ? 'active' : ''} onClick={() => setSelectedImage(index)} />
                ))
            }
 </div>

        <img
            src={`${import.meta.env.VITE_BACKEND_URL}/products/${product.images[selectedImage]}`}
            alt={product.title}
            className="single_product_display"
        />

     </div>
             <div className="single_product_details">
        <h1 className="single_product_title">{product.title}</h1>
        <p className="single_product_description">{product.description}</p>
        <p className="single_product_price">${product.price.toFixed(2)}</p>

        {user && <><h2 className="quantity_title">Quantity:</h2>
        <div className="align_center quantity_input">
            {/* <button className="quantity_input_button" disabled>{" "}-{" "}</button>
            <p className="quantity_input_count">1</p>
            <button className="quantity_input_button" disabled>{" "}+{" "}</button> */}
            <QuantityInput 
            quantity={quantity} 
            setQuantity={setQuantity} 
            stock={product.stock} />
        </div>
        <button className="search_button add_cart" 
        onClick={() => addToCart(product, quantity)}>
            Add to Cart</button></>}

     </div></>}
    </section>
  )
}

export default SingleProductPage
