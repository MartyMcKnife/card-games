import React, { ReactElement, useState, useEffect } from "react";
import { useAuth, useManualCheck } from "../../utils/hooks";
import OfflineSetup from "../../Components/Games/Offline/OfflineSetup";
import { offlineOptions } from "../../interfaces/app";
import { ScaleFade } from "@chakra-ui/transition";
import Hero from "../../Components/Helpers/Hero";
import OfflineGame from "../../Components/Games/Offline/Game";
import FullPageLoading from "../../Components/Helpers/FullPageLoading";
import AceyDeucy from "../../Components/Games/Offline/AceyDeucy";

export default function blackjack(): ReactElement {
  const [settings, setSettings] = useState<offlineOptions>({
    simulations: 10,
    betAmount: 5,
    alwaysBet: true,
  });
  const [simulate, setSimulate] = useState(false);
  const [play, setPlay] = useState(false);
  const { loading, user } = useAuth();
  const { manual, loading: checking } = useManualCheck();
  useEffect(() => {
    if (manual) {
      setPlay(true);
      setSimulate(true);
    }
  }, [checking, manual]);
  if (loading || checking) {
    return <FullPageLoading />;
  } else {
    return (
      <>
        <ScaleFade in={!simulate} hidden={simulate} initialScale={0.8}>
          {!play && (
            <OfflineSetup setSettings={setSettings} setContinue={setSimulate} />
          )}
        </ScaleFade>
        <ScaleFade in={simulate} hidden={!simulate} initialScale={0.1}>
          <Hero>
            {play ? (
              <AceyDeucy user={user} />
            ) : (
              simulate && (
                <OfflineGame
                  gameType="aceyduecy"
                  options={settings}
                  setSimulate={setSimulate}
                  uid={user.userID}
                  bal={user.balance}
                  manual={play}
                />
              )
            )}
          </Hero>
        </ScaleFade>
      </>
    );
  }
}
