import React, { useState } from 'react';
import { Wrench, Shield, LogOut } from 'lucide-react';

function App() {
  const [code, setCode] = useState('');
  const [user, setUser] = useState(null);

  const handleLogin = (inputCode) => {
    if (inputCode === '0000') {
      setUser({ nom: 'PATRON', role: 'patron' });
    } else if (inputCode === '1234') {
      setUser({ nom: 'EMPLOYE', role: 'employe' });
    } else {
      alert('Code incorrect');
    }
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ background: '#1a1a1a', border: '2px solid rgba(251, 191, 36, 0.5)', borderRadius: '1rem', padding: '2rem', maxWidth: '28rem', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Wrench size={64} style={{ color: '#fbbf24', margin: '0 auto 1rem' }} />
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24', marginBottom: '0.5rem' }}>LOISON CREATION</h1>
            <p style={{ color: '#9ca3af' }}>Systeme de gestion</p>
          </div>
          <input
            type="password"
            placeholder="Code 4 chiffres"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && code.length === 4 && handleLogin(code)}
            maxLength={4}
            autoFocus
            style={{ width: '100%', background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: 'white', textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.25em', marginBottom: '1rem' }}
          />
          <button
            onClick={() => handleLogin(code)}
            disabled={code.length !== 4}
            style={{ width: '100%', background: code.length === 4 ? '#fbbf24' : '#3a3a3a', color: code.length === 4 ? 'black' : '#6b7280', fontWeight: 'bold', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', cursor: code.length === 4 ? 'pointer' : 'not-allowed' }}
          >
            SE CONNECTER
          </button>
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(42, 42, 42, 0.5)', borderRadius: '0.5rem' }}>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', textAlign: 'center', marginBottom: '0.75rem' }}>Codes de test:</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem' }}>
              <div style={{ background: '#1a1a1a', padding: '0.75rem', borderRadius: '0.25rem', textAlign: 'center' }}>
                <div style={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: '0.25rem' }}>PATRON</div>
                <div style={{ color: '#d1d5db', fontSize: '1.125rem', fontFamily: 'monospace' }}>0000</div>
              </div>
              <div style={{ background: '#1a1a1a', padding: '0.75rem', borderRadius: '0.25rem', textAlign: 'center' }}>
                <div style={{ color: '#60a5fa', fontWeight: 'bold', marginBottom: '0.25rem' }}>EMPLOYE</div>
                <div style={{ color: '#d1d5db', fontSize: '1.125rem', fontFamily: 'monospace' }}>1234</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white' }}>
      <header style={{ background: 'linear-gradient(to right, #1a1a1a, #2a2a2a, #1a1a1a)', borderBottom: '1px solid rgba(251, 191, 36, 0.3)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield size={28} style={{ color: '#fbbf24' }} />
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fbbf24' }}>
                {user.role === 'patron' ? 'ESPACE PATRON' : 'ESPACE EMPLOYE'}
              </h1>
              <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{user.nom}</p>
            </div>
          </div>
          <button onClick={() => setUser(null)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '0.5rem 0.75rem', borderRadius: '0.25rem', fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}>
            <LogOut size={16} />
            Deconnexion
          </button>
        </div>
      </header>
      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem 1rem', textAlign: 'center', paddingTop: '4rem' }}>
        <Shield size={64} style={{ color: '#fbbf24', margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Bienvenue sur Loison Creation !</h2>
        <p style={{ color: '#9ca3af', marginBottom: '1.5rem', fontSize: '1.125rem' }}>Votre systeme de gestion est pret a l emploi</p>
        <div style={{ maxWidth: '42rem', margin: '0 auto', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '0.5rem', padding: '1.5rem', textAlign: 'left' }}>
          <h3 style={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: '1rem', fontSize: '1.25rem' }}>Fonctionnalites disponibles</h3>
          <ul style={{ color: '#d1d5db', fontSize: '0.875rem', listStyle: 'disc', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
            <li>Gestion des chantiers</li>
            <li>Suivi du temps et pointage</li>
            <li>Gestion des taches</li>
            <li>Gestion des stocks</li>
            <li>Planning / Calendrier</li>
            <li>Suivi des difficultes</li>
            <li>Analyse de rentabilite</li>
            <li>Sauvegarde automatique</li>
          </ul>
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '0.5rem' }}>
            <p style={{ color: '#60a5fa', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Version de demonstration</p>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
              Cette version vous permet de tester la connexion. La version complete avec tous les modules sera deployee prochainement.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
