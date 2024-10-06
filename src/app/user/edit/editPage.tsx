'use client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { validateAddress } from '@/utils/address'; // Importez la fonction de validation


export default function EditUser() {
    const { data: session } = useSession();
    const [userInfo, setUserInfo] = useState({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        address: '',
        phone: '',
        birthdate: ''
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Réinitialiser les erreurs

        // Valider l'adresse avec l'API
        const isValidAddress = await validateAddress(userInfo.address);

        if (!isValidAddress) {
            setError('L\'adresse doit être située à moins de 50 km de Paris.');
            return;
        }

        // Si tout est bon, soumettre les informations
        // (Envoyer les données modifiées ici)
        console.log('Données utilisateur validées:', userInfo);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Modifier vos informations</h1>
            {error && <p className="text-red-500">{error}</p>}
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
