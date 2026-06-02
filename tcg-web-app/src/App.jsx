import { useState, useRef } from 'react';
import './App.css';

// ----------------------------------------------------------------------
// 1. Component: การ์ด 3D Holographic
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
// 2. Component หลัก: ควบคุมหน้าจอและลอจิกทั้งหมด
// ----------------------------------------------------------------------
function App() {
  // 🌟 State สำหรับระบบบัญชี
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  
  // ข้อมูลฟอร์ม
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 🌟 ไฮไลต์: สร้างตะกร้าเก็บรายชื่อสมาชิกจำลอง
  const [users, setUsers] = useState([]);

  // State ตลาดและกระเป๋าเงิน
  const [currentView, setCurrentView] = useState("market"); 
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [balance, setBalance] = useState(12450);
  const [transactions, setTransactions] = useState([
    { id: 1, title: "ขาย Mewtwo GX", amount: "+฿1,200", isIncome: true, date: "14 พ.ค. 69" },
    { id: 2, title: "ซื้อ Pikachu VMAX", amount: "-฿3,500", isIncome: false, date: "12 พ.ค. 69" },
  ]);

  const allCards = [
    { id: 1, name: "Pikachu VMAX", price: "฿12,500", condition: "Mint", image: "https://images.pokemontcg.io/swsh4/44_hires.png" },
    { id: 2, name: "Charizard ex", price: "฿8,900", condition: "Near Mint", image: "https://images.pokemontcg.io/sv3/125_hires.png" },
    { id: 3, name: "Mewtwo GX", price: "฿4,200", condition: "Played", image: "https://images.pokemontcg.io/sm35/78_hires.png" },
    { id: 4, name: "Rayquaza VMAX", price: "฿5,500", condition: "Mint", image: "https://images.pokemontcg.io/swsh7/111_hires.png" },
  ];

  // ----------------------------------------------------------------------
  // ฟังก์ชันจัดการระบบบัญชี
  // ----------------------------------------------------------------------
  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("กรุณากรอก Username และ Password ให้ครบถ้วนครับ!");
      return;
    }

    // 1. เช็ครหัส Dev ก่อน
    if (username === "dev" && password === "1234") {
      setIsLoggedIn(true);
      setCurrentView("market");
      alert("ยินดีต้อนรับเข้าสู่โหมด Developer 🛠️");
      return;
    }

    // 2. เช็คจากรายชื่อที่สมัครเข้ามาใหม่
    const validUser = users.find(u => u.username === username && u.password === password);
    if (validUser) {
      setIsLoggedIn(true);
      setCurrentView("market");
      alert(`ยินดีต้อนรับคุณ ${username} 🎉`);
    } else {
      alert("Username หรือ Password ไม่ถูกต้อง หรือยังไม่ได้สมัครสมาชิกครับ!");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่องครับ!");
      return;
    }
    if (password !== confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง!");
      return;
    }
    
    // เช็คว่ามีคนใช้ชื่อนี้ไปหรือยัง
    const isExist = users.find(u => u.username === username);
    if (isExist || username === "dev") {
      alert("Username นี้มีผู้ใช้งานแล้ว กรุณาใช้ชื่ออื่นครับ!");
      return;
    }

    // เก็บข้อมูลลง State users
    setUsers([...users, { username, email, password }]);
    
    alert(`สมัครสมาชิกสำเร็จ! ยินดีต้อนรับคุณ ${username}\nตอนนี้คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านที่คุณตั้งไว้ได้เลยครับ!`);
    setAuthMode("login"); 
    setPassword("");
    setConfirmPassword("");
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!email) {
      alert("กรุณากรอกอีเมลของคุณครับ!");
      return;
    }
    alert(`ระบบได้ส่งลิงก์รีเซ็ตรหัสผ่านไปที่ ${email} เรียบร้อยแล้ว!`);
    setAuthMode("login");
    setEmail("");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthMode("login");
    setUsername("");
    setPassword("");
  };

  // ----------------------------------------------------------------------
  // หน้าจอ: Auth (ถ้ายังไม่ล็อกอิน)
  // ----------------------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <div className="auth-wrapper">
        <div className="auth-box">
          <div className="auth-logo">⚡</div>
          <h1 className="auth-title">PIKACHU MARKET</h1>
          
          {authMode === "forgot" ? (
            <p className="auth-subtitle">กู้คืนรหัสผ่านของคุณ</p>
          ) : (
            <p className="auth-subtitle">ตลาดการ์ดระดับพรีเมียม</p>
          )}

          {authMode !== "forgot" && (
            <div className="auth-tabs">
              <button className={`auth-tab-btn ${authMode === "login" ? "active" : ""}`} onClick={() => setAuthMode("login")}>เข้าสู่ระบบ</button>
              <button className={`auth-tab-btn ${authMode === "register" ? "active" : ""}`} onClick={() => setAuthMode("register")}>สมัครสมาชิก</button>
            </div>
          )}

          {authMode === "login" && (
            <form className="auth-form" onSubmit={handleLogin}>
              <input type="text" placeholder="Username" className="auth-input" value={username} onChange={(e) => setUsername(e.target.value)} />
              <input type="password" placeholder="Password" className="auth-input" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit" className="auth-btn-primary">เข้าสู่ระบบ</button>
              <button type="button" className="auth-text-link" onClick={() => setAuthMode("forgot")}>ลืมรหัสผ่านใช่หรือไม่?</button>
            </form>
          )}

          {authMode === "register" && (
            <form className="auth-form" onSubmit={handleRegister}>
              <input type="text" placeholder="Username" className="auth-input" value={username} onChange={(e) => setUsername(e.target.value)} />
              <input type="email" placeholder="Email" className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" className="auth-input" value={password} onChange={(e) => setPassword(e.target.value)} />
              <input type="password" placeholder="Confirm Password" className="auth-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <button type="submit" className="auth-btn-primary">สร้างบัญชี</button>
            </form>
          )}

          {authMode === "forgot" && (
            <form className="auth-form" onSubmit={handleForgotPassword}>
              <input type="email" placeholder="กรอกอีเมลของคุณ" className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button type="submit" className="auth-btn-primary">ส่งลิงก์รีเซ็ตรหัสผ่าน</button>
              <button type="button" className="auth-text-link" onClick={() => setAuthMode("login")}>⬅ กลับไปหน้าเข้าสู่ระบบ</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // ฟังก์ชันและหน้าจอฝั่ง E-Commerce (ทำงานเมื่อ Login แล้ว)
  // ----------------------------------------------------------------------
  const displayedCards = allCards.filter(card => card.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const addToCart = (card) => {
    setCart([...cart, { ...card, cartId: Math.random().toString() }]);
    alert(`เพิ่ม ${card.name} ลงตะกร้าแล้ว!`);
    setCurrentView("market");
  };
  
  const removeFromCart = (id) => setCart(cart.filter(item => item.cartId !== id));
  
  const getCartTotalNumber = () => cart.reduce((sum, item) => sum + parseInt(item.price.replace(/[^0-9]/g, '')), 0);

  const handleCheckout = () => {
    const total = getCartTotalNumber();
    if (balance < total) return alert("ยอดเงินในกระเป๋าไม่พอ! กรุณาเติมเงิน 🥲");
    setBalance(balance - total);
    setTransactions([
      { id: Date.now(), title: `ซื้อการ์ด ${cart.length} ใบ`, amount: `-฿${total.toLocaleString()}`, isIncome: false, date: "02 มิ.ย. 69" }, 
      ...transactions
    ]);
    setCart([]);
    alert("ชำระเงินสำเร็จ! ขอบคุณที่อุดหนุนครับ 🎉");
    setCurrentView("wallet");
  };

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
            <button className="auth-btn-primary" onClick={() => addToCart(selectedCard)}>หยิบใส่ตะกร้า</button>
          </div>
        </div>
      </div>
    );
  }

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
                <div className="tx-info"><span className="tx-title">{tx.isIncome ? '⬆️' : '⬇️'} {tx.title}</span><span className="tx-date">{tx.date}</span></div>
                <span className={`tx-amount ${tx.isIncome ? 'tx-income' : 'tx-expense'}`}>{tx.amount}</span>
              </div>
            ))}
          </div>
          <button className="logout-btn" onClick={handleLogout}>ออกจากระบบ</button>
        </div>
      </div>
    );
  }

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
            <div className="empty-cart">ตะกร้าของคุณว่างเปล่า 🥲</div>
          ) : (
            <>
              <div className="tx-list">
                {cart.map(item => (
                  <div key={item.cartId} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-info">
                      <h4 style={{ color: 'white' }}>{item.name}</h4>
                      <h4 style={{ color: '#FFD700', marginTop: '4px' }}>{item.price}</h4>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.cartId)}>ลบ</button>
                  </div>
                ))}
              </div>
              <div className="checkout-box">
                <p style={{ color: '#aaaaaa', marginBottom: '8px' }}>ยอดชำระทั้งหมด</p>
                <h2 style={{ color: '#FFD700', fontSize: '32px' }}>฿{getCartTotalNumber().toLocaleString()}</h2>
                <button className="auth-btn-primary" onClick={handleCheckout}>ยืนยันการสั่งซื้อ</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

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