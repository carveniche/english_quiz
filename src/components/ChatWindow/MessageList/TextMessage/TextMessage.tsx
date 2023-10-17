import clsx from "clsx";
import { Link } from "@material-ui/core";
import linkify from "linkify-it";
import { makeStyles } from "@material-ui/core/styles";
import {
  isStudentName,
  isTech,
  isTutor,
} from "../../../../utils/participantIdentity";

const useStyles = makeStyles({
  messageContainer: {
    borderRadius: "16px",
    display: "inline-flex",
    alignItems: "center",
    padding: "0.5em 0.8em 0.6em",
    margin: "0.3em 0 0",
    wordBreak: "break-word",
    // backgroundColor: "#E1E3EA",
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
  localParticipantIdentity: string;
}

function addLinks(text: string) {
  const matches = linkify().match(text);
  if (!matches) return text;

  const results = [];
  let lastIndex = 0;

  matches.forEach((match, i) => {
    results.push(text.slice(lastIndex, match.index));
    results.push(
      <Link
        style={{
          color: "blue",
        }}
        target="_blank"
        rel="noreferrer"
        href={match.url}
        key={i}
      >
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
  localParticipantIdentity,
}: TextMessageProps) {
  const classes = useStyles();

  return (
    <div
      className={`${
        localParticipantIdentity !== identity ? "flex w-full justify-end" : ""
      }`}
    >
      <div
        className={clsx(classes.messageContainer, {
          [classes.isLocalParticipant]: isLocalParticipant,
        })}
        style={{
          background: localParticipantIdentity !== identity ? "green" : "grey",
          color: "white",
        }}
      >
        <div>
          <div>
            {isTutor({ identity: identity })
              ? "Coach : "
              : isTech({ identity: identity })
              ? "Tech : "
              : isStudentName({ identity: identity }) + " : "}
          </div>
          <div>{addLinks(body)}</div>
        </div>
      </div>
    </div>
  );
}
