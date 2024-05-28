import React from "react";

export default function ComponentsLoading() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-white bg-opacity-30 text-purple">
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        role="status"
      ></div>
    </div>
  );
}
