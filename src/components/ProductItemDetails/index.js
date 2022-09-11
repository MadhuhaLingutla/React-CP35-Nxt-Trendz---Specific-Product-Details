// Write your code here

import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import './index.css'

const productApiStatusList = {
  inprogress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failed: 'FAILED',
  initial: 'INITIAL',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    productApiStatus: productApiStatusList.initial,
    itemCount: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getFormatedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    style: data.style,
    title: data.title,
    totalReviews: data.total_reviews,
    similarProducts: data.similar_products.map(each => ({
      availability: each.availability,
      brand: each.brand,
      description: each.description,
      id: each.id,
      imageUrl: each.image_url,
      price: each.price,
      rating: each.rating,
      style: each.style,
      title: each.title,
      totalReviews: each.total_reviews,
    })),
  })

  getProductDetails = async () => {
    this.setState({productApiStatus: productApiStatusList.inprogress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiurl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiurl, options)
    if (response.ok === true) {
      const data = await response.json()
      const formatedData = this.getFormatedData(data)
      this.setState({
        productDetails: formatedData,
        productApiStatus: productApiStatusList.success,
      })
    } else {
      this.setState({productApiStatus: productApiStatusList.failed})
    }
  }

  continueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  loadingView = () => (
    <div testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  failedView = () => (
    <div className="fail-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="fail-image"
      />
      <h1 className="fail-view-description">Product Not Found</h1>
      <button
        className="continue-shopping-button"
        type="button"
        onClick={this.continueShopping}
      >
        Continue Shopping
      </button>
    </div>
  )

  decreaseCount = () => {
    const {itemCount} = this.state
    if (itemCount > 1) {
      this.setState({itemCount: itemCount - 1})
    }
  }

  increaseCount = () => {
    const {itemCount} = this.state
    this.setState({itemCount: itemCount + 1})
  }

  displaySimilarProduct = similarProductDetails => {
    const {brand, id, imageUrl, price, rating, title} = similarProductDetails
    const imageAlt = `similar product ${title}`
    return (
      <li className="similar-product-container" key={id}>
        <img className="similar-product-image" src={imageUrl} alt={imageAlt} />
        <h1 className="similar-product-heading">{title}</h1>
        <p className="similar-product-brand">by {brand}</p>
        <div className="price-rating-container">
          <p className="similar-product-price">Rs {price}/-</p>
          <div className="ratings-container">
            <p className="rating">{rating}</p>
            <img
              className="star-image"
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
            />
          </div>
        </div>
      </li>
    )
  }

  displayProductDetails = () => {
    console.log('Entering into product Details')
    const {productDetails, itemCount} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
      similarProducts,
    } = productDetails
    return (
      <div className="product-details-similar-products">
        <div className="product-details-container">
          <div className="product-image-container">
            <img className="product-image" src={imageUrl} alt="product" />
          </div>
          <div className="product-details-content-container">
            <h1 className="product-heading">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="reviews-container">
              <div className="ratings-container">
                <p className="rating">{rating}</p>
                <img
                  className="star-image"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </div>
              <p className="review-no">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <p className="availability">Available: {availability}</p>
            <p className="brand">Brand: {brand}</p>
            <hr />
            <div className="no-of-items-container">
              <button
                onClick={this.decreaseCount}
                type="button"
                className="decrement"
                testid="minus"
              >
                <BsDashSquare />
              </button>
              <p className="item-count">{itemCount}</p>
              <button
                onClick={this.increaseCount}
                type="button"
                className="increment"
                testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button className="cart-button" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="Similar-products-container">
          <h1 className="similar-main-heading">Similar Products</h1>
          <ul className="similar-products-list">
            {similarProducts.map(each => this.displaySimilarProduct(each))}
          </ul>
        </div>
      </div>
    )
  }

  renderDecisionMaker = () => {
    console.log('Entering into Decision Maker')
    const {productApiStatus} = this.state
    console.log('Product Status', productApiStatus)
    switch (productApiStatus) {
      case productApiStatusList.failed:
        return this.failedView()
      case productApiStatusList.success:
        return this.displayProductDetails()
      case productApiStatusList.inprogress:
        return this.loadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="product-item-details-view">
        <Header />
        {this.renderDecisionMaker()}
      </div>
    )
  }
}

export default ProductItemDetails
