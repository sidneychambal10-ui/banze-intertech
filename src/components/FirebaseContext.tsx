import React, { createContext, useContext, useEffect, useState } from "react";
import { User as AuthUser, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider, handleFirestoreError, OperationType } from "@/lib/firebase";

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: "user" | "admin";
  createdAt: unknown;
  updatedAt: unknown;
}

interface FirebaseContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfileData: (displayName: string, photoURL: string) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export async function logSystemActivity(
  userId: string,
  email: string,
  displayName: string,
  photoURL: string,
  type: "cadastro" | "login" | "update_perfil",
  description: string,
) {
  try {
    const actRef = doc(collection(db, "systemActivities"));
    await setDoc(actRef, {
      id: actRef.id,
      userId,
      userEmail: email,
      displayName,
      photoURL,
      type,
      description,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Erro ao registrar atividade:", error);
  }
}

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await syncUserProfile(result.user);
        // Log login action
        await logSystemActivity(
          result.user.uid,
          result.user.email || "",
          result.user.displayName || "Usuário Banze",
          result.user.photoURL || "",
          "login",
          `${result.user.displayName || "Usuário Banze"} iniciou sessão via Google.`,
        );
      }
    } catch (error) {
      console.error("Erro no login com Google: ", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setProfile(null);
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout: ", error);
      throw error;
    }
  };

  const updateProfileData = async (newDisplayName: string, newPhotoURL: string) => {
    if (!user || !profile) return;
    const userRef = doc(db, "users", user.uid);
    try {
      const updatedProfile: UserProfile = {
        userId: profile.userId,
        email: profile.email,
        displayName: newDisplayName,
        photoURL: newPhotoURL,
        role: profile.role,
        createdAt: profile.createdAt,
        updatedAt: serverTimestamp(),
      };
      await setDoc(userRef, updatedProfile);
      setProfile(updatedProfile);

      // Log profile update action
      await logSystemActivity(
        user.uid,
        user.email || "",
        newDisplayName,
        newPhotoURL,
        "update_perfil",
        `${profile.displayName} actualizou o nome/foto do perfil.`,
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const syncUserProfile = async (authUser: AuthUser) => {
    if (!authUser.email) return;
    const userRef = doc(db, "users", authUser.uid);
    try {
      const docSnap = await getDoc(userRef);
      const isSystemAdmin = authUser.email.toLowerCase() === "sidneychambal10@gmail.com";

      const userRole = isSystemAdmin ? "admin" : "user";

      if (docSnap.exists()) {
        const existingData = docSnap.data() as UserProfile;
        // Update user if info has changed
        if (
          existingData.displayName !== authUser.displayName ||
          existingData.photoURL !== authUser.photoURL ||
          existingData.role !== userRole
        ) {
          const updatedProfile: UserProfile = {
            userId: authUser.uid,
            email: authUser.email,
            displayName: authUser.displayName || "Usuário Banze",
            photoURL: authUser.photoURL || "",
            role: userRole,
            createdAt: existingData.createdAt,
            updatedAt: serverTimestamp(),
          };
          await setDoc(userRef, updatedProfile);
          setProfile(updatedProfile);
        } else {
          setProfile(existingData);
        }
      } else {
        // Create new user record
        const newProfile: UserProfile = {
          userId: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName || "Usuário Banze",
          photoURL: authUser.photoURL || "",
          role: userRole,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(userRef, newProfile);
        setProfile(newProfile);

        // Log registration
        await logSystemActivity(
          authUser.uid,
          authUser.email,
          newProfile.displayName,
          newProfile.photoURL,
          "cadastro",
          `${newProfile.displayName} criou uma nova conta no ecossistema Banze.`,
        );
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${authUser.uid}`);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      if (authUser) {
        await syncUserProfile(authUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = profile?.role === "admin";

  return (
    <FirebaseContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        loginWithGoogle,
        logout,
        updateProfileData,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase deve ser usado dentro de um FirebaseProvider");
  }
  return context;
}
