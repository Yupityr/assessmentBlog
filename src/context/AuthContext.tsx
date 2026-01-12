import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "@/supabase/supabaseClient";
import type { Session } from "@supabase/supabase-js";


const AuthContext = createContext<{session: Session | null;}>({ session: null });

export const useSession = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useSession must be used within an AuthContextProvider");
    }
    return context;
}

type Props = {children: React.ReactNode;};

export const AuthContextProvider = ({ children }: Props) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const authStateListener = supabase.auth.onAuthStateChange(
        async (_, session) => {
            setSession(session);
            setLoading(false);
        }
        );

        return () => {
        authStateListener.data.subscription.unsubscribe();
        };
    }, [supabase]);

    return (
        <AuthContext.Provider value={{ session }}>
        {loading ? <div>The page is Loading</div> : children}
        </AuthContext.Provider>
    );
}
