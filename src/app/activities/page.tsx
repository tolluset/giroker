import BasicLayout from "~/components/ui/BasicLayout";
import { repository } from "./repository";
import { getActivitiesFull } from "./model";
import ActivityList from "./widgets/ActivityList";

export default async function ActivitiesPage() {
  const activities = await getActivitiesFull({ repository });

  return (
    <BasicLayout>
      <div>
        <ActivityList activities={activities} />
      </div>
    </BasicLayout>
  );
}
