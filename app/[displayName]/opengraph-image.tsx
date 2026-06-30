import { ImageResponse } from 'next/og';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const runtime = 'nodejs';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

export default async function Image({ params }: { params: Promise<{ displayName: string }> }) {
  const { displayName } = await params;
  
  let user = null;
  try {
    const q = query(collection(db, "users"), where("displayName", "==", displayName));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      user = querySnapshot.docs[0].data();
    }
  } catch (error) {
    console.error("Error fetching user for OG image:", error);
  }

  const title = user?.username || displayName;
  const bio = user?.bio || '내 링크들을 확인해보세요!';
  const avatarUrl = user?.avatarUrl || null;

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
            padding: '60px 80px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
            border: '2px solid rgba(255, 255, 255, 1)',
            maxWidth: '80%',
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              style={{
                width: 160,
                height: 160,
                borderRadius: '50%',
                marginBottom: 30,
                border: '6px solid white',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              style={{
                width: 160,
                height: 160,
                borderRadius: '50%',
                marginBottom: 30,
                backgroundColor: '#cbd5e1',
                border: '6px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 60,
                color: 'white',
              }}
            >
              {title.substring(0, 2).toUpperCase()}
            </div>
          )}
          
          <div style={{ display: 'flex', fontSize: 60, fontWeight: 'bold', color: '#1e293b', marginBottom: 20, textAlign: 'center' }}>
            {title}
          </div>
          <div style={{ display: 'flex', fontSize: 32, color: '#64748b', textAlign: 'center', wordBreak: 'break-word', maxWidth: '800px', lineHeight: 1.4 }}>
            {bio}
          </div>
          
          <div style={{ 
            display: 'flex', 
            marginTop: 40, 
            padding: '12px 32px', 
            backgroundColor: '#f1f5f9', 
            borderRadius: '100px', 
            fontSize: 28, 
            color: '#94a3b8',
            fontWeight: 'bold'
          }}>
            /{displayName}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
