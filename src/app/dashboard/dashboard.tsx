'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/utils/superbaseClient';


export default function Dashboard() {
    const router = useRouter();

    // Définir le type de session comme étant soit Session, soit null
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();

            if (!data?.session) {
                // Si l'utilisateur n'est pas connecté, redirection vers la page de connexion
                router.push('/auth/login');
            } else {
                setSession(data.session);
            }
        };

        getSession();
    }, [router]);

    if (!session) return <p>Chargement...</p>;

    return (
        <div>
            <h1>Tableau de bord</h1>
            <p>Vous êtes connecté en tant que {session.user.email}</p>
        </div>
    );
}
