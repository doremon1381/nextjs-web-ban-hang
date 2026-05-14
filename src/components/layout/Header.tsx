import { createClient } from '@/lib/supabase/server';
import { HeaderInteractive } from './HeaderInteractive';

export async function Header() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const initialUser = user
    ? {
        name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email ||
          'Người dùng',
        email: user.email ?? '',
      }
    : null;

  return <HeaderInteractive initialUser={initialUser} />;
}
