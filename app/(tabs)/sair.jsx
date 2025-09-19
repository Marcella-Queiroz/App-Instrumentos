import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Sair() {
	const router = useRouter();
	useEffect(() => {
		// FUTURA IMPLEMENTAÇÃO: Limpar autenticação do usuário
		router.replace('login');
	}, [router]);
	return null;
}
