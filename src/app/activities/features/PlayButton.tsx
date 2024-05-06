import React from "react";
import { PlayIcon } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Activity } from "../model";
import { reStartActivityAction, startActivityAction } from "../action";

export default function PlayButton(
  props: React.ComponentPropsWithoutRef<"button"> & { activity: Activity },
) {
  const { activity, ...rest } = props;

  const startActivity = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (activity.status === "stopped") {
      reStartActivityAction({ activityId: activity.id });
      return;
    }

    startActivityAction({ activityId: activity.id });
  };

  return (
    <Button {...rest} onClick={startActivity}>
      <PlayIcon />
    </Button>
  );
}
