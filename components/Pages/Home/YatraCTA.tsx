
import Link from 'next/link';
import { FaHiking, FaMapMarkedAlt, FaHandsHelping, FaHome, FaLeaf, FaCamera, FaCampground } from 'react-icons/fa';
import { GiBackpack } from 'react-icons/gi';

const YatraCTA = () => {
  return (
    <div
    >

      {/* Subtle Textured Icons Background */}
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity duration-700 scale-100">
                <GiBackpack className="absolute top-[10%] left-[5%] text-slate-300 text-7xl transform -rotate-12" />
                <FaMapMarkedAlt className="absolute top-[15%] right-[10%] text-slate-300 text-8xl transform rotate-12" />
                <FaCampground className="absolute bottom-[20%] left-[15%] text-slate-300 text-6xl transform -rotate-6" />
                <FaHandsHelping className="absolute top-[30%] right-[25%] text-slate-300 text-7xl transform rotate-6" />
                <FaHome className="absolute bottom-[10%] right-[5%] text-slate-300 text-8xl transform -rotate-12" />
                <FaLeaf className="absolute top-[50%] left-[8%] text-slate-300 text-6xl transform rotate-12" />
                <FaHiking className="absolute top-[10%] left-[40%] text-slate-300 text-9xl transform -rotate-45 opacity-50" />
                <FaCamera className="absolute bottom-[30%] right-[35%] text-slate-300 text-7xl transform rotate-12" />
            </div> */}

      {/* Content */}
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "30px" }}>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;600&family=Barlow+Condensed:wght@800&display=swap');
        .yt-wrap{position: relative;
        
  border-radius: 26px;
  background: linear-gradient(
    145deg,
    rgba(220,255,235,.65),
    rgba(180,245,215,.5),
    rgb(68, 238, 170)
  );
  backdrop-filter: blur(24px);
  border: 1.5px solid rgba(255,255,255,.7);
  box-shadow:
    0 0px 34px rgb(196, 250, 220),
    inset 0 1px 0 rgba(255,255,255,.8);
  padding: 0 44px 40px;
  overflow: hidden;
  animation: yt-in .7s both; /* ← FIX */

  width: 420px;
  min-height: 380px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;}
        @keyframes yt-in{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
        .yt-glow{position:absolute;top:-10px;left:50%;transform:translateX(-50%);width:280px;height:180px;background:radial-gradient(ellipse,rgba(121, 238, 170, 0.94),transparent 70%);filter:blur(18px);pointer-events:none}
        .yt-scene{position:relative;height:150px}
        .yt-stage{position:absolute;top:10%;left:50%;transform:translateX(-50%);width:260px;height:155px}
        .yt-pack{position:absolute;bottom:5px;left:50%;transform:translateX(-50%);width:70px;height:82px;z-index:4}
        .yt-pack-body{position:absolute;bottom:5px;left:0;width:70px;height:72px;background:linear-gradient(160deg,#4caf50 0%,#2e7d32 100%);border-radius:14px 14px 10px 10px;box-shadow:4px 6px 16px rgba(30,100,30,.45),inset 0 2px 4px rgba(255,255,255,.2)}
        .yt-pack-top{position:absolute;top:1;left:8px;width:54px;height:18px;background:linear-gradient(135deg,#66bb6a,#388e3c);border-radius:8px 8px 0 0;box-shadow:inset 0 2px 3px rgba(255,255,255,.2)}
        .yt-pack-roll{position:absolute;top:-10px;left:10px;width:50px;height:20px;background:linear-gradient(135deg,#81c784,#43a047);border-radius:10px;box-shadow:0 2px 6px rgba(30,100,30,.35)}
        .yt-pack-sl{position:absolute;bottom:8px;left:-6px;width:10px;height:50px;background:linear-gradient(180deg,#388e3c,#1b5e20);border-radius:5px;box-shadow:2px 2px 4px rgba(0,0,0,.2)}
        .yt-pack-sr{position:absolute;bottom:8px;right:-6px;width:10px;height:50px;background:linear-gradient(180deg,#388e3c,#1b5e20);border-radius:5px;box-shadow:-2px 2px 4px rgba(0,0,0,.2)}
        .yt-pack-pkt{position:absolute;bottom:10px;left:50%;transform:translateX(-50%);width:42px;height:28px;background:linear-gradient(160deg,#388e3c,#1b5e20);border-radius:8px;box-shadow:inset 0 2px 4px rgba(0,0,0,.2)}
        .yt-pack-bkl{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);width:18px;height:6px;background:#ffd54f;border-radius:3px;box-shadow:0 1px 4px rgba(255,193,7,.5)}
        .yt-pack-zip{position:absolute;top:20px;left:10px;width:50px;height:2px;background:rgba(255,255,255,.3);border-radius:1px}
        .yt-pass{position:absolute;bottom:10px;left:10px;width:44px;height:56px;z-index:3;transform:rotate(-10deg)}
        .yt-pass-body{width:44px;height:56px;background:linear-gradient(135deg,#1565c0,#0d47a1);border-radius:5px;box-shadow:3px 4px 10px rgba(13,71,161,.4)}
        .yt-pass-globe{position:absolute;top:10px;left:50%;transform:translateX(-50%);width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 40% 40%,#42a5f5,#1565c0);border:2px solid rgba(255,255,255,.4);box-shadow:0 2px 4px rgba(0,0,0,.3)}
        .yt-pass-l1{position:absolute;bottom:14px;left:6px;width:32px;height:2px;background:rgba(255,255,255,.4);border-radius:1px}
        .yt-pass-l2{position:absolute;bottom:9px;left:6px;width:22px;height:2px;background:rgba(255,255,255,.3);border-radius:1px}
        .yt-pass-lbl{position:absolute;top:4px;left:0;right:0;text-align:center;font-size:5px;color:rgba(255,255,255,.7);font-family:sans-serif;letter-spacing:.5px}
        .yt-tent{position:absolute;bottom:0;right:4px;width:22px;height:28px;z-index:3}
        .yt-tent {
  position: absolute;
  bottom: 10px; /* moved upward */
  right: 35px;
  width: 22px;
  height: 28px;
  z-index: 3;
}

.yt-tent-sh {
  position: absolute;
  bottom: 0;
  left: 4px;
  width: 0;
  height: 0;
  border-left: 32px solid transparent;
  border-right: 32px solid transparent;
  border-bottom: 48px solid #f57f17;
  clip-path: polygon(50% 0%,100% 100%,0% 100%);
}

.yt-tent-bd {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 0;
  border-left: 36px solid transparent;
  border-right: 36px solid transparent;
  border-bottom: 54px solid #f9a825;
  filter: drop-shadow(3px 4px 8px rgba(249,168,37,.4));
}

.yt-tent-dr {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 18px;
  height: 22px;
  background: linear-gradient(180deg,#e65100,#bf360c);
  border-radius: 9px 9px 0 0;
}

.yt-tent-pl {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 60px;
  background: linear-gradient(180deg,#8d6e63,#5d4037);
  border-radius: 1px;
}

        .yt-map{position:absolute;top:8px;right:0;width:72px;height:55px;z-index:2;transform:rotate(8deg)}
        .yt-map-bd{width:72px;height:55px;background:linear-gradient(135deg,#e8f5e9,#c8e6c9);border-radius:4px;box-shadow:2px 3px 8px rgba(0,0,0,.15);position:relative;overflow:hidden}
        .yt-map-l1{position:absolute;top:14px;left:8px;width:55px;height:2px;background:#a5d6a7;border-radius:1px}
        .yt-map-l2{position:absolute;top:22px;left:8px;width:40px;height:2px;background:#a5d6a7;border-radius:1px}
        .yt-map-l3{position:absolute;top:30px;left:8px;width:50px;height:2px;background:#a5d6a7;border-radius:1px}
        .yt-map-dot{position:absolute;top:8px;left:16px;width:8px;height:8px;border-radius:50%;background:#ef5350}
        .yt-pin{position:absolute;top:0;right:28px;z-index:5;animation:yt-bob 2.5s ease-in-out infinite}
        .yt-pin-hd{width:18px;height:18px;border-radius:50% 50% 50% 0;background:linear-gradient(135deg,#ef5350,#b71c1c);transform:rotate(-45deg);box-shadow:2px 2px 6px rgba(183,28,28,.5)}
        .yt-pin-dot{position:absolute;top:4px;left:4px;width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.7)}
        .yt-pin-tl{position:absolute;top:14px;left:7px;width:4px;height:10px;background:#b71c1c;border-radius:0 0 2px 2px}
        @keyframes yt-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        .yt-vid{position:absolute;top:6px;left:8px;width:46px;height:34px;z-index:2;transform:rotate(-8deg)}
        .yt-vid-bd{width:46px;height:34px;background:linear-gradient(135deg,#fff,#e8f5e9);border-radius:6px;box-shadow:2px 3px 8px rgba(0,0,0,.15);display:flex;align-items:center;justify-content:center}
        .yt-vid-pl{width:0;height:0;border-left:12px solid #43a047;border-top:7px solid transparent;border-bottom:7px solid transparent;margin-left:2px}
        .yt-globe{position:absolute;top:28px;left:0;width:34px;height:34px;z-index:2}
        .yt-globe-bd{width:34px;height:34px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#42a5f5,#1565c0);border:2px solid rgba(255,255,255,.5);box-shadow:2px 3px 8px rgba(21,101,192,.4);position:relative;overflow:hidden}
        .yt-globe-l1{position:absolute;top:50%;left:0;width:100%;height:1px;background:rgba(255,255,255,.3)}
        .yt-globe-l2{position:absolute;top:0;left:50%;width:1px;height:100%;background:rgba(255,255,255,.3)}
        .yt-sp{position:absolute;color:rgba(255,255,255,.9);font-weight:700;text-shadow:0 0 8px rgba(255,255,255,.9);animation:yt-sa 2s ease-in-out infinite;font-size:13px}
        .yt-sp1{top:4px;left:52px;animation-delay:0s}.yt-sp2{top:2px;right:18px;animation-delay:.8s}.yt-sp3{bottom:30px;right:82px;animation-delay:1.4s}
        @keyframes yt-sa{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}
        .yt-title{font-family:Montserrat, sans-serif;,sans-serif;font-size:26px;font-weight:800;letter-spacing:2px;color:#1a3a2a;text-transform:uppercase;margin-bottom:8px;;margin-top:25px}
        .yt-title span{color:#1b8a4c}
        .yt-desc{font-family:'Barlow',sans-serif;font-size:13px;color:#2d5040;line-height:1.55;margin-bottom:16px;text-align:center}
        .yt-btn{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#22a05a,#178a44);color:#fff;font-family:'Barlow',sans-serif;font-size:13px;font-weight:600;padding:10px 20px;border-radius:50px;border:none;cursor:pointer;box-shadow:0 8px 20px rgba(30,140,80,.4);transition:transform .2s,box-shadow .2s;text-decoration:none}
        .yt-btn:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(30,140,80,.55)}
      `}</style>

        <div className="yt-wrap">
          <div className="yt-glow" />
          <div className="yt-scene">
            <div className="yt-stage">
              <div className="yt-map"><div className="yt-map-bd"><div className="yt-map-l1" /><div className="yt-map-l2" /><div className="yt-map-l3" /><div className="yt-map-dot" /></div></div>
              <div className="yt-globe"><div className="yt-globe-bd"><div className="yt-globe-l1" /><div className="yt-globe-l2" /></div></div>
              <div className="yt-vid"><div className="yt-vid-bd"><div className="yt-vid-pl" /></div></div>
              <div className="yt-tent"><div className="yt-tent-sh" /><div className="yt-tent-bd" /><div className="yt-tent-dr" /><div className="yt-tent-pl" /></div>
              <div className="yt-pack"><div className="yt-pack-roll" /><div className="yt-pack-top" /><div className="yt-pack-body"><div className="yt-pack-zip" /><div className="yt-pack-pkt"><div className="yt-pack-bkl" /></div></div><div className="yt-pack-sl" /><div className="yt-pack-sr" /></div>
              <div className="yt-pass"><div className="yt-pass-body"><div className="yt-pass-lbl">PASSPORT</div><div className="yt-pass-globe" /><div className="yt-pass-l1" /><div className="yt-pass-l2" /></div></div>
              <div className="yt-pin"><div className="yt-pin-hd"><div className="yt-pin-dot" /></div><div className="yt-pin-tl" /></div>
              <div className="yt-sp yt-sp1">✦</div><div className="yt-sp yt-sp2">✦</div><div className="yt-sp yt-sp3">✦</div>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <h2 className="yt-title">TRAVOXA <span>YATRA</span></h2>
            <p className="yt-desc">Travel for free by volunteering.<br />Exchange your skills for stays, food,<br />and unforgettable experiences across India.</p>
            <Link href="/travoxa-yatra" className="yt-btn">
              Explore Opportunities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YatraCTA;
