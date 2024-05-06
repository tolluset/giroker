"use client";

import { useOptimistic } from "react";
import AddButton from "../features/AddButton";
import DateController from "../features/DateController";
import { Activity } from "../model";
import ActivityList from "./ActivityList";
import { Button } from "~/components/ui/button";
import useTimer from "~/hooks/useTimer";

export type ControllDateCursor = "calendar" | "yesterday" | "tomorrow";

export default function ActivityListPanel({
  date,
  activities,
}: {
  date: Date;
  activities: Activity[];
}) {
  return (
    <div className="flex flex-col items-center w-full gap-y-4">
      <Button variant="outline">
        <a href="/activities">전체 보기</a>
      </Button>
      <DateController date={date} />
      <CurrentTaskTime activities={activities} />
      <hr className="text-gray-500 w-full" />
      <AddButtonAndActivityList activities={activities} />
    </div>
  );
}

function CurrentTaskTime({ activities }: { activities: Activity[] }) {
  const earliestActivity = activities.reduce((earliest, current) => {
    if (!earliest.started_at) {
      return current;
    }

    if (!current.started_at) {
      return earliest;
    }

    if (
      !earliest ||
      new Date(current?.started_at).getTime() <
        new Date(earliest.started_at).getTime()
    ) {
      return current;
    }

    return earliest;
  }, activities[0]);

  const activitiedTime = activities.reduce((time, activity) => {
    return activity.stopped_at && activity.started_at
      ? time +
          (new Date(activity.stopped_at).getTime() -
            new Date(activity.started_at!).getTime())
      : time;
  }, 0);

  const isPlaying = activities.some(
    (activity) => activity.status === "playing",
  );

  const now =
    activitiedTime +
    Date.now() -
    new Date(earliestActivity.started_at ?? 0).getTime();

  const { time } = useTimer({
    now,
    activityStatus: isPlaying ? "playing" : "idle",
  });

  return (
    <div className="text-center">
      <p className="text-gray-500 text-sm ">현재 작업 시간</p>
      <span suppressHydrationWarning className="text-2xl">
        {time}
      </span>
    </div>
  );
}

function AddButtonAndActivityList({ activities }: { activities: Activity[] }) {
  const [optimisticActivities, addOptimisticActivites] = useOptimistic(
    activities,
    (currentActivities, newActivity) => {
      return [newActivity, ...currentActivities] as Activity[];
    },
  );

  return (
    <>
      <AddButton addOptimisticActivities={addOptimisticActivites} />
      <ActivityList activities={optimisticActivities} />
    </>
  );
}
