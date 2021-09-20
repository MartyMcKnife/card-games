import React, { ReactElement, useState } from "react";
import { useOnlineCheck } from "../../utils/hooks";
import OfflineSetup from "../../Components/Games/Offline/OfflineSetup";
import { offlineOptions } from "../../interfaces/app";
import { ScaleFade } from "@chakra-ui/transition";
import Hero from "../../Components/Helpers/Hero";
import Game from "../../Components/Games/Offline/Game";

export default function blackjack(): ReactElement {
  const { online, loading } = useOnlineCheck();
  const [settings, setSettings] = useState<offlineOptions>({
    simulations: 10,
    betAmount: 5,
    alwaysBet: true,
  });
  const [simulate, setSimulate] = useState(false);
  if (!loading) {
    if (online) {
      return <p>online</p>;
    } else {
      return (
        <>
          <ScaleFade in={!simulate} hidden={simulate} initialScale={0.8}>
            <OfflineSetup setSettings={setSettings} setContinue={setSimulate} />
          </ScaleFade>
          <ScaleFade in={simulate} hidden={!simulate} initialScale={0.1}>
            <Hero>
              Cool test!
              {simulate && <Game gameType="blackjack" options={settings} />}
            </Hero>
          </ScaleFade>
        </>
      );
    }
  } else {
    return null;
  }
}
