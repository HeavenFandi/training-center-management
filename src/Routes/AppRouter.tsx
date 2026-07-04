import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import ScrollToTop from "../components/Common/ScrollToTop";
import Login from "../pages/Auth/Login";
import ResetPassword from "../pages/Auth/ResetPassword";
import InstituteSetup from "../pages/Auth/InstituteSetup";
import Home from "../pages/Home";
import Register from "../pages/Auth/Register";
import LandingPage from "../pages/LandingPage";
import TrainingSessions from "../pages/TrainingSessions/TrainingSessions";
import TrainingSessionDetails from "../pages/TrainingSessions/TrainingSessionDetails";
import InstituteDetails from "../pages/Institute/InstituteDetails";
import TeacherDetailsPage from "../pages/Teacher/TeacherDetailsPage";
import MainDashboard from "../pages/AdmainDashboard/MainDashboard";
import Studentmanagment from "../pages/AdmainDashboard/Studentmanagment";
import AdminOverview from "../pages/AdmainDashboard/AdminOverview";
import Teachers from "../pages/AdmainDashboard/Teachersmanagment";
import CourseManagement from "../pages/AdmainDashboard/CourseManagement";
import Attendance from "../pages/TeacherDashboard/Attendance";
import TeacherLayout from "../pages/TeacherDashboard/TeacherLayout";
import DashboardContent from "../pages/TeacherDashboard/DashboardContent";
import Schedule from "../pages/TeacherDashboard/Shedule";
import HallsManagement from "../pages/AdmainDashboard/HallsManagement";
import InstituteManagement from "../pages/AdmainDashboard/InstituteManagement";
import StudentDashboard from "../pages/StudentDasboard/StudentDashboard";
import StudentResult from "../pages/TeacherDashboard/StudentResult";
import ExamsManagement from "../pages/TeacherDashboard/ExamsManagement";
import TeacherProfile from "../pages/TeacherDashboard/TeacherProfile";
import ErrorPage from "../pages/ErrorPage";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";
import PaymentCancel from "../pages/Payment/PaymentCancel";
import ProtectedRoute from "../components/ProtectedRoute";

const Root = () => (
  <>
    <ScrollToTop />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      { path: "login", element: <Login /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "create-account", element: <Register /> },
      { 
        path: "institute-setup", 
        element: (
          <ProtectedRoute>
            <InstituteSetup />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "payment/success", 
        element: (
          <ProtectedRoute>
            <PaymentSuccess />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "payment/cancel", 
        element: (
          <ProtectedRoute>
            <PaymentCancel />
          </ProtectedRoute>
        ) 
      },
      {
        path: "admin-dashboard",
        element: (
          <ProtectedRoute>
            <MainDashboard />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminOverview /> },
          { path: "students", element: <Studentmanagment /> },
          { path: "teachers", element: <Teachers /> },
          { path: "courses-management", element: <CourseManagement /> },
          { path: "rooms", element: <HallsManagement /> },
          { path: "institute-info", element: <InstituteManagement /> },
        ],
      },
      {
        path: "teacher-dashboard",
        element: (
          <ProtectedRoute>
            <TeacherLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <DashboardContent />,
          },
          {
            path: "info",
            element: <TeacherProfile />,
          },
          {
            path: "attendance",
            element: <Attendance />,
          },
          {
            path: "schedule",
            element: <Schedule />,
          },
          {
            path: "exams",
            element: <ExamsManagement />,
          },
          {
            path: "result",
            element: <StudentResult />,
          },
        ],
      },
      {
        path: "main",
        element: <Home />,
        children: [
          { path: "", element: <LandingPage /> },
          { path: "courses", element: <TrainingSessions /> },
          {
            path: "training-session-details/:id",
            element: <TrainingSessionDetails />,
          },
          { path: "InstituteDetails", element: <InstituteDetails /> },
          {
            path: "institute/:id",
            element: <InstituteDetails />,
          },
          {
            path: "teacher-details/:id",
            element: <TeacherDetailsPage />,
          },
          {
            path: "student-dashboard",
            element: (
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
