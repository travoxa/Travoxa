
import React from 'react';
import Link from 'next/link';
import { FaHandshake, FaGlobe, FaUsers, FaChartLine, FaVideo, FaBullhorn, FaPlane, FaLightbulb } from 'react-icons/fa';

const PartnersCTA = () => {
    return (
        <div 
        >
            <div style={{ minHeight: "60vh", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "30px" }}>
                <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;600&family=Barlow+Condensed:wght@800&display=swap');
        .card{position:relative;width:420px;border-radius:26px;background:linear-gradient(145deg,rgba(255,255,255,.55),rgba(220,210,255,.45),rgba(180,210,255,.35));backdrop-filter:blur(24px);border:1.5px solid rgb(253, 253, 253);box-shadow:0px 0px 34px rgb(235, 223, 255),inset 0 1px 0 rgb(255, 255, 255);padding:0 24px 20px;overflow:hidden;animation:up .7s both}
        @keyframes up{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
        .glow{position:absolute;top:-10px;left:50%;transform:translateX(-50%);width:280px;height:180px;background:radial-gradient(ellipse,rgba(160,140,255,.4),transparent 70%);filter:blur(18px);pointer-events:none}
        .illus{position:relative;height:150px}
        .illus-inner{position:absolute;top:25%;left:50%;transform:translateX(-50%);width:240px;height:120px}
        .meg{position:absolute;bottom:0px;left:20px;width:80px;height:60px}
        .mb{position:absolute;bottom:0;left:0;width:50px;height:38px;background:linear-gradient(135deg,#6ac6ff,#1565c0);border-radius:8px 4px 4px 8px;box-shadow:4px 4px 10px rgba(21,101,192,.5)}
        .mc{position:absolute;bottom:5px;right:0;border-left:38px solid #1e88e5;border-top:19px solid transparent;border-bottom:19px solid transparent}
        .mh{position:absolute;bottom:-7px;left:12px;width:24px;height:10px;background:linear-gradient(135deg,#90caf9,#1976d2);border-radius:0 0 5px 5px}
        .hs{position:absolute;top:10px;left:50%;transform:translateX(-50%);width:90px;height:52px}
        .hl{position:absolute;top:12px;left:0;width:48px;height:28px;background:linear-gradient(135deg,#7ecbff,#1565c0);border-radius:14px 6px 6px 14px;box-shadow:3px 3px 10px rgba(21,101,192,.4)}
        .hr{position:absolute;top:12px;right:0;width:48px;height:28px;background:linear-gradient(225deg,#7ecbff,#1565c0);border-radius:6px 14px 14px 6px;box-shadow:-3px 3px 10px rgba(21,101,192,.4)}
        .hg{position:absolute;top:16px;left:50%;transform:translateX(-50%);width:18px;height:20px;background:linear-gradient(180deg,#3daeff,#1976d2);border-radius:4px}
        .hth{position:absolute;top:0;left:8px;width:15px;height:14px;background:linear-gradient(135deg,#90caf9,#2196f3);border-radius:7px 7px 3px 3px}
        .cam{position:absolute;top:0px;left:0px;width:44px;height:34px}
        .cbmp{position:absolute;top:0;left:10px;width:16px;height:10px;background:linear-gradient(135deg,#c5b0f7,#7c4dff);border-radius:3px 3px 0 0}
        .cbdy{position:absolute;bottom:0;width:44px;height:26px;background:linear-gradient(135deg,#b39ddb,#512da8);border-radius:7px;box-shadow:3px 3px 8px rgba(81,45,168,.5)}
        .clen{position:absolute;bottom:5px;left:50%;transform:translateX(-50%);width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#e8d5ff,#4a148c 60%,#1a0040);border:2px solid rgba(255,255,255,.4)}
        .tgt{position:absolute;top:0px;right:0px;width:42px;height:42px}
        .to{position:absolute;inset:0;border-radius:50%;background:conic-gradient(#ef9a9a 0 60deg,#fff 60deg 120deg,#ef9a9a 120deg 180deg,#fff 180deg 240deg,#ef9a9a 240deg 300deg,#fff 300deg);box-shadow:3px 3px 8px rgba(211,47,47,.3)}
        .tm{position:absolute;inset:8px;border-radius:50%;background:#ef5350}
        .tc{position:absolute;inset:16px;border-radius:50%;background:radial-gradient(circle,#fff 30%,#c62828)}
        .dart{position:absolute;top:-2px;right:-3px;width:24px;height:5px;background:linear-gradient(90deg,#ffe082,#ff8f00);border-radius:3px 0 0 3px;transform:rotate(-30deg);transform-origin:right center}
        .dart::after{content:'';position:absolute;right:-5px;top:-2px;border-left:7px solid #ff6f00;border-top:5px solid transparent;border-bottom:5px solid transparent}
        .star{position:absolute;bottom:10px;left:4px;width:24px;height:24px;background:linear-gradient(135deg,#ffe57f,#e65100);clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);animation:fl 3s ease-in-out infinite;filter:drop-shadow(0 2px 6px rgba(255,100,0,.5))}
        .env{position:absolute;bottom:4px;right:0px;animation:fl2 4s ease-in-out infinite 1s}
        .eb{width:32px;height:22px;background:linear-gradient(135deg,#fff,#e8eaf6);border-radius:3px;box-shadow:2px 3px 6px rgba(0,0,0,.12);position:relative;overflow:hidden}
        .ef{position:absolute;top:0;left:0;border-left:16px solid transparent;border-right:16px solid transparent;border-top:11px solid #c5cae9}
        .heart{position:absolute;top:34px;right:-8px;font-size:18px;animation:hb 2.5s ease-in-out infinite .5s}
        .sp{position:absolute;color:#fff;font-weight:700;text-shadow:0 0 8px rgba(255,255,255,.9);animation:sa 2s ease-in-out infinite;font-size:13px}
        .s1{top:6px;left:30px}.s2{top:0px;right:40px;animation-delay:.8s}.s3{bottom:40px;right:44px;animation-delay:1.4s}
        @keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes fl2{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-5px) rotate(3deg)}}
        @keyframes hb{0%,100%{transform:scale(1)}30%{transform:scale(1.2)}60%{transform:scale(.95)}}
        @keyframes sa{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}
        .title{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:800;letter-spacing:2px;color:#2d2050;text-transform:uppercase;margin-bottom:8px;margin-top:10px}
        .title span{color:#5a3ef8}
        .desc{font-family:'Barlow',sans-serif;font-size:13px;color:#4a3a6a;line-height:1.55;margin-bottom:16px;text-align:center}
        .btn{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#6b4ff8,#4430e0);color:#fff;font-family:'Barlow',sans-serif;font-size:13px;font-weight:600;padding:10px 20px;border-radius:50px;border:none;cursor:pointer;box-shadow:0 8px 20px rgba(90,62,248,.45);transition:transform .2s,box-shadow .2s;text-decoration:none}
        .btn:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(90,62,248,.55)}
.bars {
  position: absolute;
  bottom: 10px;
  right: 80px;
  display: flex;
  gap: 4px;
  align-items: flex-end; /* THIS is the fix */
}


.bars div {
  width: 6px;
  background: linear-gradient(#6366F1,#8B5CF6);
  border-radius: 3px;
}

.bars div:nth-child(1){height:15px}
.bars div:nth-child(2){height:25px}
.bars div:nth-child(3){height:35px}
        
      `}</style>

                <div className="card">
                    <div className="glow" />
                    <div className="illus">
                        <div className="illus-inner">
                            <div className="cam"><div className="cbmp" /><div className="cbdy"><div className="clen" /></div></div>
                            <div className="tgt"><div className="to" /><div className="tm" /><div className="tc" /><div className="dart" /></div>
                            <div className="hs"><div className="hl" /><div className="hr" /><div className="hg" /><div className="hth" /></div>
                            <div className="meg"><div className="mb" /><div className="mh" /><div className="mc" /></div>
                            <div className="star" />
                            <div className="env"><div className="eb"><div className="ef" /></div></div>
                            {/* <div className="heart">❤️</div> */}
                            <div className="sp s1">✦</div><div className="sp s2">✦</div><div className="sp s3">✦</div>
                            <div className="bars">
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <h2 className="title">TRAVOXA <span>COLLAB</span></h2>
                        <p className="desc">Generate click-worthy opportunities and<br />grow your reach in seconds,<br />fully automated.</p>
                        <a href="#" className="btn">Start Collaborating →</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnersCTA;
