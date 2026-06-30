import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };
export const alt = 'MyLink - 나만의 모든 링크를 한 곳에';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #e0e7ff 0%, #fce7f3 50%, #e0f2fe 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '40px',
            padding: '80px 120px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
            border: '2px solid rgba(255, 255, 255, 1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 100,
              fontWeight: 'bold',
              color: '#3730a3',
              marginBottom: 24,
              letterSpacing: '-0.02em',
            }}
          >
            MyLink
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 40,
              color: '#475569',
              fontWeight: 500,
            }}
          >
            나만의 모든 링크를 한 곳에
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
