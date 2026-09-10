import { AddFormPanel } from "./AddFormPanel";
import { NotificationsPanel } from "./NotificationsPanel";
import { ProjectForm } from "./ProjectForm";
import { SkillForm } from "./SkillForm";

export function ManagementSection() {
  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <AddFormPanel label="un projet">
        <ProjectForm />
      </AddFormPanel>
      <div className="space-y-6">
        <AddFormPanel label="une compétence">
          <SkillForm />
        </AddFormPanel>
        <NotificationsPanel />
      </div>
    </section>
  );
}
