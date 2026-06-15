import { useState, useEffect } from 'react'
import {
  collection, doc, onSnapshot, setDoc, addDoc, updateDoc, deleteDoc,
  arrayUnion, arrayRemove, query, where, serverTimestamp, getDocs
} from 'firebase/firestore'
import { db } from '../firebase'

function randomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

export function useGroups(uid, displayName, photoURL) {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) { setLoading(false); return }
    const q = query(collection(db, 'groups'), where('memberUids', 'array-contains', uid))
    const unsub = onSnapshot(q, snap => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }, () => setLoading(false))
    return unsub
  }, [uid])

  async function createGroup(name) {
    const groupRef = await addDoc(collection(db, 'groups'), {
      name,
      createdBy: uid,
      createdAt: serverTimestamp(),
      admins: [uid],
      memberUids: [uid],
      inviteCode: randomCode(),
    })
    await setDoc(doc(db, 'groups', groupRef.id, 'members', uid), {
      uid,
      displayName: displayName || '',
      photoURL: photoURL || '',
      role: 'admin',
      pointsAdjustment: 0,
      joinedAt: serverTimestamp(),
    })
    return groupRef.id
  }

  async function joinGroup(code) {
    const q = query(collection(db, 'groups'), where('inviteCode', '==', code.toUpperCase()))
    const snap = await getDocs(q)
    if (snap.empty) throw new Error('Group not found')
    const groupDoc = snap.docs[0]
    const groupId = groupDoc.id
    await updateDoc(doc(db, 'groups', groupId), { memberUids: arrayUnion(uid) })
    await setDoc(doc(db, 'groups', groupId, 'members', uid), {
      uid,
      displayName: displayName || '',
      photoURL: photoURL || '',
      role: 'member',
      pointsAdjustment: 0,
      joinedAt: serverTimestamp(),
    })
    return groupId
  }

  function getGroupMembers(groupId, callback) {
    const unsub = onSnapshot(collection(db, 'groups', groupId, 'members'), snap => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }

  async function adjustPoints(groupId, targetUid, newAdjustment) {
    await updateDoc(doc(db, 'groups', groupId, 'members', targetUid), {
      pointsAdjustment: Number(newAdjustment),
    })
  }

  async function promoteAdmin(groupId, targetUid) {
    await updateDoc(doc(db, 'groups', groupId), { admins: arrayUnion(targetUid) })
    await updateDoc(doc(db, 'groups', groupId, 'members', targetUid), { role: 'admin' })
  }

  async function demoteAdmin(groupId, targetUid) {
    await updateDoc(doc(db, 'groups', groupId), { admins: arrayRemove(targetUid) })
    await updateDoc(doc(db, 'groups', groupId, 'members', targetUid), { role: 'member' })
  }

  async function removeMember(groupId, targetUid) {
    await updateDoc(doc(db, 'groups', groupId), {
      memberUids: arrayRemove(targetUid),
      admins: arrayRemove(targetUid),
    })
    await deleteDoc(doc(db, 'groups', groupId, 'members', targetUid))
  }

  async function leaveGroup(groupId) {
    return removeMember(groupId, uid)
  }

  return { groups, loading, createGroup, joinGroup, getGroupMembers, adjustPoints, promoteAdmin, demoteAdmin, removeMember, leaveGroup }
}
