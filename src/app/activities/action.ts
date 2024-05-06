"use server";

import { revalidatePath } from "next/cache";
import {
  Activity,
  createActivity,
  updateActivity,
  startActivity,
  stopActivity,
  ActivityId,
  reStartActivity,
} from "./model";
import { repository } from "./repository";

export async function createActivityAction(activity: Activity) {
  await createActivity({ activity, repository });

  revalidatePath("/");
}

export async function updateActivityAction({
  activity,
}: {
  activity: Activity;
}) {
  await updateActivity({ activity, repository });
}

export async function startActivityAction({
  activityId,
}: {
  activityId: ActivityId;
}) {
  await startActivity({
    activityId,
    repository,
  });

  revalidatePath("/");
}

export async function reStartActivityAction({
  activityId,
}: {
  activityId: ActivityId;
}) {
  await reStartActivity({
    activityId,
    repository,
  });

  revalidatePath("/");
}

export async function stopActivityAction({
  activityId,
}: {
  activityId: ActivityId;
}) {
  await stopActivity({
    activityId,
    repository,
  });

  revalidatePath("/");
}
