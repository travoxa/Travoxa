// components/FlipCardSimple.jsx
"use client"
import type { CSSProperties } from 'react';


type FlipCardSimpleProps = {
  item: string;
};

const FlipCardSimple = ({ item }: FlipCardSimpleProps) => {
  const styles = {
    card: {
      overflow: 'visible',
      width: '190px',
      height: '150px',
    },
    content: {
      width: '100%',
      height: '100%',
      transformStyle: 'preserve-3d',
      transition: 'transform 300ms',
      boxShadow: '0px 0px 50px 0px #4da52830',
      borderRadius: '5px',
    },
    frontBack: {
      backgroundColor: '#ffffff',
      position: 'absolute',
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      borderRadius: '5px',
      overflow: 'hidden',
    },
    backContent: {
      position: 'absolute',
      width: '99%',
      height: '99%',
      backgroundColor: '#ffffff',
      borderRadius: '5px',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '30px',
    },
    rotation: {
      position: 'absolute',
      content: '""',
      display: 'block',
      width: '160px',
      height: '160%',
      background: 'linear-gradient(90deg, white, #4da528, #4da528, #4da528, #4da528, white)',
      animation: 'rotation_481 5000ms infinite linear',
    },
    floating: {
      animation: 'float 2600ms infinite linear',
    },
  } satisfies Record<string, CSSProperties>;

  return (
    <div 
      className="group" 
      style={styles.card}
    >
      <div 
        className="group-hover:rotate-y-180" 
        style={styles.content}
      >
        {/* Back side */}
        <div style={styles.frontBack}>
          <div className="relative w-full h-full flex flex-col justify-center items-center">
            <div style={styles.rotation} />
            <div style={styles.backContent}>
              <p className='mx-[24px] text-[14px] font-light Mont text-center text-black' >{item}</p>
            </div>
          </div>
        </div>

        {/* Front side */}
        <div 
            className='flex justify-center items-center'
            style={{ ...styles.frontBack, transform: 'rotateY(180deg)' }}>
          <p className='mx-[24px] text-[14px] font-extrabold Mont text-center text-black' >{item}</p>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes rotation_481 {
          0% { transform: rotateZ(0deg); }
          100% { transform: rotateZ(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(10px); }
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .group:hover .group-hover\\:rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default FlipCardSimple;