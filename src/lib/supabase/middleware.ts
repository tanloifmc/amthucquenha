import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fdklazlcbxaiapsnnbqq.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_anon_key';

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Kiểm tra cookie session giả lập / demo trước
  const mockUserCookie = request.cookies.get('quenha_mock_user');
  let hasValidSession = !!mockUserCookie?.value;

  // Nếu không có mock cookie thì kiểm tra Supabase Auth
  if (!hasValidSession && supabaseKey !== 'dummy_anon_key') {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        hasValidSession = true;
      }
    } catch {
      // Bỏ qua lỗi kết nối Supabase ở môi trường dev local
    }
  }

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login');
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/crm') ||
    request.nextUrl.pathname.startsWith('/marketing') ||
    request.nextUrl.pathname.startsWith('/floor') ||
    request.nextUrl.pathname.startsWith('/finance') ||
    request.nextUrl.pathname.startsWith('/operations');

  // Nếu chưa đăng nhập và cố vào trang nội bộ
  if (!hasValidSession && isProtectedRoute) {
    // Lưu lại URL gốc để sau khi đăng nhập chuyển hướng lại
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('returnUrl', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Nếu đã đăng nhập mà lại vào trang /login (trừ khi có query switch=true)
  if (hasValidSession && isAuthRoute && !request.nextUrl.searchParams.has('switch')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}
