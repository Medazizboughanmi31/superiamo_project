'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/superbaseClient';

export default function Profile() {
    const { data: session } = useSession();
    const [userInfo, setUserInfo] = useState({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        address: '',
        phone: '',
        birthdate: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const { data} = await supabase
                .from('users')
                .select('*')
                .eq('email', session?.user?.email)
                .single();

            if (data) {
                setUserInfo({ ...userInfo, ...data });
            }
        };

        fetchUserData();
    }, [session]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Enregistrer les données utilisateur dans Supabase
        const { data, error } = await supabase
            .from('users')
            .upsert(userInfo, { onConflict: 'email' });

        if (error) {
            console.error('Erreur de mise à jour:', error.message);
        } else {
            console.log('Utilisateur mis à jour:', data);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Modifier vos informations</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    name="name"
                    value={userInfo.name}
                    onChange={handleChange}
                    placeholder="Nom"
                    className="border p-2"
                />
                <input
                    type="email"
                    name="email"
                    value={userInfo.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="border p-2"
                    disabled
                />
                <input
                    type="text"
                    name="address"
                    value={userInfo.address}
                    onChange={handleChange}
                    placeholder="Adresse"
                    className="border p-2"
                />
                <input
                    type="text"
                    name="phone"
                    value={userInfo.phone}
                    onChange={handleChange}
                    placeholder="Téléphone"
                    className="border p-2"
                />
                <input
                    type="date"
                    name="birthdate"
                    value={userInfo.birthdate}
                    onChange={handleChange}
                    placeholder="Date de naissance"
                    className="border p-2"
                />
                <button type="submit" className="bg-blue-500 text-white p-3 rounded">
                    Enregistrer
                </button>
            </form>
        </div>
    );
}
