
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserWrapper from "./Components/User/UserWrapper/UserWrapper";
import AdminWrapper from "./Components/Admin/AdminWrapper";
import { ChatNotificationProvider } from "./Context/ChatNotificationContext";
import { GoogleOAuthProvider } from '@react-oauth/google';


function App() {
  return (
    <>
    <GoogleOAuthProvider clientId="59807333790-hna421k9o3uqru08uea8qtolhohrauq6.apps.googleusercontent.com">
      <ChatNotificationProvider>
      <Router>
        <Routes>
          <Route path="*" element={<UserWrapper/>}></Route>
          <Route path="admin/*" element={<AdminWrapper/>}></Route>
        </Routes>
      </Router>
      </ChatNotificationProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
