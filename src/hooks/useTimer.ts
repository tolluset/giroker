import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  reStartActivityAction,
  startActivityAction,
  stopActivityAction,
} from "~/app/activities/action";
import { Status } from "~/app/activities/model";

/**
 * ```ts
 * const time = useTimer({ now: 60 });
 *
 * time -> 00:01:00
 * ```
 */
export default function useTimer({
  now,
  activityStatus,
}: {
  now: number;
  activityStatus: Status;
}) {
  const [time, setTime] = useState(now / 1000);
  const [id, setId] = useState<NodeJS.Timeout>();
  const [status, setStatus] = useState<"play" | "pause">(
    activityStatus === "playing" ? "play" : "pause",
  );

  const params = useParams();
  const activityId = params["activity-id"] as string;

  useEffect(() => {
    if (activityStatus !== "playing") {
      return;
    }

    const id = setInterval(() => {
      setTime((time) => time + 1);
    }, 1000);

    setId(id);

    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  }, [activityStatus]);

  const secondsToHHMMSS = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m, s].map((v) => (v < 10 ? "0" + v : v)).join(":");
  };

  const start = () => {
    setStatus("play");

    if (activityStatus === "stopped") {
      reStartActivityAction({ activityId });
      return;
    }

    startActivityAction({ activityId });
  };

  const stop = () => {
    clearInterval(id);

    setStatus("pause");

    stopActivityAction({ activityId });
  };

  const toggleTimer = () => {
    if (status === "play") {
      stop();
      return;
    }

    if (status === "pause") {
      start();
      return;
    }
  };

  return { time: secondsToHHMMSS(time), status, toggleTimer };
}
