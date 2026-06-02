import { useState, useRef } from 'react';
import './App.css';

// ----------------------------------------------------------------------
// Component: การ์ด 3D Holographic
// ----------------------------------------------------------------------
function Interactive3DCard({ image, name }) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState("");
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15; 
    const rotateY = ((x - centerX) / centerX) * 15;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`);
    
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlareStyle({
      opacity: 1,
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 215, 0, 0.5) 0%, transparent 60%)`
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle(`perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
    setGlareStyle({ opacity: 0 });
  };

  return (
    <div ref={cardRef} className="interactive-card-wrapper" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ transform: transformStyle }}>
      <img src={image} alt={name} className="interactive-card-image" />
      <div className="interactive-card-glare" style={glareStyle}></div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Component หลัก: ควบคุมหน้าจอทั้งหมด
// ----------------------------------------------------------------------
function App() {
  // 🌟 ไฮไลต์: State สำหรับระบบ Login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [currentView, setCurrentView] = useState("market"); 
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);

  const [balance, setBalance] = useState(12450);
  const [transactions, setTransactions] = useState([
    { id: 1, title: "ขาย Mewtwo GX", amount: "+฿1,200", isIncome: true, date: "14 พ.ค. 69" },
    { id: 2, title: "ซื้อ Pikachu VMAX", amount: "-฿3,500", isIncome: false, date: "12 พ.ค. 69" },
    { id: 3, title: "เติมเงินเข้าระบบ", amount: "+฿5,000", isIncome: true, date: "10 พ.ค. 69" },
  ]);

  const allCards = [
    { id: 1, name: "Pikachu VMAX", price: "฿12,500", condition: "Mint", image: "https://images.pokemontcg.io/swsh4/44_hires.png" },
    { id: 2, name: "Charizard ex", price: "฿8,900", condition: "Near Mint", image: "https://images.pokemontcg.io/sv3/125_hires.png" },
    { id: 3, name: "Mewtwo GX", price: "฿4,200", condition: "Played", image: "https://images.pokemontcg.io/sm35/78_hires.png" },
    { id: 4, name: "Rayquaza VMAX", price: "฿5,500", condition: "Mint", image: "https://images.pokemontcg.io/swsh7/111_hires.png" },
  ];

  // ฟังก์ชันจัดการตอนกด Login
  const handleLogin = (e) => {
    e.preventDefault(); // ป้องกันเว็บรีเฟรชตอนกด Submit
    if (username !== "" && password !== "") {
      setIsLoggedIn(true);
    } else {
      alert("กรุณากรอก Username และ Password ให้ครบถ้วนครับ!");
    }
  };

  // ฟังก์ชันจัดการตอนกด Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView("market"); // รีเซ็ตหน้ากลับไปที่ตลาด
    setUsername("");
    setPassword("");
  };

  // ----------------------------------------------------------------------
  // หน้าจอ: Login
  // ----------------------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <div className="login-wrapper">
        <div className="login-box">
          <div className="login-logo">⚡</div>
          <h1 className="login-title">PIKACHU MARKET</h1>
          <p className="login-subtitle">ลงชื่อเข้าใช้เพื่อเข้าสู่ตลาดการ์ดระดับพรีเมียม</p>
          
          <form className="login-form" onSubmit={handleLogin}>
            <input 
              type="text" 
              placeholder="Username" 
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="buy-btn" style={{ marginTop: '8px' }}>
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    );
  }

  // (ส่วนที่เหลือทำงานปกติเมื่อ isLoggedIn = true)

  const displayedCards = allCards.filter(card =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (card) => {
    const newItem = { ...card, cartId: Math.random().toString() };
    setCart([...cart, newItem]);
    alert(`เพิ่ม ${card.name} ลงตะกร้าแล้ว!`);
    setCurrentView("market");
  };

  const removeFromCart = (cartIdToRemove) => {
    setCart(cart.filter(item => item.cartId !== cartIdToRemove));
  };

  const getCartTotalNumber = () => {
    return cart.reduce((sum, item) => {
      const numericPrice = parseInt(item.price.replace(/[^0-9]/g, ''));
      return sum + numericPrice;
    }, 0);
  };

  const handleCheckout = () => {
    const total = getCartTotalNumber();
    if (balance < total) {
      alert("ยอดเงินในกระเป๋าไม่พอ! กรุณาเติมเงิน 🥲");
      return;
    }
    setBalance(balance - total);
    const newTx = {
      id: Date.now(),
      title: `ซื้อการ์ด ${cart.length} ใบ`,
      amount: `-฿${total.toLocaleString()}`,
      isIncome: false,
      date: "02 มิ.ย. 69"
    };
    setTransactions([newTx, ...transactions]);
    setCart([]);
    alert("ชำระเงินสำเร็จ! ขอบคุณที่อุดหนุนครับ 🎉");
    setCurrentView("wallet");
  };

  // --- หน้า Detail ---
  if (currentView === "detail" && selectedCard) {
    return (
      <div className="app-container">
        <header className="header">
          <button className="back-btn" onClick={() => setCurrentView("market")}>⬅ ย้อนกลับ</button>
          <h1 className="title" style={{ fontSize: '18px' }}>{selectedCard.name}</h1>
          <div style={{ width: '60px' }}></div>
        </header>

        <div className="detail-container">
          <Interactive3DCard image={selectedCard.image} name={selectedCard.name} />
          <div className="action-box">
            <p style={{ color: '#aaaaaa', marginBottom: '8px' }}>ราคาปัจจุบัน</p>
            <h2 style={{ color: '#FFD700', fontSize: '32px' }}>{selectedCard.price}</h2>
            <p style={{ marginTop: '8px', marginBottom: '20px' }}>สภาพ: {selectedCard.condition}</p>
            <button className="buy-btn" onClick={() => addToCart(selectedCard)}>หยิบใส่ตะกร้า</button>
          </div>
        </div>
      </div>
    );
  }

  // --- หน้า Wallet ---
  if (currentView === "wallet") {
    return (
      <div className="app-container">
        <header className="header">
          <button className="back-btn" onClick={() => setCurrentView("market")}>⬅ ตลาด</button>
          <h1 className="title">MY WALLET</h1>
          <div style={{ width: '60px' }}></div>
        </header>

        <div className="wallet-container">
          <div className="balance-card">
            <p className="balance-label">ยอดเงินปัจจุบัน</p>
            <p className="balance-amount">฿{balance.toLocaleString()}</p>
          </div>
          <h2 className="section-title" style={{ padding: 0 }}>TRANSACTION HISTORY</h2>
          <div className="tx-list">
            {transactions.map(tx => (
              <div key={tx.id} className="tx-item">
                <div className="tx-info">
                  <span className="tx-title">{tx.isIncome ? '⬆️' : '⬇️'} {tx.title}</span>
                  <span className="tx-date">{tx.date}</span>
                </div>
                <span className={`tx-amount ${tx.isIncome ? 'tx-income' : 'tx-expense'}`}>{tx.amount}</span>
              </div>
            ))}
          </div>

          {/* ปุ่ม Logout ในหน้ากระเป๋าเงิน */}
          <button className="logout-btn" onClick={handleLogout}>
            ออกจากระบบ
          </button>
        </div>
      </div>
    );
  }

  // --- หน้า ตะกร้าสินค้า (Cart) ---
  if (currentView === "cart") {
    return (
      <div className="app-container">
        <header className="header">
          <button className="back-btn" onClick={() => setCurrentView("market")}>⬅ ตลาด</button>
          <h1 className="title">MY CART</h1>
          <div style={{ width: '60px' }}></div>
        </header>

        <div className="wallet-container">
          {cart.length === 0 ? (
            <div className="empty-cart">ตะกร้าของคุณว่างเปล่า 🥲<br/>ไปหาการ์ดแรร์ๆ กันเถอะ!</div>
          ) : (
            <>
              <div className="tx-list">
                {cart.map(item => (
                  <div key={item.cartId} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-info">
                      <h4 style={{ color: 'white' }}>{item.name}</h4>
                      <p style={{ color: '#aaaaaa', fontSize: '12px' }}>{item.condition}</p>
                      <h4 style={{ color: '#FFD700', marginTop: '4px' }}>{item.price}</h4>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.cartId)}>ลบ</button>
                  </div>
                ))}
              </div>

              <div className="checkout-box">
                <p style={{ color: '#aaaaaa', marginBottom: '8px' }}>ยอดชำระทั้งหมด</p>
                <h2 style={{ color: '#FFD700', fontSize: '32px' }}>฿{getCartTotalNumber().toLocaleString()}</h2>
                <button className="buy-btn" onClick={handleCheckout}>ยืนยันการสั่งซื้อ</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // --- หน้า Market (หน้าแรก) ---
  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">PIKACHU MARKET</h1>
        <div className="header-actions">
          <div className="cart-btn-wrapper" onClick={() => setCurrentView("cart")} style={{ cursor: 'pointer' }}>
            <span style={{ fontSize: '24px' }}>🛒</span>
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </div>
          <button className="wallet-btn" onClick={() => setCurrentView("wallet")}>💳</button>
        </div>
      </header>

      <div className="search-container">
        <input type="text" placeholder="ค้นหาการ์ดที่ต้องการ..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
      </div>

      <h2 className="section-title">⚡ HOT DEALS</h2>

      <div className="card-grid">
        {displayedCards.map((card, index) => (
          <div key={index} className="card" onClick={() => { setSelectedCard(card); setCurrentView("detail"); }}>
            <img src={card.image} alt={card.name} className="card-image" />
            <div className="card-info">
              <h3 className="card-name">{card.name}</h3>
              <p className="card-condition">สภาพ: {card.condition}</p>
              <p className="card-price">{card.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;