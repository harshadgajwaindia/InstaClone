import { Suspense } from "react";
import ConnectionsPage from "./ConnectionsClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading connections...</div>}>
      <ConnectionsPage />
    </Suspense>
  );
}
