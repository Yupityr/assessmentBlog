import { useState, useRef,useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useProfile, type Profile } from "@/hooks/Useprofile";

// ─── Supabase client ───────────────────────────────────────────────────────────
// Replace with your own URL and anon key (or import from your lib/supabase.ts)
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type Tab = "profile" | "account" | "password";

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        background: type === "success" ? "#0F6E56" : "#A32D2D",
        color: "#fff",
        padding: "0.75rem 1.25rem",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: 500,
        zIndex: 1000,
        boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        maxWidth: "360px",
        animation: "slideUp 0.2s ease",
      }}
    >
      <span style={{ fontSize: "16px" }}>{type === "success" ? "✓" : "✕"}</span>
      {message}
    </div>
  );
}

// ─── Avatar Upload ─────────────────────────────────────────────────────────────
function AvatarSection({
  profile,
  onUpdate,
  onError,
}: {
  profile: Profile;
  onUpdate: (url: string) => void;
  onError: (msg: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(profile.avatar_url);

  const initials = profile.username
    ? profile.username.slice(0, 2).toUpperCase()
    : profile.email.slice(0, 2).toUpperCase();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview immediately
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const ext = file.name.split(".").pop();
      // Path MUST start with the user's own ID — this is what the RLS policy checks
      const filePath = `${profile.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true, contentType: file.type });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      // Persist to profiles table
      const { error: dbError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", profile.id);

      if (dbError) throw dbError;

      onUpdate(publicUrl);
    } catch (err: any) {
      console.error(err);
      setPreview(profile.avatar_url);
      const hint = err.message?.includes("policy")
        ? "Upload blocked by RLS policy. See code comments for the required SQL policy."
        : err.message;
      onError("Upload failed: " + hint);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "2rem" }}>
      {/* Avatar circle */}
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          overflow: "hidden",
          background: "#CECBF6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          fontWeight: 600,
          color: "#3C3489",
          flexShrink: 0,
          border: "2px solid #AFA9EC",
          position: "relative",
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt="avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          initials
        )}
        {uploading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "12px",
            }}
          >
            ...
          </div>
        )}
      </div>

      <div>
        <p style={{ margin: "0 0 4px", fontWeight: 500, fontSize: "15px" }}>
          {profile.username || "—"}
        </p>
        <p style={{ margin: "0 0 12px", fontSize: "13px", color: "var(--color-text-secondary)" }}>
          {profile.email}
        </p>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          style={{
            fontSize: "13px",
            padding: "6px 14px",
            borderRadius: "8px",
            border: "0.5px solid var(--color-border-secondary)",
            background: "var(--color-background-secondary)",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          {uploading ? "Uploading…" : "Change photo"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <p style={{ margin: "6px 0 0", fontSize: "11px", color: "var(--color-text-tertiary)" }}>
          PNG, JPG, WebP — max 5 MB
        </p>
      </div>
    </div>
  );
}

// ─── Field Row ────────────────────────────────────────────────────────────────
function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <label
        style={{
          display: "block",
          fontSize: "13px",
          fontWeight: 500,
          marginBottom: "6px",
          color: "var(--color-text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </label>
      {children}
      {hint && (
        <p style={{ margin: "5px 0 0", fontSize: "12px", color: "var(--color-text-tertiary)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: "10px 12px",
        fontSize: "14px",
        borderRadius: "8px",
        border: "0.5px solid var(--color-border-secondary)",
        background: "var(--color-background-primary)",
        color: "var(--color-text-primary)",
        outline: "none",
        boxSizing: "border-box",
        ...props.style,
      }}
    />
  );
}

// ─── Save Button ──────────────────────────────────────────────────────────────
function SaveButton({ loading, children }: { loading: boolean; children?: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        padding: "10px 24px",
        borderRadius: "8px",
        border: "none",
        background: loading ? "#AFA9EC" : "#534AB7",
        color: "#fff",
        fontSize: "14px",
        fontWeight: 500,
        cursor: loading ? "not-allowed" : "pointer",
        transition: "background 0.15s",
      }}
    >
      {loading ? "Saving…" : children ?? "Save changes"}
    </button>
  );
}

// ─── Tab: Profile (username + avatar) ────────────────────────────────────────
function ProfileTab({ profile, setProfile, showToast }: TabProps) {
  const [username, setUsername] = useState(profile.username);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    try {
      // Verify session is active before attempting write
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated — please sign in again.");

      const { error, data } = await supabase
        .from("profiles")
        .update({ username: username.trim() })
        .eq("id", user.id)  // use live auth uid, not stale prop
        .select();

      console.log("[ProfileSettings] update result:", { data, error });
      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("No rows updated. Check that an UPDATE policy exists on the profiles table for authenticated users.");
      }

      setProfile((p) => p ? { ...p, username: username.trim() } : p);
      showToast("Username updated.", "success");
    } catch (err: any) {
      console.error("[ProfileSettings] save error:", err);
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <AvatarSection
        profile={profile}
        onUpdate={(url) => setProfile((p) => p ? { ...p, avatar_url: url } : p)}
        onError={(msg) => showToast(msg, "error")}
      />
      <div
        style={{
          borderTop: "0.5px solid var(--color-border-tertiary)",
          paddingTop: "1.5rem",
          marginBottom: "1.5rem",
        }}
      />
      <Field
        label="Username"
        hint="Your public display name. Visible to other users."
      >
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="your_username"
          maxLength={32}
          required
        />
      </Field>
      <SaveButton loading={loading} />
    </form>
  );
}

// ─── Tab: Account (email) ─────────────────────────────────────────────────────
function AccountTab({ profile, setProfile, showToast }: TabProps) {
  const [email, setEmail] = useState(profile.email);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || email === profile.email) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated — please sign in again.");

      // 1. Update Supabase Auth — sends a confirmation email to the new address
      const { error: authError } = await supabase.auth.updateUser({ email });
      if (authError) throw authError;

      // 2. Mirror to profiles table
      const { error: dbError, data } = await supabase
        .from("profiles")
        .update({ email })
        .eq("id", user.id)
        .select();

      console.log("[ProfileSettings] email update result:", { data, dbError });
      if (dbError) throw dbError;
      if (!data || data.length === 0) {
        throw new Error("No rows updated. Check that an UPDATE policy exists on the profiles table.");
      }

      setProfile((p) => p ? { ...p, email } : p);
      showToast(
        "Confirmation email sent to " + email + ". Check your inbox.",
        "success"
      );
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field
        label="Email address"
        hint="A confirmation link will be sent to the new address before the change takes effect."
      >
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Field>
      <SaveButton loading={loading}>Update email</SaveButton>
    </form>
  );
}

// ─── Tab: Password ────────────────────────────────────────────────────────────
function PasswordTab({ showToast }: { showToast: TabProps["showToast"] }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (next !== confirm) {
      showToast("Passwords do not match.", "error");
      return;
    }
    if (next.length < 8) {
      showToast("Password must be at least 8 characters.", "error");
      return;
    }
    setLoading(true);
    try {
      // Re-authenticate with current password first
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) throw new Error("No authenticated user found.");

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: current,
      });
      if (signInError) throw new Error("Current password is incorrect.");

      // Update to new password — handled entirely by Supabase Auth
      const { error } = await supabase.auth.updateUser({ password: next });
      if (error) throw error;

      setCurrent("");
      setNext("");
      setConfirm("");
      showToast("Password updated successfully.", "success");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          background: "var(--color-background-secondary)",
          borderRadius: "10px",
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
          fontSize: "13px",
          color: "var(--color-text-secondary)",
          borderLeft: "3px solid #534AB7",
        }}
      >
        Passwords are managed securely by Supabase Auth — they are never stored
        in your profiles table. This is the correct and safe approach.
      </div>
      <Field label="Current password">
        <Input
          type="password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          placeholder="Enter current password"
          required
        />
      </Field>
      <Field label="New password" hint="Minimum 8 characters.">
        <Input
          type="password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          placeholder="Enter new password"
          minLength={8}
          required
        />
      </Field>
      <Field label="Confirm new password">
        <Input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repeat new password"
          required
        />
      </Field>
      <SaveButton loading={loading}>Change password</SaveButton>
    </form>
  );
}

// ─── Shared tab props ─────────────────────────────────────────────────────────
interface TabProps {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
  showToast: (msg: string, type: "success" | "error") => void;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ProfileSettings() {
  const { profile, setProfile, loading, error } = useProfile();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  function showToast(msg: string, type: "success" | "error") {
    setToast({ msg, type });
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: "Profile" },
    { id: "account", label: "Account" },
    { id: "password", label: "Password" },
  ];

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-secondary)" }}>
        Loading…
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#A32D2D" }}>
        {error ?? "Profile not found."}
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input:focus {
          outline: none;
          border-color: #534AB7 !important;
          box-shadow: 0 0 0 3px rgba(83,74,183,0.12);
        }
      `}</style>

      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
        }}
      >
        {/* Page header */}
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 500,
            margin: "0 0 0.25rem",
          }}
        >
          Settings
        </h1>
        <p
          style={{
            margin: "0 0 2rem",
            fontSize: "14px",
            color: "var(--color-text-secondary)",
          }}
        >
          Manage your profile, email, and password.
        </p>

        {/* Tab navigation */}
        <div
          style={{
            display: "flex",
            gap: "0",
            borderBottom: "0.5px solid var(--color-border-tertiary)",
            marginBottom: "2rem",
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "10px 18px",
                fontSize: "14px",
                fontWeight: activeTab === t.id ? 500 : 400,
                background: "none",
                border: "none",
                borderBottom: activeTab === t.id ? "2px solid #534AB7" : "2px solid transparent",
                color: activeTab === t.id ? "#534AB7" : "var(--color-text-secondary)",
                cursor: "pointer",
                transition: "color 0.15s, border-color 0.15s",
                marginBottom: "-0.5px",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          style={{
            background: "var(--color-background-primary)",
            borderRadius: "var(--border-radius-lg, 12px)",
            border: "0.5px solid var(--color-border-tertiary)",
            padding: "1.75rem",
          }}
        >
          {activeTab === "profile" && (
            <ProfileTab profile={profile} setProfile={setProfile} showToast={showToast} />
          )}
          {activeTab === "account" && (
            <AccountTab profile={profile} setProfile={setProfile} showToast={showToast} />
          )}
          {activeTab === "password" && <PasswordTab showToast={showToast} />}
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}