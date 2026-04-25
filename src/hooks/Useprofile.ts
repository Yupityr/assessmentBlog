import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  email: string;
}

interface UseProfileResult {
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProfile(): UseProfileResult {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) throw authError ?? new Error("Not authenticated");

        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("id, username, avatar_url, email")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;
        if (!cancelled) setProfile(data);
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [tick]);

  function refetch() {
    setTick((t) => t + 1);
  }

  return { profile, setProfile, loading, error, refetch };
}