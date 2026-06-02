import { useState, useRef } from 'react';
import './App.css';

// ----------------------------------------------------------------------
// 1. Component: การ์ด 3D Holographic
// ----------------------------------------------------------------------
function Interactive3DCard({ image, name }) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState("");
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });

  // ฟังก์ชันคำนวณองศาตอนขยับเมาส์
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // หาพิกัดเมาส์ x, y เทียบกับกรอบของการ์ด
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // คำนวณองศาเอียง (จำกัดไม่เกิน 15 องศา)
    const rotateX = ((y - centerY) / centerY) * -15; 
    const rotateY = ((x - centerX) / centerX) * 15;

    // อัปเดตการหมุน 3D (scale3d ทำให้การ์ดเด้งพุ่งออกมานิดนึงตอนเอาเมาส์ชี้)
    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`);

    // คำนวณแสงฟอยล์ให้วิ่งตามเมาส์
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlareStyle({
      opacity: 1,
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 215, 0, 0.5) 0%, transparent 60%)`
    });
  };

  // ฟังก์ชันตอนเอาเมาส์ออก (คืนร่างเดิม)
  const handleMouseLeave = () => {
    setTransformStyle(`perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
    setGlareStyle({ opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      className="interactive-card-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      <img src={image} alt={name} className="interactive-card-image" />
      <div className="interactive-card-glare" style={glareStyle}></div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 2. Component หลัก: หน้าตลาด
// ----------------------------------------------------------------------
function App() {
  const allCards = [
    { name: "Pikachu VMAX", price: "฿12,500", condition: "Mint", image: "https://images.pokemontcg.io/swsh4/44_hires.png" },
    { name: "Charizard ex", price: "฿8,900", condition: "Near Mint", image: "https://images.pokemontcg.io/sv3/125_hires.png" },
    { name: "Mewtwo GX", price: "฿4,200", condition: "Played", image: "https://images.pokemontcg.io/sm35/78_hires.png" },
    { name: "Rayquaza VMAX", price: "฿5,500", condition: "Mint", image: "https://images.pokemontcg.io/swsh7/111_hires.png" },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  // State สำหรับเช็คว่าตอนนี้กดดูการ์ดใบไหนอยู่ (เหมือนการจำลองเปลี่ยนหน้า)
  const [selectedCard, setSelectedCard] = useState(null);

  const displayedCards = allCards.filter(card =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ถ้ามีการเลือกการ์ด -> โชว์หน้ารายละเอียด 3D
  if (selectedCard) {
    return (
      <div className="app-container">
        <header className="header">
          <button className="back-btn" onClick={() => setSelectedCard(null)}>⬅ ย้อนกลับ</button>
          <h1 className="title" style={{ fontSize: '18px' }}>{selectedCard.name}</h1>
          <div style={{ width: '60px' }}></div> {/* ดัมมี่เพลสโฮลเดอร์จัดให้อยู่ตรงกลาง */}
        </header>

        <div className="detail-container">
          <Interactive3DCard image={selectedCard.image} name={selectedCard.name} />
          
          <div className="action-box">
            <p style={{ color: '#aaaaaa', marginBottom: '8px' }}>ราคาปัจจุบัน</p>
            <h2 style={{ color: '#FFD700', fontSize: '32px' }}>{selectedCard.price}</h2>
            <p style={{ marginTop: '8px' }}>สภาพ: {selectedCard.condition}</p>
            <button className="buy-btn" onClick={() => alert(`หยิบ ${selectedCard.name} ใส่ตะกร้าแล้ว!`)}>
              หยิบใส่ตะกร้า
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ถ้ายังไม่เลือกการ์ด -> โชว์หน้าตลาดรวม
  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">PIKACHU MARKET</h1>
        <button className="wallet-btn" onClick={() => alert("ระบบกระเป๋าเงินกำลังมา!")}>💳</button>
      </header>

      <div className="search-container">
        <input
          type="text"
          placeholder="ค้นหาการ์ดที่ต้องการ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <h2 className="section-title">⚡ HOT DEALS</h2>

      <div className="card-grid">
        {displayedCards.map((card, index) => (
          <div key={index} className="card" onClick={() => setSelectedCard(card)}>
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