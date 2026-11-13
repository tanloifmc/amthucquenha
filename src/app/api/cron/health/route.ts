import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization') || request.headers.get('x-cron-secret');
  const expectedSecret = process.env.CRON_SECRET || 'quenha_internal_cron_secret_secure_key_2026';

  // Kiểm tra Secret nếu được cấu hình
  if (authHeader && authHeader.replace('Bearer ', '') !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized cron request' }, { status: 401 });
  }

  let dbAlive = false;
  let dbDetails = 'unreachable';

  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from('system_lookups')
      .select('*', { count: 'exact', head: true });

    if (!error) {
      dbAlive = true;
      dbDetails = `connected (lookups count: ${count ?? 0})`;
    }
  } catch (err: unknown) {
    dbDetails = err instanceof Error ? err.message : 'connection_failed';
  }

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    db_alive: dbAlive,
    db_details: dbDetails,
    message: 'Hệ thống Quê Nhà CRM & Quản trị sẵn sàng',
  });
}
