import React, { ReactElement, useState } from "react";
import { useOnlineCheck } from "../../utils/hooks";
import OfflineSetup from "../../Components/Games/Offline/OfflineSetup";
import { offlineOptions, onlineOptions } from "../../interfaces/app";
import { ScaleFade } from "@chakra-ui/transition";
import Hero from "../../Components/Helpers/Hero";
import OfflineGame from "../../Components/Games/Offline/Game";
import OnlineSetup from "../../Components/Games/Online/OnlineSetup";
import Blackjack from "../../Components/Games/Blackjack/BlackjackSetup";

export default function blackjack(): ReactElement {
  const { online, loading } = useOnlineCheck();
  const [settings, setSettings] = useState<offlineOptions>({
    simulations: 10,
    betAmount: 5,
    alwaysBet: true,
  });
  const [gameCode, setGameCode] = useState<string>();
  const [play, setPlay] = useState(false);
  const [simulate, setSimulate] = useState(false);
  if (!loading) {
    if (online) {
      return (
        <>
          <ScaleFade in={!play} hidden={play} initialScale={0.8}>
            <OnlineSetup setCode={setGameCode} setContinue={setPlay} />
          </ScaleFade>
          <ScaleFade in={play} hidden={!play} initialScale={0.1}>
            <Hero>{play && <Blackjack code={gameCode} />}</Hero>
          </ScaleFade>
        </>
      );
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
                  gameType="blackjack"
                  options={settings}
                  setSimulate={setSimulate}
                />
              )}
            </Hero>
          </ScaleFade>
        </>
      );
    }
  } else {
    return null;
  }
}
