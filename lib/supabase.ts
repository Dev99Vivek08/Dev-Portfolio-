import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const hasSupabase = () => !!(supabaseUrl && supabaseAnonKey);

let _supabase: SupabaseClient | null = null;
export function getSupabase(): SupabaseClient {
  if (!hasSupabase()) throw new Error("Supabase not configured");
  if (!_supabase) _supabase = createClient(supabaseUrl, supabaseAnonKey);
  return _supabase;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabase()[prop as keyof SupabaseClient];
  },
});

// ─── Auth ────────────────────────────────────────────────────────────────────
export async function signInAdmin(email: string, password: string) {
  const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}
export async function signOutAdmin() {
  if (hasSupabase()) await getSupabase().auth.signOut();
}
export async function getAdminSession() {
  if (!hasSupabase()) return null;
  const { data } = await getSupabase().auth.getSession();
  return data.session;
}

// ─── Portfolio Config ─────────────────────────────────────────────────────────
export async function loadPortfolioConfig() {
  if (!hasSupabase()) return null;
  const { data } = await getSupabase().from("portfolio_config").select("*").limit(1).single();
  return data;
}
export async function savePortfolioConfig(config: Record<string, unknown>) {
  const sb = getSupabase();
  const { data: existing } = await sb.from("portfolio_config").select("id").limit(1).single();
  if (existing?.id) {
    const { error } = await sb.from("portfolio_config").update({ ...config, updated_at: new Date().toISOString() }).eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await sb.from("portfolio_config").insert([{ ...config }]);
    if (error) throw error;
  }
}

// ─── Projects ────────────────────────────────────────────────────────────────
export async function loadProjects() {
  if (!hasSupabase()) return null;
  const { data } = await getSupabase().from("projects").select("*").order("sort_order", { ascending: true });
  return data;
}
export async function saveProject(project: Record<string, unknown>) {
  const sb = getSupabase();
  if (project.id) {
    const { error } = await sb.from("projects").update({ ...project, updated_at: new Date().toISOString() }).eq("id", project.id);
    if (error) throw error;
  } else {
    const { error } = await sb.from("projects").insert([{ ...project }]);
    if (error) throw error;
  }
}
export async function deleteProject(id: string) {
  const { error } = await getSupabase().from("projects").delete().eq("id", id);
  if (error) throw error;
}

// ─── Skills ──────────────────────────────────────────────────────────────────
export async function loadSkills() {
  if (!hasSupabase()) return null;
  const { data } = await getSupabase().from("skills").select("*").order("sort_order", { ascending: true });
  return data;
}
export async function saveSkill(skill: Record<string, unknown>) {
  const sb = getSupabase();
  if (skill.id) {
    const { error } = await sb.from("skills").update(skill).eq("id", skill.id);
    if (error) throw error;
  } else {
    const { error } = await sb.from("skills").insert([skill]);
    if (error) throw error;
  }
}
export async function deleteSkill(id: string) {
  const { error } = await getSupabase().from("skills").delete().eq("id", id);
  if (error) throw error;
}

// ─── Blog Posts ──────────────────────────────────────────────────────────────
export async function loadBlogPosts() {
  if (!hasSupabase()) return null;
  const { data } = await getSupabase().from("blog_posts").select("*").order("created_at", { ascending: false });
  return data;
}
export async function saveBlogPost(post: Record<string, unknown>) {
  const sb = getSupabase();
  if (post.id) {
    const { error } = await sb.from("blog_posts").update({ ...post, updated_at: new Date().toISOString() }).eq("id", post.id);
    if (error) throw error;
  } else {
    const { error } = await sb.from("blog_posts").insert([{ ...post }]);
    if (error) throw error;
  }
}
export async function deleteBlogPost(id: string) {
  const { error } = await getSupabase().from("blog_posts").delete().eq("id", id);
  if (error) throw error;
}

// ─── File Upload ──────────────────────────────────────────────────────────────
export async function uploadFile(bucket: string, path: string, file: File): Promise<string> {
  const sb = getSupabase();
  const { data, error } = await sb.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) throw error;
  const { data: urlData } = sb.storage.from(bucket).getPublicUrl(data.path);
  return urlData.publicUrl;
}
