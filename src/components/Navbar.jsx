import { useAuthStore } from "../store/useAuthStore.js"
import { Link } from "react-router-dom"
import { MessageSquare, Settings, User, LogOut } from "lucide-react"


const Navbar = () => {
  const { logout, authUser } = useAuthStore();


  return (
    <header className="bg-base-100 border-b border-base-300 w-full top-0 sticky z-40">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold">Chat Me</h1>
          </Link>


          <div className="flex items-center gap-2">
            <Link to="/settings" className={`btn btn-sm gap-2 transition-colors`}>
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to="/profile" className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button type="button" className="flex gap-2 items-center btn btn-sm btn-error" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar