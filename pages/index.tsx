import React, { ReactElement } from "react";
import FullPageLoading from "../Components/Helpers/FullPageLoading";
import Landing from "../Components/Landing";
import { useAuth } from "../utils/hooks";

export default function Index(): ReactElement {
  const { loading, user } = useAuth();
  if (!loading) {
    return <Landing user={user} />;
  } else {
    return <FullPageLoading />;
  }
}
