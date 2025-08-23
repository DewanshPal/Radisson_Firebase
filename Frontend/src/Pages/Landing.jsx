import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = auth.currentUser.uid;
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          // If no profile exists, redirect to the setup page
          console.log("No such document! Redirecting to setup.");
          navigate("/profile-setup");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        // Handle error state appropriately
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // --- Icon Components ---
  const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>;
  const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
  const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
  const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;


  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    // This state can be used to show a more specific "Profile not found" message
    // or rely on the redirect logic.
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Profile Header */}
        <div className="relative h-48 bg-gradient-to-r from-cyan-500 to-blue-500">
          <div className="absolute -bottom-12 left-1/2 flex -translate-x-1/2 transform flex-col items-center">
            <img
              src={profile.photoURL || 'https://placehold.co/128x128/E0E0E0/BDBDBD?text=A'}
              alt="Profile"
              className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg sm:h-28 sm:w-28"
              onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/128x128/E0E0E0/BDBDBD?text=A'; }}
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-6 pt-16 text-center">
          <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
          <p className="mt-1 text-lg text-gray-500">{profile.designation}</p>
        </div>

        <div className="border-t border-gray-200 p-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Contact Information</h3>
            <div className="flex items-center space-x-3 text-gray-600">
              <MailIcon />
              <span>{profile.email}</span>
            </div>
            {profile.phone && (
              <div className="flex items-center space-x-3 text-gray-600">
                <PhoneIcon />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile.address && (
              <div className="flex items-center space-x-3 text-gray-600">
                <HomeIcon />
                <span>{profile.address}</span>
              </div>
            )}
          </div>

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700">Interests</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <span key={index} className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="border-t border-gray-200 bg-gray-50 p-4 text-center">
          <button 
            onClick={() => navigate('/profile-setup')}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <EditIcon/>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
