import React, { useReducer, useEffect, useState } from "react";
import ld from "../lodash";
const defaultOpts = {};
export const useFetch = (input, opts = defaultOpts) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const { readBody = body => body.json(), ...init } = opts;
    useEffect(
      () => {
        (async () => {
          setLoading(true);
          try {
            const response = await fetch(input, init);
            if (response.ok) {
              const body = await readBody(response);
              setData(body);
            } else {
              setError(new Error(response.statusText));
            }
          } catch (e) {
            setError(e);
          }
          setLoading(false);
        })();
      },
      [input, opts]
    );
    return { error, loading, data };
  },
  makeSortComparator = ({ asc, sortKey }) => values => values.sort((a, b) => (asc ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey])),
  useSort = (someArray, sortKey, asc = false) => {
    const [state, setState] = useState({ asc, sortKey }),
      comparator = makeSortComparator(state),
      sortedData = someArray.slice().sort(comparator);
    return {
      ...state,
      sortedData,
      toggleSortAsc: () => setState(state => ({ ...state, asc: !state.asc })),
      setSortKey: sortKey => setState(state => ({ ...state, sortKey }))
    };
  };
