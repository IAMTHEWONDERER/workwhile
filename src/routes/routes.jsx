import { createBrowserRouter, RouterProvider } from "react-router-dom";
 import Homepage from "../pages/Homepage";
  
 const router = createBrowserRouter([
   {
     path: "/",
     element: <Homepage />,
   },
 ]);
  
 const AppRouter = () => {
   return <RouterProvider router={router} />;
 };
  
 export default AppRouter;