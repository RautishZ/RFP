import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Vendors from "./pages/Vendors";
import RFP from "./pages/RFP";
import AddRFP from "./pages/AddRFP";
import RFPQuotes from "./pages/RFPQuotes";

// Components
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Constants
import { ROUTES, USER_ROLES } from "./constants";

function App() {
  return (
    <>
      <Routes>
        <Route path={ROUTES.HOME} element={<Login />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.VENDORS}
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <Vendors />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.RFP}
          element={
            <ProtectedRoute>
              <RFP />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADD_RFP}
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <AddRFP />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.RFP_QUOTES}
          element={
            <ProtectedRoute>
              <RFPQuotes />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
