import React from "react";

const OrganizationPage = ({ params }) => {
  const { orgId } = params;
  return <div>{orgId}</div>;
};

export default OrganizationPage;
