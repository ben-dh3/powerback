import React, { Dispatch, SetStateAction } from 'react';
import './style.css';

type Props = {
  clear: Dispatch<SetStateAction<object>>;
  setQuery: Dispatch<SetStateAction<object>>;
  query: string;
  children: any;
};

const Search = ({ clear, setQuery, query, children, ...props }: Props) => {
  return <div {...props}>{children}</div>;
};

export default React.memo(Search);
