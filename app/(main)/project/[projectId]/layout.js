import React, { Suspense } from "react";
import { BarLoader } from "react-spinners";

const ProjectLayout = ({ children }) => {
  return (
    <Suspense fallback={<span>Loading projects.....</span>}>
      {" "}
      <div className="mx-auto">{children}</div>
    </Suspense>
  );
};

export default ProjectLayout;
