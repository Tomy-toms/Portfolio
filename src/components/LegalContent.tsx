import { Fragment } from "react";

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function renderParagraph(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.trim().startsWith("- ")) {
      return null;
    }
    return (
      <Fragment key={i}>
        {renderInline(line)}
        {i < lines.length - 1 && <br />}
      </Fragment>
    );
  });
}

export function LegalParagraph({ children }: { children: string }) {
  const blocks = children.split("\n\n");

  return (
    <>
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        const lines = trimmed.split("\n");
        const bulletLines = lines.filter((l) => l.trim().startsWith("- "));

        if (bulletLines.length > 0 && bulletLines.length === lines.length) {
          return (
            <ul key={i} className="my-4 space-y-2 list-disc pl-6 text-ink-200">
              {lines.map((line, j) => (
                <li key={j}>{renderInline(line.replace(/^- /, ""))}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i} className="my-4 leading-relaxed text-ink-200">
            {renderParagraph(trimmed)}
          </p>
        );
      })}
    </>
  );
}

export function LegalSection({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="font-display text-2xl text-white sm:text-3xl">{title}</h2>
      <div className="mt-4 text-sm sm:text-base">
        <LegalParagraph>{body}</LegalParagraph>
      </div>
    </section>
  );
}
