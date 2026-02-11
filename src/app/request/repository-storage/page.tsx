"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import RepositoryList from "@/components/services/RepositoryList";
import RepositoryForm from "@/components/services/RepositoryForm";

export default function RepositoryPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <AppLayout>
      <ProtectedRoute>
        {showForm ? (
          <RepositoryForm onBack={() => setShowForm(false)} />
        ) : (
          <RepositoryList onAddNew={() => setShowForm(true)} />
        )}
      </ProtectedRoute>
    </AppLayout>
  );
}
