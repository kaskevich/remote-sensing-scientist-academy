import { remoteSensingTopicById, type RemoteSensingTopicId } from "@/lib/remote-sensing-topics";
import { academyHref } from "@/lib/site-paths";

export default function RemoteSensingDomainLink({ topicId }: { topicId: RemoteSensingTopicId }) {
  const topic = remoteSensingTopicById.get(topicId);
  if (!topic) return null;

  return (
    <aside className="remote-sensing-domain-link" aria-label={`${topic.label} remote sensing domain`}>
      <span>REMOTE SENSING DOMAIN</span>
      <a href={`${academyHref("/")}#${topic.id}`}>{topic.label} <span aria-hidden="true">→</span></a>
    </aside>
  );
}
