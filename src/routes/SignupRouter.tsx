import { Routes, Route, Navigate } from "react-router-dom";

import SignupInfo from "../pages/SignupInfo";
import SignupTerms from "../pages/SignupTerms";
import SignupVerify from "../pages/SignupVerify";

export default function SignupRouter() {
  return (
    <Routes>
      <Route index element={<Navigate to="terms" replace />} />
      <Route path="terms" element={<SignupTerms />} />
      <Route path="info" element={<SignupInfo />} />
      <Route path="verify" element={<SignupVerify />} />
      <Route path="*" element={<Navigate to="terms" replace />} />
    </Routes>
  );
}
