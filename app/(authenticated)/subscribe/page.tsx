import { useUser } from "@clerk/nextjs";
import React from "react";

function Subscribe() {
  const { user } = useUser();
  const firstName = user?.firstName;
  return (
    <div>
      <h1>Subscribe bro {firstName}!!</h1>
    </div>
  );
}

export default Subscribe;
