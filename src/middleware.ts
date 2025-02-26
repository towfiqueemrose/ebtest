import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

const isValidCheckoutToken = async (token: string | null, sessionId: string): Promise<boolean> => {
  if (!token) return false;
  
  try {
    const [timestamp, hash] = token.split('_');
    const timeValid = Date.now() - parseInt(timestamp) < 5 * 60 * 1000; // 5 minutes expiry
    
    const encoder = new TextEncoder();
    const secretKey = process.env.CHECKOUT_SECRET_KEY || 'default-secret-key';
    const data = encoder.encode(`${sessionId}-${timestamp}`);
    const keyData = encoder.encode(secretKey);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
    
    // Convert to hex string
    const expectedHash = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    return timeValid && hash === expectedHash;
  } catch {
    return false;
  }
};

export default auth(async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  // @ts-expect-error - auth is added by NextAuth
  const session = req.auth;
  const isLoggedIn = !!session;

  if (nextUrl.pathname === '/checkout/success') {
    const token = nextUrl.searchParams.get('secure_token');
    const stripeSessionId = nextUrl.searchParams.get('session_id');

    if (!isLoggedIn || !stripeSessionId || !isValidCheckoutToken(token, stripeSessionId)) {
      return NextResponse.redirect(new URL('/', nextUrl));
    }

    return NextResponse.next();
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/cart',
    '/profile',
    '/update-profile',
    '/checkout/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};