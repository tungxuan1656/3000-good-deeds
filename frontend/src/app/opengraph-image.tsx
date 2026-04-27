import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = '3000 Việc Thiện'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #f6f3ee 0%, #e5efe2 100%)',
        padding: '56px 64px',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        fontFamily:
          'ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
      }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '70%',
        }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#3f5c4a',
            fontSize: '28px',
            fontWeight: 700,
          }}>
          <span
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '9999px',
              backgroundColor: '#3f5c4a',
            }}
          />
          3000 Việc Thiện
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
          <p
            style={{
              margin: 0,
              color: '#294132',
              fontSize: '68px',
              lineHeight: 1.08,
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}>
            Theo dõi việc tốt
            <br />
            mỗi ngày
          </p>
          <p
            style={{
              margin: 0,
              color: '#3f5c4a',
              fontSize: '32px',
              lineHeight: 1.3,
              maxWidth: '760px',
            }}>
            Nền tảng miễn phí giúp bạn xây dựng thói quen tử tế và nuôi dưỡng sự
            bình an.
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignSelf: 'flex-end',
          color: '#3f5c4a',
          fontSize: '26px',
          fontWeight: 700,
          padding: '12px 20px',
          borderRadius: '9999px',
          border: '2px solid #8da08f',
          backgroundColor: 'rgba(255,255,255,0.7)',
        }}>
        Miễn phí vĩnh viễn
      </div>
    </div>,
    size,
  )
}
