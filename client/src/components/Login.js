import React, { useState } from 'react';
import API from '../services/api';

export default function Login({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('FREELANCER');
  const [skills, setSkills] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        const formattedSkills = skills.split(',').map((s) => s.trim()).filter(Boolean);
        await API.post('/signup', { email, password, name, role, skills: formattedSkills });
        alert('Registration successful! Please login.');
        setIsRegistering(false);
      } else {
        const res = await API.post('/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        onLoginSuccess(res.data.user);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Action failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: '#ffffff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        width: '100%',
        maxWidth: '420px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: '#0f172a', margin: '0 0 8px 0', fontSize: '24px' }}>
            {isRegistering ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p style={{ color: '#64748b', margin: '0', fontSize: '14px' }}>
            {isRegistering ? 'Join the No-Bid Freelance Revolution' : 'Sign in to access your dashboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Full Name</label>
                <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>I want to join as a</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
                  <option value="FREELANCER">Freelancer</option>
                  <option value="CLIENT">Client</option>
                </select>
              </div>
              {role === 'FREELANCER' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Skills (comma separated)</label>
                  <input type="text" placeholder="React, Node.js, Python" value={skills} onChange={(e) => setSkills(e.target.value)} style={inputStyle} />
                </div>
              )}
            </>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Email Address</label>
            <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
          </div>

          <button type="submit" style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}>
            {isRegistering ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={() => setIsRegistering(!isRegistering)} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
            {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  backgroundColor: '#f8fafc'
};

// import React, { useState } from 'react';
// import API from '../services/api';

// export default function Login({ onLoginSuccess }) {
//   const [isRegistering, setIsRegistering] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [role, setRole] = useState('FREELANCER');
//   const [skills, setSkills] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (isRegistering) {
//         const formattedSkills = skills.split(',').map((s) => s.trim()).filter(Boolean);
//         await API.post('/signup', { email, password, name, role, skills: formattedSkills });
//         alert('Registration successful! Please login.');
//         setIsRegistering(false);
//       } else {
//         const res = await API.post('/login', { email, password });
//         localStorage.setItem('token', res.data.token);
//         localStorage.setItem('user', JSON.stringify(res.data.user));
//         onLoginSuccess(res.data.user);
//       }
//     } catch (err) {
//       alert(err.response?.data?.error || 'Action failed');
//     }
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
//       <h2>{isRegistering ? 'Register' : 'Login'}</h2>
//       <form onSubmit={handleSubmit}>
//         {isRegistering && (
//           <>
//             <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
//             <select value={role} onChange={(e) => setRole(e.target.value)} style={{ display: 'block', width: '100%', marginBottom: '10px' }}>
//               <option value="FREELANCER">Freelancer</option>
//               <option value="CLIENT">Client</option>
//             </select>
//             {role === 'FREELANCER' && (
//               <input type="text" placeholder="Skills (comma separated, e.g. React, Node)" value={skills} onChange={(e) => setSkills(e.target.value)} style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
//             )}
//           </>
//         )}
//         <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
//         <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
//         <button type="submit" style={{ width: '100%', padding: '10px' }}>{isRegistering ? 'Register' : 'Login'}</button>
//       </form>
//       <button onClick={() => setIsRegistering(!isRegistering)} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', marginTop: '10px' }}>
//         {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
//       </button>
//     </div>
//   );
// }