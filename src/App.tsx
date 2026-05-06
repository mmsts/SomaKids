import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { HomeView } from './pages/HomeView';
import { BodyCheckFlow } from './pages/BodyCheckFlow';
import type { ChildProfile } from './types';

export default function App() {
  const [childProfile, setChildProfile] = useState<ChildProfile>({
    name: '小星星',
    gender: 'girl',
    age: 7,
    medicalHistory: ['花粉过敏', '轻度哮喘'],
  });

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomeView
            childProfile={childProfile}
            onUpdateProfile={setChildProfile}
          />
        }
      />
      <Route path="/body-check" element={<BodyCheckFlow />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
