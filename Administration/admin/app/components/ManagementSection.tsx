import { AddFormPanel } from "./AddFormPanel";
import { ProjectForm } from "./ProjectForm";
import { SkillForm } from "./SkillForm";

export function ManagementSection() {
  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <AddFormPanel label="un projet">
        <ProjectForm />
      </AddFormPanel>
      <AddFormPanel label="une compétence">
        <SkillForm />
      </AddFormPanel>
    </section>
  );
}
