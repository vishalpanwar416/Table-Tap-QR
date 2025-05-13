import { auth, db } from './src/config/firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

async function createAdminUser() {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'admin@example.com',  // Change this email
      'TempPassword123!'    // Change this password
    );
    
    // Create Firestore user document
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: 'admin@example.com',
      isAdmin: true,
      createdAt: new Date()
    });
    
    console.log('✅ Admin user created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();