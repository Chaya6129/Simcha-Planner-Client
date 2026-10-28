import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Layout = () => {
    const { user, logout } = useAuth();

    return (<>
        <header>
            {user?.user.fullName}
            <Link to="/events">רשימת האירועים</Link>
            <Link to="/notifications"> {user?.unreadNotifications} הודעות</Link>
            <button onClick={logout}>התנתקות</button>
        </header>
        <main>
            <Outlet></Outlet>
        </main>
    </>
    )
}
export default Layout