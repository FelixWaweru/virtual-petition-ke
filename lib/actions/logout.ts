/**
 * NOTE: this file is only needed if you're doing SSR (getServerSideProps)!
 */
import { supabase } from '../../lib/db'
import { useRouter } from 'next/router';

export async function logout() {
    const router = useRouter();
    const { error } = await supabase.auth.signOut();

    fetch('/api/logout', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({}),
    }).then((res) => res.json());

    if(!error) {
        router.push(`/`);
    }
}
