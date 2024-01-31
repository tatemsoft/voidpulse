import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Input } from "./Input";

interface EditableTextFieldProps {
  text: string;
  onTextChange: (text: string) => void;
}

export const EditableTextField: React.FC<EditableTextFieldProps> = ({
  text: startingText,
  onTextChange,
}) => {
  const startingTextRef = useRef(startingText);
  startingTextRef.current = startingText;

  const refOnTextChange = useRef(onTextChange);
  refOnTextChange.current = onTextChange;

  const [text, setText] = useState(startingText);
  const textRef = useRef(text);
  textRef.current = text;
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Happens when you click outside the input
  useEffect(() => {
    const handleOutsideClick = (e: any) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setIsEditingTitle(false);
        if (textRef.current.trim()) {
          refOnTextChange.current?.(textRef.current);
        } else {
          setText(startingTextRef.current || "Untitled");
        }
      }
    };
    //Checks if you are outside the input once your mouse moves
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Adjust the width based on the length of the input
  const inputStyle = {
    width: `${Math.min(20, Math.max(10, text.length))}ch`,
  };

  return isEditingTitle ? (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setIsEditingTitle(false);
        if (text.trim()) {
          onTextChange(text);
        } else {
          setText(startingText || "Untitled");
        }
      }}
    >
      <Input
        ref={inputRef}
        value={text}
        autoFocus
        style={inputStyle}
        onChange={(e) => {
          setText(e.target.value);
        }}
        className="-mt-1"
      />
    </form>
  ) : (
    <div
      className="hoverable area rounded-lg px-1"
      onClick={() => {
        setIsEditingTitle(true);
      }}
    >
      {text}
    </div>
  );
};