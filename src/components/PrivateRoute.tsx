import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PrivateRouteProps {
    element: React.ReactElement;
    redirectTo: string;
    isReverse?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, redirectTo, isReverse = false }) => {
    const { isLoggedIn } = useAuth();

    if (isReverse) {
        return !isLoggedIn ? element : <Navigate to={redirectTo} />;
    }

    return isLoggedIn ? element : <Navigate to={redirectTo} />;
}

export default PrivateRoute;