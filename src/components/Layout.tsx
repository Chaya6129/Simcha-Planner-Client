import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { useAuth } from "../auth/AuthContext";

const navClass = ({ isActive }: { isActive: boolean }) =>
    `relative pb-1 transition-colors hover:text-gold-light ${isActive ? 'text-gold-light' : 'text-white/85'}`;

const Layout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const unread = user?.unreadNotifications ?? 0;

    return (
        <div className="relative isolate min-h-screen">
            {/* רקע: שני כתמי אור שזזים לאט מאוד, ודוגמת יהלומים עדינה */}
            <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-48 -right-40 size-[38rem] rounded-full bg-gold/15 blur-3xl animate-drift" />
                <div className="absolute -bottom-56 -left-40 size-[34rem] rounded-full bg-sapphire/10 blur-3xl animate-drift [animation-delay:-19s]" />
                <div className="ornament absolute inset-0 opacity-[0.18]" />
            </div>

            <header className="sticky top-0 z-20 bg-sapphire text-white shadow-lg shadow-sapphire/20">
                <div className="ornament absolute inset-0 opacity-30" aria-hidden />
                <div className="relative mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
                    <Link to="/events" className="font-display text-3xl text-gold-soft">
                        מתכנן שמחות
                    </Link>

                    <nav className="flex flex-wrap items-center gap-6 text-sm font-semibold">
                        <NavLink to="/events" end className={navClass}>השמחות שלי</NavLink>
                        <NavLink to="/notifications" className={navClass}>
                            <span className="flex items-center gap-1.5">
                                הודעות
                                {unread > 0 && (
                                    <span className="chip animate-pulse bg-gold text-white">{unread}</span>
                                )}
                            </span>
                        </NavLink>
                        <span className="hidden text-white/60 sm:inline">{user?.user.fullName}</span>
                        <button onClick={logout} className="btn btn-sm border border-white/25 text-white hover:bg-white/10">
                            התנתקות
                        </button>
                    </nav>
                </div>
                <div className="gold-rule relative" />
            </header>

            {/* key לפי הכתובת: בכל מעבר מסך, התוכן נכנס מחדש בתנועה עדינה */}
            <main key={location.pathname} className="mx-auto max-w-5xl px-4 py-10 animate-page-in">
                <Outlet />
            </main>

            <Toaster
                dir="rtl"
                position="top-center"
                richColors
                toastOptions={{ style: { fontFamily: 'var(--font-body)', fontSize: '15px' } }}
            />
        </div>
    );
};

export default Layout;
