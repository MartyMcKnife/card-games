import React, { ReactElement } from "react";

import { useAuth } from "../../../utils/hooks";
import FullPageLoading from "../../Helpers/FullPageLoading";
import Blackjack from "./Blackjack";

interface Props {
  code: string;
}

export default function BlackjackSetup({ code }: Props): ReactElement {
  const { loading, user } = useAuth();
  if (loading) {
    return <FullPageLoading />;
  } else {
    return <Blackjack code={code} user={user} />;
  }
}
