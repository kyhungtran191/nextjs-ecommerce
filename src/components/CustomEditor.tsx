import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build";

function CustomEditor({ value, onChange }: { value: string; onChange: any }) {
  return (
    <CKEditor
      editor={Editor}
      data={value}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
  );
}

export default CustomEditor;
