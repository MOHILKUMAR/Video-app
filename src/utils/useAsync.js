import { useEffect, useState } from "react";

// Runs `load` whenever `deps` change and tracks loading / success / error.
const useAsync = (load, deps) => {
  const [state, setState] = useState({
    status: "loading",
    data: null,
    error: null,
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // Ignore results from a request that a newer one has replaced.
    let ignore = false;
    setState({ status: "loading", data: null, error: null });

    load().then(
      (data) => {
        if (!ignore) setState({ status: "success", data, error: null });
      },
      (error) => {
        if (!ignore) setState({ status: "error", data: null, error });
      }
    );

    return () => {
      ignore = true;
    };
  }, [...deps, attempt]);

  return { ...state, retry: () => setAttempt((n) => n + 1) };
};

export default useAsync;
