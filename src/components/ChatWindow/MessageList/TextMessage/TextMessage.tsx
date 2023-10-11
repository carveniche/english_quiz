import clsx from "clsx";
import { Link } from "@material-ui/core";
import linkify from "linkify-it";
import { makeStyles } from "@material-ui/core/styles";
import {
  isStudentName,
  isTutorTechBoth,
} from "../../../../utils/participantIdentity";

const useStyles = makeStyles({
  messageContainer: {
    borderRadius: "16px",
    display: "inline-flex",
    alignItems: "center",
    padding: "0.5em 0.8em 0.6em",
    margin: "0.3em 0 0",
    wordBreak: "break-word",
    backgroundColor: "#E1E3EA",
    hyphens: "auto",
    whiteSpace: "pre-wrap",
  },
  isLocalParticipant: {
    backgroundColor: "#CCE4FF",
  },
});

interface TextMessageProps {
  body: string;
  identity: string;
  isLocalParticipant: boolean;
}

function addLinks(text: string) {
  const matches = linkify().match(text);
  if (!matches) return text;

  const results = [];
  let lastIndex = 0;

  matches.forEach((match, i) => {
    results.push(text.slice(lastIndex, match.index));
    results.push(
      <Link target="_blank" rel="noreferrer" href={match.url} key={i}>
        {match.text}
      </Link>
    );
    lastIndex = match.lastIndex;
  });

  results.push(text.slice(lastIndex, text.length));

  return results;
}

export default function TextMessage({
  body,
  isLocalParticipant,
  identity,
}: TextMessageProps) {
  const classes = useStyles();

  return (
    <div>
      <div
        className={clsx(classes.messageContainer, {
          [classes.isLocalParticipant]: isLocalParticipant,
        })}
      >
        <div>
          <div>
            {isTutorTechBoth({ identity: identity })
              ? identity.charAt(0).toUpperCase() + identity.slice(1)
              : isStudentName({ identity: identity })}
          </div>
          <div>{addLinks(body)}</div>
        </div>
      </div>
    </div>
  );
}
