import './Products.css'

function Products({ products, designs, goToPage, startOrder, addProductToCart }) {
  return (
    <main className="page">
      <section className="section">
        <button className="backButton" type="button" onClick={() => goToPage('/')}>
          ← Back Home
        </button>

        <h2>Choose Your Product</h2>

        <p className="sectionIntro">
          Pick a product type and personalize it based on your own routine.
        </p>

        <div className="cards">
          {products.map((product) => (
            <div className="card productCard" key={product.id}>
              {product.id === 'shampoo' && (
                <div
                  className="productVisual shampooVisual"
                  style={{
                    '--mainColor': designs[0].colors[0],
                    '--secondColor': designs[0].colors[1],
                    '--accentColor': designs[0].colors[2],
                  }}
                >
                  <div className="shampooCardBottle">
                    <div className="shampooCardCap">
                      <span></span>
                    </div>
                    <div className="shampooCardNeck"></div>
                    <div className="shampooCardBody">
                      <div className="shampooCardHighlight"></div>
                      <div className="shampooCardLabel">
                        <small>Custom formula</small>
                        <strong>Worthy</strong>
                        <span>Personalized Shampoo</span>
                        <em>300ml</em>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {product.id === 'makeup' && (
                <div
                  className="productVisual makeupVisual"
                  style={{
                    '--mainColor': designs[0].colors[0],
                    '--secondColor': designs[0].colors[1],
                    '--accentColor': designs[0].colors[2],
                  }}
                >
                  <div className="realMakeupMini">
                    <div className="miniLipstick">
                      <span></span>
                      <strong>W</strong>
                    </div>

                    <div className="miniPalette">
                      <span></span>
                      <div>
                        <i></i>
                        <i></i>
                        <i></i>
                      </div>
                      <strong>Worthy</strong>
                    </div>

                    <div className="miniCompact">W</div>
                  </div>
                </div>
              )}

              {product.id === 'selfcare' && (
                <div
                  className="productVisual selfcareVisual"
                  style={{
                    '--mainColor': designs[0].colors[0],
                    '--secondColor': designs[0].colors[1],
                    '--accentColor': designs[0].colors[2],
                  }}
                >
                  <div className="selfcareBoxPreview miniSelfcarePreview">
                    <div className="selfcareLid"></div>
                    <div className="selfcareBoxBody">
                      <div className="selfcareRibbonVertical"></div>
                      <div className="selfcareRibbonHorizontal"></div>
                      <div className="selfcareBoxLabel">
                        <strong>Worthy</strong>
                        <span>Self-care Box</span>
                      </div>
                    </div>
                    <div className="selfcareMiniItems">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}

              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>
                <strong>Price range:</strong> {product.priceRange}
              </p>

              <div className="miniFeatures">
                {product.features.map((feature) => (
                  <span key={feature}>{feature}</span>
                ))}
              </div>

              <div className="productActions">
                <button type="button" onClick={() => startOrder(product.name)}>
                  Customize
                </button>

                <button
                  type="button"
                  className="addCartButton"
                  onClick={() => addProductToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Products