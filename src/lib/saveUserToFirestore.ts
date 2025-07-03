import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'

export const saveUserToFirestore = async (user: any) => {
  if (!user) return

  const userRef = doc(db, 'users', user.uid)

  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    role: 'user', // default role
    createdAt: new Date().toISOString(),
  }, { merge: true }) // merge: true so it doesn't overwrite if exists
}
