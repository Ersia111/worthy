import { useEffect, useMemo, useState } from 'react'
import './App.css'
import './Order.css'
import Login from './login'
import Products from './Products'
import Order from './Order'

const products = [
  {
    id: 'shampoo',
    name: 'Personalized Shampoo',
    description: 'A custom shampoo based on hair type, fragrance preference and routine.',
    priceRange: '12€ - 28€',
    features: ['Hair type formula', 'Custom fragrance', 'Bottle design'],
  },
  {
    id: 'makeup',
    name: 'Custom Make-up',
    description: 'A personalized make-up product with selected tone, finish and packaging style.',
    priceRange: '15€ - 35€',
    features: ['Tone selection', 'Finish choice', 'Packaging style'],
  },
  {
    id: 'selfcare',
    name: 'Self-care Box',
    description: 'A curated self-care box created around budget, mood and personal needs.',
    priceRange: '20€ - 55€',
    features: ['Curated items', 'Budget based', 'Gift-ready design'],
  },
]

const orderStatuses = ['Received', 'Preparing', 'Packaging', 'Shipping', 'Delivered']

const designs = [
  {
    id: 'soft-pink',
    name: 'Soft Pink Minimal',
    style: 'Clean pink packaging with simple typography',
    colors: ['#f8c8dc', '#fff7fb', '#d35aa0'],
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    style: 'Elegant cream design with gold details',
    colors: ['#f7e7ce', '#d4af37', '#fffaf0'],
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    style: 'Fresh blue packaging inspired by clean skincare',
    colors: ['#d9f3ff', '#7cc7e8', '#ffffff'],
  },
  {
    id: 'rose-glow',
    name: 'Rose Glow',
    style: 'Romantic rose design with soft feminine tones',
    colors: ['#ffb6c1', '#b93c8c', '#fff0f5'],
  },
  {
    id: 'lavender-dream',
    name: 'Lavender Dream',
    style: 'Calm purple packaging for a relaxing self-care feeling',
    colors: ['#d8bfd8', '#8f5fbf', '#f8f0ff'],
  },
  {
    id: 'clean-white',
    name: 'Clean White',
    style: 'Professional white design with a modern clinical look',
    colors: ['#ffffff', '#e8e8e8', '#39243a'],
  },
  {
    id: 'sunset-peach',
    name: 'Sunset Peach',
    style: 'Warm peach packaging with soft summer energy',
    colors: ['#ffd1b3', '#ff8fab', '#fff7ed'],
  },
]

const emptyForm = {
  name: '',
  email: '',
  product: 'Personalized Shampoo',
  quantity: 1,
  maxPrice: '',
  design: designs[0].name,
  notes: '',
}

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('worthyOrders')
    return savedOrders ? JSON.parse(savedOrders) : []
  })
  const [editingOrderId, setEditingOrderId] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [lastOrderId, setLastOrderId] = useState(null)
  const [cartMessage, setCartMessage] = useState('')

  useEffect(() => {
    localStorage.setItem('worthyOrders', JSON.stringify(orders))
  }, [orders])

  const cartTotal = useMemo(() => {
    return orders.reduce((total, order) => total + Number(order.quantity || 0), 0)
  }, [orders])

  const lastOrder = orders.find((order) => order.id === lastOrderId)
  const selectedDesign = designs.find((design) => design.name === formData.design) || designs[0]
  function goToPage(page) {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  function startOrder(productName) {
    setFormData({
      ...emptyForm,
      product: productName,
    })
    setEditingOrderId(null)
    goToPage('order')
  }
  function addProductToCart(product) {
    const newOrder = {
      id: Date.now(),
      name: 'Guest user',
      email: 'guest@worthy.com',
      product: product.name,
      quantity: 1,
      maxPrice: product.priceRange.split(' - ')[1] || product.priceRange,
      design: designs[0].name,
      notes: 'Quick add from product page. You can edit this item from the cart.',
      status: 'Received',
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
    }

    setOrders([...orders, newOrder])
    setLastOrderId(newOrder.id)
    setCartMessage(`${product.name} was added to your cart`)
    setTimeout(() => setCartMessage(''), 2200)
    setCurrentPage('products')
  }

  function goToCart() {
    setCurrentPage('cart')
    window.scrollTo(0, 0)
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (editingOrderId) {
      setOrders(
        orders.map((order) =>
          order.id === editingOrderId
            ? {
                ...order,
                ...formData,
                updatedAt: new Date().toLocaleString(),
              }
            : order
        )
      )
      setLastOrderId(editingOrderId)
      setEditingOrderId(null)
      setFormData(emptyForm)
      goToPage('confirmation')
      return
    }

    const newOrder = {
      id: Date.now(),
      ...formData,
      status: 'Received',
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
    }

    setOrders([...orders, newOrder])
    setLastOrderId(newOrder.id)
    setFormData(emptyForm)
    goToPage('confirmation')
  }

  function deleteOrder(id) {
    setOrders(orders.filter((order) => order.id !== id))
    if (lastOrderId === id) {
      setLastOrderId(null)
    }
  }

  function editOrder(order) {
    setFormData({
      name: order.name,
      email: order.email || '',
      product: order.product,
      quantity: order.quantity,
      maxPrice: order.maxPrice,
      design: order.design,
      notes: order.notes || '',
    })
    setEditingOrderId(order.id)
    goToPage('order')
  }

  function updateStatus(id, newStatus) {
    setOrders(
      orders.map((order) =>
        order.id === id
          ? {
              ...order,
              status: newStatus,
              updatedAt: new Date().toLocaleString(),
            }
          : order
      )
    )
  }

  function moveStatus(id, direction) {
    const selectedOrder = orders.find((order) => order.id === id)
    if (!selectedOrder) return

    const currentIndex = orderStatuses.indexOf(selectedOrder.status)
    const nextIndex = currentIndex + direction

    if (nextIndex < 0 || nextIndex >= orderStatuses.length) return
    updateStatus(id, orderStatuses[nextIndex])
  }

  function clearOrders() {
    setOrders([])
    setLastOrderId(null)
  }

  function buyCartNow() {
    if (orders.length === 0) return

    setCartMessage(`Purchase completed for ${cartTotal} product${cartTotal > 1 ? 's' : ''}`)
    setOrders([])
    setLastOrderId(null)
    setEditingOrderId(null)
    setCurrentPage('home')
    setTimeout(() => setCartMessage(''), 2600)
  }

  return (
    <div className="app">
      <header className="navbar">
        <button className="logoButton" onClick={() => goToPage('home')}>
          <img src="/images/worthy_logo.png" alt="Worthy logo" />
        </button>

        <nav>
          <button onClick={() => goToPage('home')}>Home</button>
          <button onClick={() => goToPage('products')}>Products</button>
          <button onClick={() => goToPage('order')}>Order</button>
          <button onClick={() => goToPage('login')}>Login / Signup</button>
        </nav>

        <button className="cartButton" onClick={goToCart}>
          🛒
          {cartTotal > 0 && <span>{cartTotal}</span>}
        </button>
      </header>

      {cartMessage && (
        <div className="cartPopup">
          <span>✓</span>
          <p>{cartMessage}</p>
        </div>
      )}

{currentPage === 'home' && (
  <main className="page homePage">
    <section className="hero">
      <div className="heroText">
        <p className="tag">Personalized products • Custom brands • Made for you</p>
        <h2>Create your own beauty brand in one click.</h2>
        <p>
          Bring your idea. We design the product, the packaging and the brand feeling.
          Worthy turns personalized beauty concepts into products that look ready to sell.
        </p>

        <div className="heroButtons">
          <button className="mainButton" onClick={() => goToPage('products')}>
            Explore Products
          </button>
          <button className="secondButton" onClick={() => goToPage('order')}>
            Start Creating
          </button>
        </div>
      </div>

      <div className="hero3dStage">
        <div className="floatingProduct productOne">
          <div className="floatingCap"></div>
          <div className="floatingBottle">
            <strong>Worthy</strong>
            <span>Shampoo</span>
          </div>
        </div>

        <div className="floatingProduct productTwo">
          <div className="floatingPalette">
            <strong>Worthy</strong>
            <div>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <div className="floatingProduct productThree">
          <div className="floatingBox">
            <strong>Worthy</strong>
            <span>Self-care Box</span>
          </div>
        </div>

        <div className="hero3dTextCard">
          <span className="cardLabel">Brand builder</span>
          <h3>Your idea, our production.</h3>
          <p>Custom products, packaging, colors and concept in one simple flow.</p>
        </div>
      </div>
    </section>

    <section className="brandScrollSection">
      <div className="stickyBrandText">
        <p className="tag">Build your own product line</p>
        <h2>Create your business in one click.</h2>
        <p>
          Personalized products. Custom packaging. A brand that looks real from the first mockup.
          You bring the idea, we handle everything else.
        </p>
        <button className="mainButton" onClick={() => goToPage('order')}>
          Start Creating
        </button>
      </div>

      <div className="scrollProductShowcase">
        <div className="showcaseCard showcaseOne">
          <span>01</span>
          <h3>Choose your product</h3>
          <p>Shampoo, make-up or a self-care box built around your concept.</p>
        </div>
        <div className="showcaseCard showcaseTwo">
          <span>02</span>
          <h3>Create a brand</h3>
          <p>Select colors, design style and packaging that feels like your identity.</p>
        </div>
        <div className="showcaseCard showcaseThree">
          <span>03</span>
          <h3>We make it real</h3>
          <p>You bring the idea. We realize the product, design and brand experience.</p>
        </div>
      </div>
    </section>
  </main>
)}

      {currentPage === 'products' && (
        <Products
          products={products}
          designs={designs}
          goToPage={goToPage}
          startOrder={startOrder}
          addProductToCart={addProductToCart}
        />
      )}

      {currentPage === 'order' && (
        <Order
          products={products}
          designs={designs}
          formData={formData}
          setFormData={setFormData}
          selectedDesign={selectedDesign}
          editingOrderId={editingOrderId}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          goToPage={goToPage}
        />
      )}
      {currentPage === 'login' && (
        <Login
          onBackHome={() => goToPage('home')}
          onGoAdmin={() => goToPage('admin')}
        />
      )}

      {currentPage === 'confirmation' && (
        <main className="page">
          <section className="section adminSection">
            <button className="backButton" onClick={() => goToPage('home')}>
              ← Back Home
            </button>
            <h2>Order Confirmed</h2>
            <p className="sectionIntro">
              Your personalized request has been saved. You can still edit it from the cart.
            </p>

            {lastOrder && (
              <div className="orderCard">
                <div>
                  <h3>{lastOrder.product}</h3>
                  <p><strong>Client:</strong> {lastOrder.name}</p>
                  <p><strong>Email:</strong> {lastOrder.email}</p>
                  <p><strong>Quantity:</strong> {lastOrder.quantity}</p>
                  <p><strong>Max Price:</strong> {lastOrder.maxPrice}</p>
                  <p><strong>Design:</strong> {lastOrder.design}</p>
                  <p><strong>Status:</strong> {lastOrder.status}</p>
                </div>

                <div className="orderActions">
                  <button onClick={goToCart}>View Cart</button>
                  <button onClick={() => goToPage('products')}>Continue Shopping</button>
                </div>
              </div>
            )}
          </section>
        </main>
      )}

      {currentPage === 'cart' && (
        <main className="page">
          <section className="section adminSection">
            <button className="backButton" onClick={() => goToPage('home')}>
              ← Back Home
            </button>
            <h2>Your Cart</h2>
            <p className="sectionIntro">
              Here you can view, edit or delete your current orders before they are processed.
            </p>

            {orders.length > 0 && (
              <div className="cartSummary">
                <div>
                  <strong>{orders.length}</strong>
                  <span>order item{orders.length > 1 ? 's' : ''}</span>
                </div>
                <div>
                  <strong>{cartTotal}</strong>
                  <span>total product{cartTotal > 1 ? 's' : ''}</span>
                </div>
                <button className="buyNowButton" onClick={buyCartNow}>Buy Now</button>
              </div>
            )}

            {orders.length === 0 ? (
              <p className="empty">Your cart is empty.</p>
            ) : (
              <div className="ordersList">
                {orders.map((order) => (
                  <div className="orderCard" key={order.id}>
                    <div>
                      <h3>{order.product}</h3>
                      <p><strong>Client:</strong> {order.name}</p>
                      <p><strong>Email:</strong> {order.email}</p>
                      <p><strong>Quantity:</strong> {order.quantity}</p>
                      <p><strong>Max Price:</strong> {order.maxPrice}</p>
                      <p><strong>Design:</strong> {order.design}</p>
                      <p><strong>Status:</strong> {order.status}</p>
                      {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
                    </div>

                    <div className="orderActions">
                      <button onClick={() => editOrder(order)}>Edit</button>
                      <button className="delete" onClick={() => deleteOrder(order.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      {currentPage === 'admin' && (
        <main className="page">
          <section className="section adminSection">
            <button className="backButton" onClick={() => goToPage('home')}>
              ← Back Home
            </button>
            <h2>Admin Dashboard</h2>
            <p className="sectionIntro">
              All orders appear here like a to-do dashboard for the admin.
            </p>

            {orders.length > 0 && (
              <div className="heroButtons">
                <button className="backButton" onClick={clearOrders}>
                  Clear All Orders
                </button>
              </div>
            )}

            {orders.length === 0 ? (
              <p className="empty">No orders yet.</p>
            ) : (
              <div className="ordersList">
                {orders.map((order) => (
                  <div className="orderCard" key={order.id}>
                    <div>
                      <h3>{order.product}</h3>
                      <p><strong>Client:</strong> {order.name}</p>
                      <p><strong>Email:</strong> {order.email}</p>
                      <p><strong>Quantity:</strong> {order.quantity}</p>
                      <p><strong>Max Price:</strong> {order.maxPrice}</p>
                      <p><strong>Design:</strong> {order.design}</p>
                      <p><strong>Status:</strong> {order.status}</p>
                      <p><strong>Created:</strong> {order.createdAt}</p>
                      <p><strong>Updated:</strong> {order.updatedAt}</p>
                      {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
                      <div className="miniFeatures">
                        {orderStatuses.map((status) => (
                          <span key={status}>{status === order.status ? `✓ ${status}` : status}</span>
                        ))}
                      </div>
                    </div>

                    <div className="orderActions">
                      <button onClick={() => moveStatus(order.id, -1)}>Previous</button>
                      <button onClick={() => moveStatus(order.id, 1)}>Next</button>
                      <button onClick={() => updateStatus(order.id, 'Received')}>Received</button>
                      <button onClick={() => updateStatus(order.id, 'Preparing')}>Preparing</button>
                      <button onClick={() => updateStatus(order.id, 'Packaging')}>Packaging</button>
                      <button onClick={() => updateStatus(order.id, 'Shipping')}>Shipping</button>
                      <button onClick={() => updateStatus(order.id, 'Delivered')}>Delivered</button>
                      <button onClick={() => editOrder(order)}>Edit</button>
                      <button className="delete" onClick={() => deleteOrder(order.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      <footer>
        <p>“You are already worthy. We only create for your reality.”</p>
      </footer>
    </div>
  )
}

export default App
