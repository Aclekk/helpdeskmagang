"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import RepositoryGitList from "@/components/services/RepositoryGitList";
import RepositoryGitForm from "@/components/services/RepositoryGitForm";

export default function RepositoryGitPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <AppLayout>
      <ProtectedRoute>
        {showForm ? (
          <RepositoryGitForm onBack={() => setShowForm(false)} />
        ) : (
          <RepositoryGitList onAddNew={() => setShowForm(true)} onBack={() => window.history.back()} />
        )}
      </ProtectedRoute>
    </AppLayout>
  );
}
