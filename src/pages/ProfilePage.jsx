import { useAuthStore } from "../store/useAuthStore.js"
import blankUser from "../assets/img/blank_user.webp"
import { Camera, User, Mail, ShieldCheck } from "lucide-react"
import { useState } from "react"


const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore()
  const [selectedImage, setSelectedImage] = useState(null)

  const handleImageUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image)
      await updateProfile({ picture: base64Image })
    }
  }
  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Informasi Profil Anda</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img src={selectedImage || authUser.picture || blankUser} alt="profile image" className="size-32 rounded-full object-cover border-4" />
              <label htmlFor="picture"
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input type="file" id="picture" name="picture" className="hidden" accept="image/*" onChange={handleImageUpdate} disabled={isUpdatingProfile} />
              </label>
            </div>
            <p className="text-sm text-zinc-400 text-center">
              {isUpdatingProfile ? "Uploading..." : "Klik pada ikon kamera untuk merubah foto anda"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Nama Lengkap
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border border-zinc-700">{authUser?.fullName}</p>
            </div>
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Alamat Email
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border border-zinc-700 overflow-hidden">{authUser?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Informasi Akun</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Bergabung Sejak</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Status Akun</span>
                <span className="flex items-center gap-2 text-green-500"><ShieldCheck className="h-4 w-4" />Aktif</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage