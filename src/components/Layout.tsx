import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Layout = () => {
    const { user, logout } = useAuth();
    const unread = user?.unreadNotifications ?? 0;

    return (
        <div className="min-h-screen">
            <header className="bg-sapphire text-white">
                <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
                    <Link to="/events" className="font-display text-2xl font-bold text-gold-soft">
                        מתכנן שמחות
                    </Link>

                    <nav className="flex flex-wrap items-center gap-5 text-sm">
                        <Link to="/events" className="hover:text-gold-soft">השמחות שלי</Link>
                        <Link to="/notifications" className="flex items-center gap-1.5 hover:text-gold-soft">
                            הודעות
                            {unread > 0 && (
                                <span className="chip bg-gold text-white">{unread}</span>
                            )}
                        </Link>
                        <span className="text-white/70">{user?.user.fullName}</span>
                        <button onClick={logout} className="btn btn-sm border border-white/30 hover:bg-white/10">
                            התנתקות
                        </button>
                    </nav>
                </div>
                <div className="gold-rule" />
            </header>

            <main className="mx-auto max-w-5xl px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
