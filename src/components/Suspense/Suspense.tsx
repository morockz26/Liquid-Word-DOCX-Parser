import React, { ReactNode, Suspense as ReactSuspense } from "react";
import "./Suspense.scss";

interface SuspenseProps {
  children: ReactNode;
}

export const Suspense: React.FC<SuspenseProps> = ({ children }) => (
  <ReactSuspense
    fallback={
      <div className="Suspense">
        <p>Loading...</p>
      </div>
    }
  >
    {children}
  </ReactSuspense>
);

export default Suspense;
