import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function Dashboard({ user, onLogout }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    if (user.role === 'FREELANCER') {
      fetchInvites();
    }
  }, [user]);

  const fetchInvites = async () => {
    try {
      const res = await API.get('/my-invites');
      setInvites(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostProject = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
      await API.post('/post-project', { title, description, budget: parseFloat(budget), requiredSkills: skillsArray });
      alert('Project posted and auto-matches invited successfully!');
      setTitle(''); setDescription(''); setBudget(''); setRequiredSkills('');
    } catch (err) {
      alert('Failed to post project');
    }
  };

  const handleInviteAction = async (id, status) => {
    try {
      await API.patch(`/invitation/${id}`, { status });
      alert(`Invitation ${status.toLowerCase()}!`);
      fetchInvites();
    } catch (err) {
      alert('Action failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Navigation Bar */}
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: '700' }}>No-Bid Marketplace</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', color: '#475569', fontWeight: '500' }}>{user.name || user.email} <strong style={{ color: '#2563eb' }}>({user.role})</strong></span>
          <button onClick={onLogout} style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', color: '#334155', fontSize: '13px' }}>Logout</button>
        </div>
      </nav>

      {/* Main Container */}
      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
        {user.role === 'CLIENT' ? (
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <h2 style={{ marginTop: 0, color: '#0f172a', fontSize: '20px' }}>Post a New Fixed-Budget Project</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Fill in the project details below. Our smart matching engine will automatically find and invite qualified freelancers instantly.</p>
            
            <form onSubmit={handlePostProject}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Project Title</label>
                <input type="text" placeholder="e.g. Full Stack E-commerce Redesign" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Project Description</label>
                <textarea placeholder="Describe the project scope and deliverables..." rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={labelStyle}>Fixed Budget ($)</label>
                  <input type="number" placeholder="1500" value={budget} onChange={(e) => setBudget(e.target.value)} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Required Skills (Comma separated)</label>
                  <input type="text" placeholder="React, Node.js, Tailwind" value={requiredSkills} onChange={(e) => setRequiredSkills(e.target.value)} required style={inputStyle} />
                </div>
              </div>

              <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>
                Post Project & Dispatch Invites
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h2 style={{ color: '#0f172a', fontSize: '22px', marginBottom: '8px' }}>Your Auto-Matched Invitations</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Direct invitations matched specifically to your skill profile—no bidding wars required.</p>

            {invites.length === 0 ? (
              <div style={{ background: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0', color: '#64748b' }}>
                No pending project invitations right now. Check back soon!
              </div>
            ) : (
              invites.map((inv) => (
                <div key={inv.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, color: '#0f172a', fontSize: '18px' }}>{inv.project.title}</h3>
                    <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                      ${inv.project.budget} Fixed Budget
                    </span>
                  </div>
                  <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5', marginBottom: '16px' }}>{inv.project.description}</p>
                  
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {inv.project.requiredSkills.map((skill, index) => (
                      <span key={index} style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '500' }}>
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => handleInviteAction(inv.id, 'ACCEPTED')} style={{ padding: '8px 20px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                      Accept Invitation
                    </button>
                    <button onClick={() => handleInviteAction(inv.id, 'REJECTED')} style={{ padding: '8px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                      Decline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  color: '#334155',
  marginBottom: '6px'
};

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

// import React, { useState, useEffect } from 'react';
// import API from '../services/api';

// export default function Dashboard({ user, onLogout }) {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [budget, setBudget] = useState('');
//   const [requiredSkills, setRequiredSkills] = useState('');
//   const [invites, setInvites] = useState([]);

//   useEffect(() => {
//     if (user.role === 'FREELANCER') {
//       fetchInvites();
//     }
//   }, [user]);

//   const fetchInvites = async () => {
//     try {
//       const res = await API.get('/my-invites');
//       setInvites(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handlePostProject = async (e) => {
//     e.preventDefault();
//     try {
//       const skillsArray = requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
//       await API.post('/post-project', { title, description, budget: parseFloat(budget), requiredSkills: skillsArray });
//       alert('Project posted and auto-matches invited successfully!');
//       setTitle(''); setDescription(''); setBudget(''); setRequiredSkills('');
//     } catch (err) {
//       alert('Failed to post project');
//     }
//   };

//   const handleInviteAction = async (id, status) => {
//     try {
//       await API.patch(`/invitation/${id}`, { status });
//       alert(`Invitation ${status.toLowerCase()}!`);
//       fetchInvites();
//     } catch (err) {
//       alert('Action failed');
//     }
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <h2>Welcome, {user.name || user.email} ({user.role})</h2>
//         <button onClick={onLogout}>Logout</button>
//       </div>
//       <hr />

//       {user.role === 'CLIENT' ? (
//         <div>
//           <h3>Post a New Project (No-Bid)</h3>
//           <form onSubmit={handlePostProject}>
//             <input type="text" placeholder="Project Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
//             <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
//             <input type="number" placeholder="Fixed Budget ($)" value={budget} onChange={(e) => setBudget(e.target.value)} required style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
//             <input type="text" placeholder="Required Skills (comma separated, e.g. React)" value={requiredSkills} onChange={(e) => setRequiredSkills(e.target.value)} required style={{ display: 'block', width: '100%', marginBottom: '10px' }} />
//             <button type="submit">Post Project & Auto-Match</button>
//           </form>
//         </div>
//       ) : (
//         <div>
//           <h3>Your Auto-Matched Project Invitations</h3>
//           {invites.length === 0 ? <p>No pending invitations found.</p> : (
//             invites.map((inv) => (
//               <div key={inv.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
//                 <h4>{inv.project.title}</h4>
//                 <p>{inv.project.description}</p>
//                 <p><strong>Budget:</strong> ${inv.project.budget}</p>
//                 <p><strong>Required Skills:</strong> {inv.project.requiredSkills.join(', ')}</p>
//                 <button onClick={() => handleInviteAction(inv.id, 'ACCEPTED')} style={{ marginRight: '10px', background: 'green', color: 'white' }}>Accept</button>
//                 <button onClick={() => handleInviteAction(inv.id, 'REJECTED')} style={{ background: 'red', color: 'white' }}>Reject</button>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// }