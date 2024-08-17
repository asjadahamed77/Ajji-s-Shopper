import React, { useContext } from 'react';
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart } = useContext(ShopContext);

  if (!product) {
    return <div>Loading...</div>; // Or a spinner or any other fallback UI
  }

  return (
    <div className='productdisplay'>
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image} alt={product.name} />
          <img src={product.image} alt={product.name} />
          <img src={product.image} alt={product.name} />
          <img src={product.image} alt={product.name} />
        </div>
        <div className="productdisplay-img">
          <img src={product.image} alt={product.name} className="productdisplay-main-img" />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-star">
          <img src={star_icon} alt="star icon" />
          <img src={star_icon} alt="star icon" />
          <img src={star_icon} alt="star icon" />
          <img src={star_icon} alt="star icon" />
          <img src={star_dull_icon} alt="dull star icon" />
          <p>(122)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">${product.old_price}</div>
          <div className="productdisplay-right-price-new">${product.new_price}</div>
        </div>
        <div className="productdisplay-right-description">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta veniam beatae incidunt autem delectus? Minima excepturi hic dicta aspernatur incidunt.
        </div>
        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            <div>S</div>
            <div>M</div>
            <div>L</div>
            <div>XL</div>
            <div>XXL</div>
          </div>
        </div>
        <button onClick={() => { addToCart(product.id) }}>ADD TO CART</button>
        <p className="productdisplay-right-category"><span>Category: </span>Women, T-Shirt, Crop Top</p>
        <p className="productdisplay-right-category"><span>Tags: </span>Modern, Latest</p>
      </div>
    </div>
  );
}

export default ProductDisplay;
