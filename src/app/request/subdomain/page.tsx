"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SubdomainList from "@/components/services/SubdomainList";
import SubdomainForm from "@/components/services/SubdomainForm";

export default function SubdomainPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <AppLayout>
      <ProtectedRoute>
        {showForm ? (
          <SubdomainForm onBack={() => setShowForm(false)} />
        ) : (
          <SubdomainList onAddNew={() => setShowForm(true)} />
        )}
      </ProtectedRoute>
    </AppLayout>
  );
}
