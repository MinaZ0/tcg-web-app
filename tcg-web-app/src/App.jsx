import { useState, useRef } from 'react';
import './App.css';

// ----------------------------------------------------------------------
// Component: การ์ด 3D Holographic (เหมือนเดิม)
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
  const [currentView, setCurrentView] = useState("market"); // "market" | "detail" | "wallet" | "cart"
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // 🌟 ไฮไลต์: State สำหรับเก็บของในตะกร้า
  const [cart, setCart] = useState([]);

  const allCards = [
    { id: 1, name: "Pikachu VMAX", price: "฿12,500", condition: "Mint", image: "https://images.pokemontcg.io/swsh4/44_hires.png" },
    { id: 2, name: "Charizard ex", price: "฿8,900", condition: "Near Mint", image: "https://images.pokemontcg.io/sv3/125_hires.png" },
    { id: 3, name: "Mewtwo GX", price: "฿4,200", condition: "Played", image: "https://images.pokemontcg.io/sm35/78_hires.png" },
    { id: 4, name: "Rayquaza VMAX", price: "฿5,500", condition: "Mint", image: "https://images.pokemontcg.io/swsh7/111_hires.png" },
  ];

  const transactions = [
    { id: 1, title: "ขาย Mewtwo GX", amount: "+฿1,200", isIncome: true, date: "14 พ.ค. 26" },
    { id: 2, title: "ซื้อ Pikachu VMAX", amount: "-฿3,500", isIncome: false, date: "12 พ.ค. 26" },
    { id: 3, title: "เติมเงินเข้าระบบ", amount: "+฿5,000", isIncome: true, date: "10 พ.ค. 26" },
  ];

  const displayedCards = allCards.filter(card =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ฟังก์ชันเอาของลงตะกร้า (พร้อมเด้งกลับหน้าแรก)
  const addToCart = (card) => {
    // สร้างของชิ้นใหม่โดยสุ่ม ID ให้มัน จะได้ลบถูกชิ้นถ้าซื้อซ้ำ
    const newItem = { ...card, cartId: Math.random().toString() };
    setCart([...cart, newItem]);
    alert(`เพิ่ม ${card.name} ลงตะกร้าแล้ว!`);
    setCurrentView("market");
  };

  // ฟังก์ชันลบของออกจากตะกร้า
  const removeFromCart = (cartIdToRemove) => {
    setCart(cart.filter(item => item.cartId !== cartIdToRemove));
  };

  // ฟังก์ชันคำนวณราคารวมในตะกร้า (ลบ ฿ และ , ออกเพื่อแปลงเป็นตัวเลขคำนวณ)
  const calculateTotal = () => {
    const total = cart.reduce((sum, item) => {
      const numericPrice = parseInt(item.price.replace(/[^0-9]/g, ''));
      return sum + numericPrice;
    }, 0);
    return `฿${total.toLocaleString()}`; // แปลงกลับเป็นสตริงที่มีลูกน้ำสวยๆ
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
            <button className="buy-btn" onClick={() => addToCart(selectedCard)}>
              หยิบใส่ตะกร้า
            </button>
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
            <p className="balance-amount">฿12,450</p>
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