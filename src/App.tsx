import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/layouts/AppShell';
import { HomeRoute } from '@/routes/HomeRoute';
import { ScenarioListRoute } from '@/routes/ScenarioListRoute';
import { ScenarioExperienceRoute } from '@/routes/ScenarioExperienceRoute';
import { PlaygroundRoute } from '@/routes/PlaygroundRoute';
import { NotFoundRoute } from '@/routes/NotFoundRoute';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/scenarios" element={<ScenarioListRoute />} />
          <Route
            path="/scenarios/:id"
            element={<Navigate to="experience" replace />}
          />
          <Route
            path="/scenarios/:id/experience"
            element={<ScenarioExperienceRoute />}
          />
          <Route path="/features" element={<PlaygroundRoute />} />
          <Route path="*" element={<NotFoundRoute />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
