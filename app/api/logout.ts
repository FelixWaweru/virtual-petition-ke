/**
 * NOTE: this file is only needed if you're doing SSR (getServerSideProps)!
 */
import { supabase } from '../../lib/db'

export default function handler(req: any, res: any) {
  supabase.auth.api.deleteAuthCookie(req, res, {redirectTo: '/'});
}