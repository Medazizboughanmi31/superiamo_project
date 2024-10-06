// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(req) {
    // Accéder au cookie "supabase-auth-token" pour récupérer le token
    const token = req.cookies.get('supabase-auth-token');

    // Si le token n'est pas trouvé, redirigez l'utilisateur vers la page de connexion
    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Sinon, continuez la requête normalement
    return NextResponse.next();
}

// Appliquer le middleware aux routes spécifiques
export const config = {
    matcher: ['/dashboard', '/profile'], // Les pages à protéger
};
