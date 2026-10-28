import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
            <h1 className="text-6xl font-black">404</h1>
            <p className="text-lg text-mist">הדף שחיפשת לא קיים.</p>
            <Link to="/events" className="btn btn-primary">חזרה לשמחות שלי</Link>
        </div>
    );
};

export default NotFoundPage;
