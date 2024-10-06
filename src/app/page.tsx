'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/superbaseClient';
import { Session } from '@supabase/supabase-js';

export default function HomePage() {
    const [session, setSession] = useState<Session | null>(null);

    // Vérifier si l'utilisateur est connecté
    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session) {
                setSession(data.session);
            }
        };

        checkSession();
    }, []);

    return (
        <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
            <h1>Bienvenue sur Application de gestion des utilisateurs</h1>
            <p>
                Ceci est la page accueil. Veuillez vous connecter pour accéder à votre
                tableau de bord.
            </p>

            {/* Si l'utilisateur est connecté, afficher son email */}
            {session ? (
                <div>
                    <p>Vous êtes connecté en tant que {session.user.email}</p>
                    <Link href="/dashboard/dashboard">
                        Accéder au tableau de bord
                    </Link>
                </div>
            ) : (
                <div>
                    <Link href="/auth/login">
                        Se connecter
                    </Link>
                </div>
            )}
        </div>
    );
}
