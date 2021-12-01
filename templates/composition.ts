import { useState } from "#app";

type BACKEND_STATE = "NONE";

type ReturnType<T = any> = {
  data: T;
  state: BACKEND_STATE;
};

const STATE_PREFIX = "BACKEND_STATE_";

function getStateName(name: string) {
  return STATE_PREFIX + name;
}

export function useBackendState(name: string): ReturnType {
  const state = useState(getStateName(name));
  return {
    data: state,
    state: "NONE",
  };
}
