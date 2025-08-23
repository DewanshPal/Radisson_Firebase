import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

export default function ProfileSetup() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    photoURL: "",
    designation: "",
    phone: "",
    address: "",
    interests: [],
    email: "",
  });

  const [interestInput, setInterestInput] = useState("");

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setFormData(prev => ({ ...prev, email: currentUser.email || "" }));
      } else {
        // Redirect to login if not authenticated
        navigate("/login");
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterestKeyDown = (e) => {
    if (e.key === 'Enter' && interestInput.trim() !== "") {
      e.preventDefault();
      if (formData.interests.length < 5 && !formData.interests.includes(interestInput.trim())) {
        setFormData(prev => ({ ...prev, interests: [...prev.interests, interestInput.trim()] }));
      }
      setInterestInput("");
    }
  };
  
  const removeInterest = (interestToRemove) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSave = async (e) => {
    e.preventDefault();
    if (isLoading || !user) return;
    setIsLoading(true);
    
    try {
      const userId = user.uid;
      
      // Debug: Log authentication info
      console.log("Current user:", auth.currentUser);
      console.log("User ID:", userId);
      console.log("User email:", user.email);
      
      // Check if user is still authenticated
      if (!auth.currentUser) {
        throw new Error("User not authenticated");
      }
      
      // We are creating a new object to send to Firestore
      // to avoid sending the temporary interestInput state.
      const profileData = {
        name: formData.name,
        photoURL: formData.photoURL,
        designation: formData.designation,
        phone: formData.phone,
        address: formData.address,
        interests: formData.interests,
        email: formData.email,
        uid: userId, // Add uid for security rules
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      console.log("Attempting to save profile data:", profileData);
      console.log("Document path:", `users/${userId}`);
      
      await setDoc(doc(db, "users", userId), profileData);
      // Show a success message before navigating
      console.log("Profile saved successfully!");
      alert("Profile saved successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      // You can set an error state here to show a message to the user
      if (error.code === 'permission-denied') {
        alert("Permission denied. Please check your Firestore security rules. Make sure you're authenticated and the rules allow writes to /users/{userId}");
      } else if (error.message === "User not authenticated") {
        alert("Please log in again and try saving your profile.");
        navigate("/login");
      } else {
        alert(`An error occurred while saving your profile: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = ((step - 1) / 2) * 100;

  // --- Icon Components ---
  const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
  const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg>;
  const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
  const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
  const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
  const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 font-sans">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="mb-2 text-center text-3xl font-bold text-gray-800">
          Complete Your Profile
        </h2>
        <p className="mb-6 text-center text-gray-500">
          Tell us a bit more about yourself.
        </p>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="relative h-2 rounded-full bg-gray-200">
            <div
              className="absolute h-2 rounded-full bg-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span>Basic Info</span>
            <span>Contact</span>
            <span>Interests</span>
          </div>
        </div>

        <form onSubmit={handleSave}>
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="text-lg font-semibold text-gray-700">Step 1: Basic Information</h3>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><UserIcon/></div>
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" required />
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><LinkIcon/></div>
                <input type="text" name="photoURL" placeholder="Photo URL" value={formData.photoURL} onChange={handleChange} className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><BriefcaseIcon/></div>
                <input type="text" name="designation" placeholder="Designation (e.g., Software Engineer)" value={formData.designation} onChange={handleChange} className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              </div>
            </div>
          )}

          {/* Step 2: Contact Details */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="text-lg font-semibold text-gray-700">Step 2: Contact Details</h3>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><PhoneIcon/></div>
                <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><HomeIcon/></div>
                <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              </div>
            </div>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="text-lg font-semibold text-gray-700">Step 3: Personal Interests</h3>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><HeartIcon/></div>
                <input type="text" name="interests" placeholder="Type an interest and press Enter" value={interestInput} onChange={(e) => setInterestInput(e.target.value)} onKeyDown={handleInterestKeyDown} className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.interests.map((interest, index) => (
                  <span key={index} className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    {interest}
                    <button type="button" onClick={() => removeInterest(interest)} className="text-blue-600 hover:text-blue-800">&times;</button>
                  </span>
                ))}
              </div>
               <p className="text-xs text-gray-500">You can add up to 5 interests.</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="rounded-lg bg-gray-200 px-6 py-2 font-semibold text-gray-700 transition hover:bg-gray-300">
                Back
              </button>
            ) : <div></div>}
            
            {step < 3 ? (
              <button type="button" onClick={nextStep} className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700">
                Next
              </button>
            ) : (
              <button type="submit" disabled={isLoading} className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400">
                {isLoading ? 'Saving...' : 'Save Profile'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}