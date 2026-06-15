import { useState, useEffect } from 'react'

export default function GroupsTab({ uid, user, leaderboard, groups, loading, isGlobalAdmin, createGroup, joinGroup, adjustPoints, promoteAdmin, demoteAdmin, removeMember, leaveGroup, getGroupMembers, getAllUsers, addMemberByUid }) {
  const [view, setView] = useState('list')
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [showJoin, setShowJoin] = useState(false)
  const [createName, setCreateName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [createError, setCreateError] = useState('')
  const [joinError, setJoinError] = useState('')
  const [copiedId, setCopiedId] = useState(null)
  const [adjustValues, setAdjustValues] = useState({})
  const [memberCounts, setMemberCounts] = useState({})
  const [showAddMembers, setShowAddMembers] = useState(false)
  const [allUsers, setAllUsers] = useState([])
  const [addingUid, setAddingUid] = useState(null)
  const [userSearch, setUserSearch] = useState('')

  // Subscribe to member counts for list view
  useEffect(() => {
    if (!groups.length) return
    const unsubs = groups.map(g =>
      getGroupMembers(g.id, (mems) => {
        setMemberCounts(prev => ({ ...prev, [g.id]: mems.length }))
      })
    )
    return () => unsubs.forEach(u => u())
  }, [groups.map(g => g.id).join(',')])

  // Subscribe to members for detail view
  useEffect(() => {
    if (view !== 'detail' || !selectedGroup) return
    const unsub = getGroupMembers(selectedGroup.id, (mems) => {
      setMembers(mems)
      const vals = {}
      mems.forEach(m => { vals[m.uid] = m.pointsAdjustment ?? 0 })
      setAdjustValues(vals)
    })
    return unsub
  }, [view, selectedGroup?.id])

  function copyCode(code, id) {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  async function handleCreate() {
    if (!createName.trim()) return
    setCreateError('')
    try {
      await createGroup(createName.trim())
      setCreateName('')
      setShowCreate(false)
    } catch (e) {
      setCreateError(e.message)
    }
  }

  async function handleJoin() {
    if (!joinCode.trim()) return
    setJoinError('')
    try {
      await joinGroup(joinCode.trim())
      setJoinCode('')
      setShowJoin(false)
    } catch (e) {
      setJoinError(e.message || 'Invalid code')
    }
  }

  function getMemberPoints(memberUid, pointsAdjustment) {
    const entry = leaderboard?.find(e => e.uid === memberUid)
    return (entry?.totalPoints || 0) + (pointsAdjustment || 0)
  }

  function isAdmin() {
    return selectedGroup?.admins?.includes(uid)
  }

  const sortedMembers = [...members].sort((a, b) =>
    getMemberPoints(b.uid, b.pointsAdjustment) - getMemberPoints(a.uid, a.pointsAdjustment)
  )

  const adminCount = members.filter(m => m.role === 'admin').length

  // ── DETAIL VIEW ────────────────────────────────────────────────────────────
  if (view === 'detail' && selectedGroup) {
    const codeKey = 'detail-' + selectedGroup.id
    return (
      <div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={() => { setView('list'); setSelectedGroup(null); setMembers([]) }} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10,
            width: 36, height: 36, cursor: 'pointer', color: 'var(--text1)', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>←</button>
          <div style={{ fontWeight: 900, fontSize: 20, color: 'var(--text1)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedGroup.name}</div>
        </div>

        {/* Invite code */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text4)', letterSpacing: '0.1em', marginBottom: 4 }}>INVITE CODE</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#22c55e', fontFamily: 'DM Mono, monospace', letterSpacing: '0.15em' }}>{selectedGroup.inviteCode}</div>
          </div>
          <button onClick={() => copyCode(selectedGroup.inviteCode, codeKey)} style={{
            background: copiedId === codeKey ? 'rgba(34,197,94,0.15)' : 'var(--bg3)',
            border: `1px solid ${copiedId === codeKey ? 'rgba(34,197,94,0.4)' : 'var(--border)'}`,
            borderRadius: 10, padding: '8px 14px', cursor: 'pointer',
            color: copiedId === codeKey ? '#22c55e' : 'var(--text2)', fontWeight: 700, fontSize: 13,
          }}>{copiedId === codeKey ? 'Copied!' : 'Copy'}</button>
        </div>

        {/* Add members button (admins only) */}
        {isAdmin() && (
          <button onClick={async () => {
            const users = await getAllUsers()
            setAllUsers(users)
            setUserSearch('')
            setShowAddMembers(true)
          }} style={{
            width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '12px', color: 'var(--text1)', fontSize: 14,
            fontWeight: 700, cursor: 'pointer', marginBottom: 16, display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 18 }}>＋</span> Add Members
          </button>
        )}

        {/* Members leaderboard */}
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text4)', letterSpacing: '0.1em', marginBottom: 10 }}>MEMBERS · {members.length}</div>
        {sortedMembers.map((member, i) => {
          const totalPts = getMemberPoints(member.uid, member.pointsAdjustment)
          const isMe = member.uid === uid
          const memberIsAdmin = member.role === 'admin'
          const canDemote = memberIsAdmin && adminCount > 1
          return (
            <div key={member.uid} style={{
              background: isMe ? 'rgba(34,197,94,0.06)' : 'var(--bg2)',
              border: `1px solid ${isMe ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`,
              borderRadius: 14, padding: '12px 14px', marginBottom: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--text4)', minWidth: 22, textAlign: 'center', fontFamily: 'DM Mono' }}>#{i + 1}</div>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 15, fontWeight: 700, color: 'var(--text2)' }}>
                  {(member.displayName || '?')[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: isMe ? '#22c55e' : 'var(--text1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {member.displayName || 'Unknown'}{isMe ? ' (you)' : ''}
                    </span>
                    {memberIsAdmin && (
                      <span style={{ fontSize: 9, fontWeight: 800, background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 4, padding: '2px 6px', flexShrink: 0, letterSpacing: '0.05em' }}>ADMIN</span>
                    )}
                  </div>
                  {member.pointsAdjustment !== 0 && (
                    <div style={{ fontSize: 10, color: 'var(--text4)', marginTop: 1 }}>
                      adj: {member.pointsAdjustment > 0 ? '+' : ''}{member.pointsAdjustment}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#facc15', fontFamily: 'DM Mono' }}>{totalPts}</div>
                  <div style={{ fontSize: 10, color: 'var(--text4)' }}>pts</div>
                </div>
              </div>

              {/* Admin controls */}
              {isAdmin() && !isMe && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <input
                      type="number"
                      value={adjustValues[member.uid] ?? 0}
                      onChange={e => setAdjustValues(prev => ({ ...prev, [member.uid]: e.target.value }))}
                      style={{
                        width: 80, background: 'var(--bg3)', border: '1px solid var(--border)',
                        borderRadius: 8, padding: '6px 10px', color: 'var(--text1)', fontSize: 13,
                        fontFamily: 'DM Mono, monospace',
                      }}
                    />
                    <button onClick={() => adjustPoints(selectedGroup.id, member.uid, adjustValues[member.uid] ?? 0)} style={{
                      background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)',
                      borderRadius: 8, padding: '6px 12px', color: '#22c55e', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}>Save Adj</button>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {!memberIsAdmin && (
                      <button onClick={() => promoteAdmin(selectedGroup.id, member.uid)} style={{
                        background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
                        borderRadius: 8, padding: '5px 10px', color: '#22c55e', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                      }}>Make Admin</button>
                    )}
                    {canDemote && (
                      <button onClick={() => demoteAdmin(selectedGroup.id, member.uid)} style={{
                        background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.25)',
                        borderRadius: 8, padding: '5px 10px', color: '#facc15', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                      }}>Remove Admin</button>
                    )}
                    <button onClick={() => removeMember(selectedGroup.id, member.uid)} style={{
                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                      borderRadius: 8, padding: '5px 10px', color: '#ef4444', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                    }}>Remove</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Add Members Modal */}
        {showAddMembers && (
          <div onClick={() => setShowAddMembers(false)} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          }}>
            <div onClick={e => e.stopPropagation()} style={{
              background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '20px 20px 0 0',
              padding: '24px 16px', width: '100%', maxWidth: 480, maxHeight: '75vh', display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontWeight: 900, fontSize: 18, color: 'var(--text1)', marginBottom: 4 }}>Add Members</div>
              <div style={{ fontSize: 12, color: 'var(--text4)', marginBottom: 14 }}>All signed-up users — tap to add to this group</div>
              <input
                autoFocus
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                placeholder="Search by name..."
                style={{
                  background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10,
                  padding: '10px 14px', color: 'var(--text1)', fontSize: 14,
                  marginBottom: 12, outline: 'none', width: '100%', boxSizing: 'border-box',
                }}
              />
              <div style={{ overflowY: 'auto', flex: 1 }}>
                {allUsers
                  .filter(u => !members.find(m => m.uid === u.uid))
                  .filter(u => !userSearch || (u.displayName || '').toLowerCase().includes(userSearch.toLowerCase()) || (u.email || '').toLowerCase().includes(userSearch.toLowerCase()))
                  .map(u => (
                    <div key={u.uid} style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 4px',
                      borderBottom: '1px solid var(--border)',
                    }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'var(--text2)', flexShrink: 0 }}>
                        {(u.displayName || '?')[0].toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.displayName || 'Unknown'}</div>
                        <div style={{ fontSize: 11, color: 'var(--text4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                      </div>
                      <button
                        disabled={addingUid === u.uid}
                        onClick={async () => {
                          setAddingUid(u.uid)
                          try { await addMemberByUid(selectedGroup.id, u.uid) } catch {}
                          setAddingUid(null)
                        }}
                        style={{
                          background: 'linear-gradient(135deg,#22c55e,#16a34a)', border: 'none',
                          borderRadius: 8, padding: '6px 14px', color: '#0b1120',
                          fontSize: 13, fontWeight: 800, cursor: 'pointer',
                          opacity: addingUid === u.uid ? 0.5 : 1, flexShrink: 0,
                        }}
                      >{addingUid === u.uid ? '...' : 'Add'}</button>
                    </div>
                  ))}
                {allUsers.filter(u => !members.find(m => m.uid === u.uid)).length === 0 && (
                  <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text4)', fontSize: 13 }}>Everyone is already in this group</div>
                )}
              </div>
              <button onClick={() => setShowAddMembers(false)} style={{
                marginTop: 16, width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '13px', color: 'var(--text2)', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}>Done</button>
            </div>
          </div>
        )}

        {/* Leave group */}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          {isAdmin() && adminCount === 1 && (
            <div style={{ fontSize: 12, color: '#facc15', marginBottom: 8, textAlign: 'center' }}>
              You are the only admin. Promote another member before leaving.
            </div>
          )}
          <button
            onClick={() => {
              leaveGroup(selectedGroup.id)
              setView('list')
              setSelectedGroup(null)
            }}
            disabled={isAdmin() && adminCount === 1}
            style={{
              width: '100%', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 12, padding: '13px', color: isAdmin() && adminCount === 1 ? 'var(--text4)' : '#ef4444',
              fontSize: 14, fontWeight: 700, cursor: isAdmin() && adminCount === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            Leave Group
          </button>
        </div>
      </div>
    )
  }

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ fontWeight: 900, fontSize: 22, color: 'var(--text1)' }}>My Groups</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowJoin(true)} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10,
            padding: '7px 14px', color: 'var(--text2)', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}>Join</button>
          {isGlobalAdmin && (
            <button onClick={() => setShowCreate(true)} style={{
              background: 'linear-gradient(135deg,#22c55e,#16a34a)', border: 'none', borderRadius: 10,
              padding: '7px 14px', color: '#0b1120', fontSize: 13, fontWeight: 800, cursor: 'pointer',
            }}>+ Create</button>
          )}
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text4)' }}>Loading...</div>}

      {!loading && groups.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--bg2)', border: '1px dashed var(--border)', borderRadius: 16 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>👥</div>
          <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 8, color: 'var(--text1)' }}>No groups yet</div>
          <div style={{ color: 'var(--text3)', fontSize: 13, lineHeight: 1.6 }}>Create a group or join one with an invite code to compete with friends.</div>
        </div>
      )}

      {groups.map(group => {
        const codeKey = 'list-' + group.id
        return (
          <div key={group.id} onClick={() => { setSelectedGroup(group); setView('detail') }} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14,
            padding: '14px 16px', marginBottom: 10, cursor: 'pointer', transition: 'border-color 0.15s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text1)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{group.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text4)' }}>{memberCounts[group.id] ?? '...'} members</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <button
                  onClick={e => { e.stopPropagation(); copyCode(group.inviteCode, codeKey) }}
                  style={{
                    background: copiedId === codeKey ? 'rgba(34,197,94,0.15)' : 'var(--bg3)',
                    border: `1px solid ${copiedId === codeKey ? 'rgba(34,197,94,0.4)' : 'var(--border)'}`,
                    borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
                    color: copiedId === codeKey ? '#22c55e' : 'var(--text3)', fontSize: 12, fontWeight: 700, fontFamily: 'DM Mono, monospace',
                  }}
                >
                  {copiedId === codeKey ? 'Copied!' : group.inviteCode}
                </button>
                <span style={{ color: 'var(--text4)', fontSize: 16 }}>›</span>
              </div>
            </div>
          </div>
        )
      })}

      {/* Create Modal */}
      {showCreate && (
        <div onClick={() => setShowCreate(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20,
            padding: '24px 20px', width: '100%', maxWidth: 360,
          }}>
            <div style={{ fontWeight: 900, fontSize: 18, color: 'var(--text1)', marginBottom: 16 }}>Create Group</div>
            <input
              autoFocus
              value={createName}
              onChange={e => setCreateName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder="Group name"
              style={{
                width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '12px 14px', color: 'var(--text1)', fontSize: 15,
                marginBottom: 12, boxSizing: 'border-box',
              }}
            />
            {createError && <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 10 }}>{createError}</div>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setShowCreate(false); setCreateName(''); setCreateError('') }} style={{
                flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10,
                padding: '12px', color: 'var(--text2)', fontWeight: 700, cursor: 'pointer',
              }}>Cancel</button>
              <button onClick={handleCreate} style={{
                flex: 1, background: 'linear-gradient(135deg,#22c55e,#16a34a)', border: 'none', borderRadius: 10,
                padding: '12px', color: '#0b1120', fontWeight: 800, cursor: 'pointer',
              }}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Join Modal */}
      {showJoin && (
        <div onClick={() => setShowJoin(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20,
            padding: '24px 20px', width: '100%', maxWidth: 360,
          }}>
            <div style={{ fontWeight: 900, fontSize: 18, color: 'var(--text1)', marginBottom: 8 }}>Join Group</div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16 }}>Enter the 6-character invite code</div>
            <input
              autoFocus
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
              placeholder="ABC123"
              maxLength={6}
              style={{
                width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '12px 14px', color: 'var(--text1)', fontSize: 22,
                fontFamily: 'DM Mono, monospace', letterSpacing: '0.2em', textAlign: 'center',
                marginBottom: 12, boxSizing: 'border-box',
              }}
            />
            {joinError && <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 10 }}>{joinError}</div>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setShowJoin(false); setJoinCode(''); setJoinError('') }} style={{
                flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10,
                padding: '12px', color: 'var(--text2)', fontWeight: 700, cursor: 'pointer',
              }}>Cancel</button>
              <button onClick={handleJoin} style={{
                flex: 1, background: 'linear-gradient(135deg,#22c55e,#16a34a)', border: 'none', borderRadius: 10,
                padding: '12px', color: '#0b1120', fontWeight: 800, cursor: 'pointer',
              }}>Join</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
