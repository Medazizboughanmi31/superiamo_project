'use client';
import { supabase } from '@/utils/superbaseClient';
import { useRouter } from 'next/router';
import { useState } from 'react';
import twofactor from 'node-2fa';
import {mockSession} from "next-auth/client/__tests__/helpers/mocks";
import user = mockSession.user;

export default function Login() {
    const router = useRouter();
    const [mfaSecret, setMfaSecret] = useState('');
    const [mfaCodeInput, setMfaCodeInput] = useState('');
    const [isMfaStep, setIsMfaStep] = useState(false);

    const signInWithGoogle = async () => {
        const { error} = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });

        if (error) {
            console.error('Erreur d\'authentification:', error.message);
        } else {
            // Générer un secret MFA après la connexion OAuth réussie
            const newSecret = twofactor.generateSecret({
                name: "Superiamo",
                account: user.email , // Utilisez l'email utilisateur
            });
            setMfaSecret(newSecret.secret);

            // Générer le code MFA
            const generatedToken = twofactor.generateToken(newSecret.secret);
            if (generatedToken) {
                console.log(`Votre code MFA est : ${generatedToken.token}`);
            }

            // Vous pouvez soit envoyer cet email à l'utilisateur soit l'afficher directement pour le test
            if (generatedToken) {
                alert(`Votre code MFA : ${generatedToken.token}`);
            }

            // Passer à l'étape de la vérification MFA
            setIsMfaStep(true);
        }
    };

    const verifyMfaCode = () => {
        const isValid = twofactor.verifyToken(mfaSecret, mfaCodeInput);

        if (isValid && isValid.delta === 0) {
            // Le code MFA est valide
            router.push('/dashboard/dashboard'); // Redirige vers le tableau de bord après la validation MFA
        } else {
            console.error("Code MFA invalide.");
        }
    };

    return (
        <div className="p-6">
            {!isMfaStep ? (
                <>
                    <h1 className="text-2xl font-bold">Connexion</h1>
                    <button
                        onClick={signInWithGoogle}
                        className="bg-blue-500 text-white p-3 rounded mt-4"
                    >
                        Se connecter avec Google
                    </button>
                </>
            ) : (
                <div>
                    <h1 className="text-2xl font-bold">Vérification MFA</h1>
                    <input
                        type="text"
                        placeholder="Entrez votre code MFA"
                        value={mfaCodeInput}
                        onChange={(e) => setMfaCodeInput(e.target.value)}
                        className="border p-2 mt-4"
                    />
                    <button
                        onClick={verifyMfaCode}
                        className="bg-green-500 text-white p-3 rounded mt-4"
                    >
                        Vérifier le Code
                    </button>
                </div>
            )}
        </div>
    );
}
