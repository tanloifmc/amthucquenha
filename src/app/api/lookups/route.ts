import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SEED_LOOKUPS, SystemLookup } from '@/lib/utils/lookups';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const group = searchParams.get('group');

  try {
    const supabase = await createClient();
    let query = supabase
      .from('system_lookups')
      .select('id, group_code, value_code, label_vi, description, sort_order, is_active')
      .order('sort_order', { ascending: true });

    if (group) {
      query = query.eq('group_code', group);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      return NextResponse.json({ data, source: 'database' });
    }
  } catch {
    // Supabase offline/not reachable, chuyển sang fallback
  }

  // Fallback an toàn từ SEED_LOOKUPS
  let result: SystemLookup[] = SEED_LOOKUPS;
  if (group) {
    result = SEED_LOOKUPS.filter((item) => item.group_code === group);
  }

  return NextResponse.json({ data: result, source: 'fallback_seed' });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { group_code, value_code, label_vi, description, sort_order } = body;

    if (!group_code || !value_code || !label_vi) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc: group_code, value_code, label_vi' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('system_lookups')
      .insert([
        {
          group_code,
          value_code,
          label_vi,
          description: description || null,
          sort_order: sort_order || 0,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) {
      // Nếu DB offline hoặc trùng lặp
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data, message: 'Thêm danh mục thành công' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi hệ thống';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
