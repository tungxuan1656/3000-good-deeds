import { SignJWT } from 'jose'

const JWT_SECRET = 'your-secret-key-change-me'
const USER_ID = 'test-user-id-' + Date.now()

async function generate() {
  const secret = new TextEncoder().encode(JWT_SECRET)
  const token = await new SignJWT({ sub: USER_ID })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret)

  console.log(JSON.stringify({ token, userId: USER_ID }))
}

generate()
