import { usePluginPrompt } from "../../context/usePluginPrompt";
import { useEffect, useRef } from "react";
import { Group } from "../Group";
import { Button } from "../Button";
import { Textarea } from "../Textarea";
import classes from "./PluginPrompt.module.css";

export default function PluginPrompt() {
  const { prompt, ok, cancel } = usePluginPrompt();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasPrompt = !!prompt;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt?.message]);

  return (
    <div className={classes.root}>
      <div
        className={[
          classes.container,
          hasPrompt ? classes.containerActive : undefined,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* Question mark icon column */}
        <div className={classes.iconColumn}>
          <div
            className={[
              classes.icon,
              hasPrompt ? classes.iconActive : undefined,
            ]
              .filter(Boolean)
              .join(" ")}
            title="Plugin Prompt"
          >
            ?
          </div>
        </div>

        {/* Message textarea column */}
        <div className={classes.textareaColumn}>
          <Textarea
            ref={textareaRef}
            readonly
            value={prompt?.message ?? ""}
            disabled={!hasPrompt}
          />
        </div>

        {/* Buttons column */}
        <div className={classes.buttonsColumn}>
          <Group gap={8} className={classes.buttonGroup}>
            <Button
              variant="subtle"
              size="small"
              onClick={cancel}
              disabled={!hasPrompt}
              className={hasPrompt ? undefined : classes.buttonHidden}
            >
              {prompt?.cancelLabel ?? "Cancel"}
            </Button>
            <Button
              variant="filled"
              size="small"
              onClick={ok}
              disabled={!hasPrompt}
              className={hasPrompt ? undefined : classes.buttonHidden}
            >
              {prompt?.okLabel ?? "OK"}
            </Button>
          </Group>
        </div>
      </div>
    </div>
  );
}
