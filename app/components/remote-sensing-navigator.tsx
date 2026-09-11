"use client";

import { useEffect, useMemo, useState } from "react";
import {
  remoteSensingTopics,
  sensorChoiceScenarios,
  type AcademyTopicLink,
  type RemoteSensingTopicId,
} from "@/lib/remote-sensing-topics";
import { academyHref } from "@/lib/site-paths";

const topicIds = new Set<RemoteSensingTopicId>(remoteSensingTopics.map((topic) => topic.id));

function isTopicId(value: string): value is RemoteSensingTopicId {
  return topicIds.has(value as RemoteSensingTopicId);
}

function TopicLinks({ links }: { links: AcademyTopicLink[] }) {
  return (
    <ul>
      {links.map((link) => (
        <li key={`${link.href}-${link.title}`}>
          <a href={academyHref(link.href)}>
            <strong>{link.title}</strong>
            {link.context && <span>{link.context}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function RemoteSensingNavigator() {
  const [selectedId, setSelectedId] = useState<RemoteSensingTopicId>("optical");
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [choice, setChoice] = useState<RemoteSensingTopicId | "">("");
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const chooseFromHash = () => {
      const hash = window.location.hash.slice(1);
      if (isTopicId(hash)) {
        setSelectedId(hash);
        window.requestAnimationFrame(() => {
          document.getElementById(hash)?.scrollIntoView({ block: "start" });
        });
      }
    };
    chooseFromHash();
    window.addEventListener("hashchange", chooseFromHash);
    return () => window.removeEventListener("hashchange", chooseFromHash);
  }, []);

  const scenario = sensorChoiceScenarios[scenarioIndex];
  const bestTopic = useMemo(
    () => remoteSensingTopics.find((topic) => topic.id === scenario.best),
    [scenario.best],
  );

  function selectTopic(id: RemoteSensingTopicId) {
    setSelectedId(id);
    window.history.replaceState(null, "", `#${id}`);
  }

  function nextScenario() {
    setScenarioIndex((current) => (current + 1) % sensorChoiceScenarios.length);
    setChoice("");
    setRevealed(false);
  }

  return (
    <section className="remote-sensing-navigator" aria-labelledby="remote-sensing-navigator-title">
      <div className="remote-sensing-navigator-heading">
        <div>
          <p className="section-kicker">REMOTE SENSING DOMAINS</p>
          <h2 id="remote-sensing-navigator-title">Choose a measurement, then follow the evidence</h2>
        </div>
        <p>
          Each technology observes something different. Select a domain to compare its physical signal,
          products, scientific limits and exact path through the Academy.
        </p>
      </div>

      <div className="signal-strip signal-strip-interactive" role="group" aria-label="Remote sensing topics">
        {remoteSensingTopics.map((topic) => {
          const selected = topic.id === selectedId;
          return (
            <button
              key={topic.id}
              type="button"
              className={selected ? "is-selected" : undefined}
              aria-expanded={selected}
              aria-controls={topic.id}
              onClick={() => selectTopic(topic.id)}
            >
              {topic.shortLabel}
            </button>
          );
        })}
      </div>

      <div className="remote-sensing-topic-panels">
        {remoteSensingTopics.map((topic) => (
          <article
            className="remote-sensing-topic-panel"
            id={topic.id}
            key={topic.id}
            hidden={topic.id !== selectedId}
            aria-labelledby={`${topic.id}-title`}
          >
            <header>
              <div>
                <p className="topic-panel-label">SELECTED DOMAIN</p>
                <h3 id={`${topic.id}-title`}>{topic.label}</h3>
              </div>
              <div className="topic-statuses" aria-label={`${topic.label} Academy coverage`}>
                {topic.status.map((status) => <span key={status}>{status}</span>)}
              </div>
            </header>

            <div className="topic-facts-grid">
              <section>
                <h4>What it is</h4>
                <p>{topic.definition}</p>
              </section>
              <section>
                <h4>What the sensor measures</h4>
                <p>{topic.measurement}</p>
              </section>
              <section>
                <h4>Common data</h4>
                <ul>{topic.commonData.map((item) => <li key={item}>{item}</li>)}</ul>
              </section>
              <section>
                <h4>What it is good for</h4>
                <ul>{topic.applications.map((item) => <li key={item}>{item}</li>)}</ul>
              </section>
              <section className="topic-limitations">
                <h4>Important limitation</h4>
                <ul>{topic.limitations.map((item) => <li key={item}>{item}</li>)}</ul>
                {topic.distinctions?.map((item) => <p className="topic-boundary" key={item}>{item}</p>)}
              </section>
            </div>

            <section className="topic-learning-path" aria-labelledby={`${topic.id}-learning-title`}>
              <h4 id={`${topic.id}-learning-title`}>Learn this in the Academy</h4>
              <div>
                <section>
                  <p>START HERE · FOUNDATION LESSONS</p>
                  <TopicLinks links={topic.links.start} />
                </section>
                <section>
                  <p>GO DEEPER · ADVANCED LESSONS</p>
                  {topic.links.deeper.length > 0 ? <TopicLinks links={topic.links.deeper} /> : <span className="topic-gap">No standalone advanced lesson yet.</span>}
                </section>
                <section>
                  <p>TRY IT · FIELD LABS / PROJECTS</p>
                  {topic.links.practice.length > 0 ? <TopicLinks links={topic.links.practice} /> : <span className="topic-gap">{topic.practiceGap}</span>}
                </section>
              </div>
            </section>
          </article>
        ))}
      </div>

      <details className="remote-sensing-comparison">
        <summary>Compare the technologies <span aria-hidden="true">+</span></summary>
        <div className="remote-sensing-table-wrap">
          <table>
            <caption>Measurement families and their main evidence strengths</caption>
            <thead><tr><th>Domain</th><th>Mode</th><th>Measures</th><th>Resolution emphasis</th><th>Main strength</th></tr></thead>
            <tbody>
              <tr><th>Optical</th><td>Passive</td><td>Reflected solar radiation</td><td>Spectral + spatial</td><td>Intuitive multispectral vegetation information</td></tr>
              <tr><th>SAR</th><td>Active</td><td>Microwave backscatter</td><td>Spatial + polarisation</td><td>Cloud-independent observation</td></tr>
              <tr><th>LiDAR</th><td>Active</td><td>Laser range and returns</td><td>3D structural</td><td>Vertical structure</td></tr>
              <tr><th>Thermal</th><td>Passive</td><td>Emitted thermal infrared</td><td>Thermal + spatial</td><td>Surface-temperature patterns</td></tr>
              <tr><th>Hyperspectral</th><td>Passive</td><td>Dense narrow-band spectra</td><td>Spectral</td><td>Fine spectral discrimination</td></tr>
              <tr><th>Spatial Analysis</th><td>Analysis</td><td>Relationships between data</td><td>Multi-scale</td><td>Turns EO data into spatial evidence</td></tr>
            </tbody>
          </table>
        </div>
        <p className="comparison-note">Resolution is not one fixed number: spectral, spatial, temporal, radiometric and structural detail answer different questions.</p>
      </details>

      <section className="sensor-choice-exercise" aria-labelledby="sensor-choice-title">
        <header>
          <p className="section-kicker">MINI EXERCISE · {scenarioIndex + 1}/{sensorChoiceScenarios.length}</p>
          <h3 id="sensor-choice-title">Which sensor would you choose?</h3>
        </header>
        <p className="sensor-choice-prompt">{scenario.prompt}</p>
        <fieldset>
          <legend>Select the strongest starting point</legend>
          <div className="sensor-choice-options">
            {remoteSensingTopics.map((topic) => (
              <label key={topic.id} className={choice === topic.id ? "is-selected" : undefined}>
                <input
                  type="radio"
                  name="sensor-choice"
                  value={topic.id}
                  checked={choice === topic.id}
                  onChange={() => { setChoice(topic.id); setRevealed(false); }}
                />
                {topic.label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="sensor-choice-actions">
          <button type="button" onClick={() => setRevealed(true)} disabled={!choice}>Check my reasoning</button>
          <button type="button" className="sensor-choice-next" onClick={nextScenario}>Next scenario</button>
        </div>
        {revealed && (
          <div className="sensor-choice-feedback" role="status" aria-live="polite">
            <p className={choice === scenario.best ? "is-correct" : "is-review"}>
              {choice === scenario.best ? "Strong choice." : "Reconsider the primary measurement."} Best starting point: <strong>{bestTopic?.label}</strong>
            </p>
            <dl>
              <div><dt>Why</dt><dd>{scenario.why}</dd></div>
              <div><dt>Possible alternatives</dt><dd>{scenario.alternatives}</dd></div>
              <div><dt>Limitation</dt><dd>{scenario.limitation}</dd></div>
            </dl>
          </div>
        )}
      </section>
    </section>
  );
}
