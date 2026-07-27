"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import {
  currentAuthRedirectUrl,
  getBrowserSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import type { AcademyProfile, AcademyRole } from "@/lib/platform-types";

type AcademyAuthContextValue = {
  configured: boolean;
  loading: boolean;
  client: SupabaseClient | null;
  user: User | null;
  profile: AcademyProfile | null;
  role: AcademyRole | null;
  error: string | null;
  dataRevision: number;
  signInWithMagicLink(email: string): Promise<{ ok: boolean; message: string }>;
  signOut(): Promise<void>;
  markLocalMigrationComplete(): Promise<boolean>;
  refreshProfile(): Promise<void>;
  notifyDataChanged(): void;
};

const AcademyAuthContext = createContext<AcademyAuthContextValue | null>(null);

function mapProfile(row: Record<string, unknown>): AcademyProfile {
  return {
    id: String(row.id),
    email: typeof row.email === "string" ? row.email : null,
    displayName: typeof row.display_name === "string" && row.display_name.trim()
      ? row.display_name
      : "Academy learner",
    role: row.role === "instructor" || row.role === "admin" ? row.role : "learner",
    localMigrationCompletedAt:
      typeof row.local_migration_completed_at === "string"
        ? row.local_migration_completed_at
        : null,
  };
}

export default function AcademyAuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured();
  const [client] = useState(() => getBrowserSupabaseClient());
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AcademyProfile | null>(null);
  const [loading, setLoading] = useState(configured);
  const [error, setError] = useState<string | null>(null);
  const [dataRevision, setDataRevision] = useState(0);

  const loadProfile = useCallback(
    async (nextUser: User | null) => {
      if (!client || !nextUser) {
        setProfile(null);
        return;
      }

      const { data, error: profileError } = await client
        .from("profiles")
        .select("id,email,display_name,role,local_migration_completed_at")
        .eq("id", nextUser.id)
        .maybeSingle();

      if (profileError) {
        setError("Your account is signed in, but the Academy profile could not be loaded.");
        setProfile(null);
        return;
      }

      if (data) {
        setProfile(mapProfile(data as Record<string, unknown>));
        setError(null);
        return;
      }

      const displayName =
        typeof nextUser.user_metadata?.display_name === "string"
          ? nextUser.user_metadata.display_name
          : nextUser.email?.split("@")[0] ?? "Academy learner";
      const { data: created, error: createError } = await client
        .from("profiles")
        .upsert({
          id: nextUser.id,
          email: nextUser.email ?? null,
          display_name: displayName,
          role: "learner",
        })
        .select("id,email,display_name,role,local_migration_completed_at")
        .single();

      if (createError || !created) {
        setError("Your account is signed in, but its learner profile is not ready.");
        return;
      }

      setProfile(mapProfile(created as Record<string, unknown>));
      setError(null);
    },
    [client],
  );

  useEffect(() => {
    if (!client) {
      return;
    }

    let active = true;
    client.auth.getSession().then(async ({ data, error: sessionError }) => {
      if (!active) return;
      if (sessionError) setError("The saved Academy session could not be restored.");
      const nextUser = data.session?.user ?? null;
      setUser(nextUser);
      await loadProfile(nextUser);
      if (active) setLoading(false);
    });

    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      setLoading(true);
      window.setTimeout(() => {
        void loadProfile(nextUser).finally(() => {
          if (active) {
            setLoading(false);
            setDataRevision((revision) => revision + 1);
          }
        });
      }, 0);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [client, loadProfile]);

  async function signInWithMagicLink(email: string) {
    if (!client) {
      return { ok: false, message: "Synchronized accounts are not configured yet." };
    }

    const { error: signInError } = await client.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: currentAuthRedirectUrl(),
        shouldCreateUser: true,
      },
    });

    if (signInError) {
      return { ok: false, message: signInError.message };
    }

    return { ok: true, message: "Check your email for the secure Academy sign-in link." };
  }

  async function signOut() {
    if (!client) return;
    await client.auth.signOut();
    setUser(null);
    setProfile(null);
    setDataRevision((revision) => revision + 1);
  }

  async function markLocalMigrationComplete() {
    if (!client || !user) return false;
    const completedAt = new Date().toISOString();
    const { error: updateError } = await client
      .from("profiles")
      .update({ local_migration_completed_at: completedAt })
      .eq("id", user.id);

    if (updateError) return false;
    setProfile((current) =>
      current ? { ...current, localMigrationCompletedAt: completedAt } : current,
    );
    return true;
  }

  async function refreshProfile() {
    await loadProfile(user);
  }

  const value: AcademyAuthContextValue = {
    configured,
    loading,
    client,
    user,
    profile,
    role: profile?.role ?? null,
    error,
    dataRevision,
    signInWithMagicLink,
    signOut,
    markLocalMigrationComplete,
    refreshProfile,
    notifyDataChanged: () => setDataRevision((revision) => revision + 1),
  };

  return <AcademyAuthContext.Provider value={value}>{children}</AcademyAuthContext.Provider>;
}

export function useAcademyAuth() {
  const context = useContext(AcademyAuthContext);
  if (!context) {
    throw new Error("useAcademyAuth must be used within AcademyAuthProvider");
  }
  return context;
}
