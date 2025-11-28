// "use client";
// import React, { useState } from "react";
// import { FaArrowLeft, FaCamera, FaEdit } from "react-icons/fa";
// import Button from "@/app/components/Button";

// const ProfileEditModal = () => {
//   const [photo, setPhoto] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "rgn",
//     phone: "+91 9290909909",
//     email: "user@example.com",
//     gender: "",
//     birthday: "",
//     anniversary: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Updated Profile:", formData);
//     setIsModalOpen(false);
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setPhoto(URL.createObjectURL(file));
//     }
//   };

//   return (
//     <div className="text-white">
//       {/* Profile Info */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center space-x-4">
//           <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
//             <span className="text-2xl">👤</span>
//           </div>
//           <div>
//             <p className="font-semibold">{formData.name}</p>
//             <p className="text-gray-400 text-sm">{formData.phone}</p>
//           </div>
//         </div>

//         {/* Edit Icon */}
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="text-gray-400 hover:text-white"
//         >
//           <FaEdit size={20} />
//         </button>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#13162f] bg-opacity-70">
//           <div className="w-full max-w-lg mx-4 rounded-2xl shadow-lg p-6 overflow-y-auto max-h-[90vh] no-scrollbar border border-dotted bg-[#13162f]">
//             {/* Header */}
//             <div className="flex items-center space-x-4 mb-6 cursor-pointer">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-2xl hover:text-gray-300"
//               >
//                 <FaArrowLeft />
//               </button>
//               <h1 className="text-xl font-semibold">Edit Profile</h1>
//             </div>

//             {/* Profile Image */}
//             <div className="flex flex-col items-center mb-6">
//               <div className="relative">
//                 <div className="w-28 h-28 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
//                   {photo ? (
//                     <img
//                       src={photo}
//                       alt="Profile"
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <span className="text-5xl">👤</span>
//                   )}
//                 </div>

//                 <label
//                   htmlFor="photo-upload"
//                   className="absolute bottom-2 right-2 bg-gray-800 p-2 rounded-full hover:bg-gray-700 cursor-pointer"
//                 >
//                   <FaCamera size={14} />
//                 </label>
//                 <input
//                   id="photo-upload"
//                   type="file"
//                   accept="image/*"
//                   onChange={handlePhotoChange}
//                   className="hidden"
//                 />
//               </div>
//             </div>

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="space-y-5">
//               <h2 className="text-gray-300 font-medium">Basic information</h2>

//               {/* Name */}
//               <div>
//                 <label className="block text-sm text-gray-400 mb-1">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white focus:outline-none"
//                 />
//               </div>

//               {/* Phone (disabled) */}
//               <div>
//                 <label className="block text-sm text-gray-400 mb-1">
//                   Phone number
//                 </label>
//                 <input
//                   type="text"
//                   name="phone"
//                   value={formData.phone}
//                   disabled
//                   className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-gray-400 cursor-not-allowed"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   The phone number associated with your account cannot be modified
//                 </p>
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block text-sm text-gray-400 mb-1">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Enter your email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white focus:outline-none"
//                 />
//               </div>

//               {/* Gender */}
//               <div>
//                 <label className="block text-sm text-gray-400 mb-1">Gender</label>
//                 <select
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white focus:outline-none"
//                 >
//                   <option value="">Select</option>
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>

//               {/* Submit */}
//               <div>
//                 <Button type="submit">Update Profile</Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfileEditModal;
"use client";
import React from "react";
import { FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const router = useRouter();

  const handleEditClick = () => {
    router.push("/profile-settings/editProfile?modal=true"); // navigate to edit page
  };

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <p className="font-semibold">rgn</p>
            <p className="text-gray-400 text-sm">+91 9290909909</p>
          </div>
        </div>

        <button
          onClick={handleEditClick}
          className="text-gray-400 hover:text-white"
        >
          <FaEdit size={20} />
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
