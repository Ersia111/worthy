import './Order.css';

function Order({
  products,
  designs,
  formData,
  setFormData,
  selectedDesign,
  editingOrderId,
  handleChange,
  handleSubmit,
  goToPage,
}) {
  return (
    <main className="page">
      <section className="section orderSection">
        <div className="orderPreviewSide">
          <button className="backButton" onClick={() => goToPage('home')}>
            ← Back Home
          </button>

          <h2>{editingOrderId ? 'Edit Your Order' : 'Create Your Order'}</h2>
          <p className="sectionIntro">
            Fill the form to create a personalized order. After adding it, the order
            will be saved in your cart and can be edited later.
          </p>

          <div
            className="productColorPreview"
            style={{
              '--mainColor': selectedDesign.colors[0],
              '--secondColor': selectedDesign.colors[1],
              '--accentColor': selectedDesign.colors[2],
            }}
          >
            <div className="realProductScene">
              {formData.product.includes('Self-care') ? (
                <div className="selfcareBoxPreview">
                  <div className="selfcareLid"></div>
                  <div className="selfcareBoxBody">
                    <div className="selfcareRibbonVertical"></div>
                    <div className="selfcareRibbonHorizontal"></div>
                    <div className="selfcareBoxLabel">
                      <strong>Worthy</strong>
                      <span>Self-care Box</span>
                      <small>{selectedDesign.name}</small>
                    </div>
                  </div>
                  <div className="selfcareMiniItems">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              ) : formData.product.includes('Make-up') ? (
                <div className="makeupPreviewSet">
                  <div className="makeupItem lipstickProduct">
                    <div className="lipstickCap"></div>
                    <div className="lipstickStick"></div>
                    <div className="lipstickBase">W</div>
                  </div>

                  <div className="makeupItem paletteProduct">
                    <div className="paletteMirror"></div>
                    <div className="paletteColors">
                      {selectedDesign.colors.map((color) => (
                        <span key={color} style={{ backgroundColor: color }}></span>
                      ))}
                    </div>
                    <strong>Worthy</strong>
                  </div>

                  <div className="makeupItem compactProduct">
                    <div className="compactTop">Worthy</div>
                    <div className="compactGlow"></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="foamBubble foamOne"></div>
                  <div className="foamBubble foamTwo"></div>
                  <div className="foamBubble foamThree"></div>

                  <div className="previewProductBottle">
                    <div className="previewBottleCap">
                      <span></span>
                    </div>
                    <div className="previewBottleNeck"></div>
                    <div className="previewBottleBody">
                      <div className="bottleHighlight"></div>
                      <div className="previewBottleLabel">
                        <small>Custom formula</small>
                        <strong>
                          {formData.product.includes('Shampoo')
                            ? 'Smoothing Shampoo'
                            : formData.product}
                        </strong>
                        <em>{selectedDesign.name}</em>
                        <span>With personalized care</span>
                        <p>300ml</p>
                      </div>
                      <div className="verticalBrand">Worthy</div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <p>Product preview changes with your selected design colors.</p>
          </div>
        </div>

        <form className="orderForm" onSubmit={handleSubmit}>
          <label>Client Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Example: Jona"
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Example: jona@email.com"
            required
          />

          <label>Product Type</label>
          <select name="product" value={formData.product} onChange={handleChange}>
            {products.map((product) => (
              <option key={product.id}>{product.name}</option>
            ))}
          </select>

          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          <label>Max Price</label>
          <input
            name="maxPrice"
            value={formData.maxPrice}
            onChange={handleChange}
            placeholder="Example: 25€"
            required
          />

          <label>Choose Design</label>
          <div className="designGrid">
            {designs.map((design) => (
              <button
                type="button"
                className={
                  formData.design === design.name
                    ? 'designOption selectedDesign'
                    : 'designOption'
                }
                key={design.id}
                onClick={() => setFormData({ ...formData, design: design.name })}
              >
                <div className="designPreview">
                  {design.colors.map((color) => (
                    <span key={color} style={{ backgroundColor: color }}></span>
                  ))}
                </div>
                <strong>{design.name}</strong>
                <small>{design.style}</small>
              </button>
            ))}
          </div>

          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Example: sensitive skin, soft fragrance, pastel packaging..."
            rows="4"
          ></textarea>

          <button type="submit">
            {editingOrderId ? 'Save Changes' : 'Add Order'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Order;
