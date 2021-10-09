import React, { ReactElement, useState } from "react";
import { useAuth } from "../../utils/hooks";
import OfflineSetup from "../../Components/Games/Offline/OfflineSetup";
import { offlineOptions } from "../../interfaces/app";
import { ScaleFade } from "@chakra-ui/transition";
import Hero from "../../Components/Helpers/Hero";
import OfflineGame from "../../Components/Games/Offline/Game";
import FullPageLoading from "../../Components/Helpers/FullPageLoading";

export default function blackjack(): ReactElement {
  const [settings, setSettings] = useState<offlineOptions>({
    simulations: 10,
    betAmount: 5,
    alwaysBet: true,
  });
  const [simulate, setSimulate] = useState(false);
  const { loading, user } = useAuth();
  if (loading) {
    return <FullPageLoading />;
  } else {
    return (
      <>
        <ScaleFade in={!simulate} hidden={simulate} initialScale={0.8}>
          <OfflineSetup setSettings={setSettings} setContinue={setSimulate} />
        </ScaleFade>
        <ScaleFade in={simulate} hidden={!simulate} initialScale={0.1}>
          <Hero>
            {simulate && (
              <OfflineGame
                gameType="twoup"
                options={settings}
                setSimulate={setSimulate}
                uid={user.userID}
                bal={user.balance}
              />
            )}
          </Hero>
        </ScaleFade>
      </>
    );
  }
}
