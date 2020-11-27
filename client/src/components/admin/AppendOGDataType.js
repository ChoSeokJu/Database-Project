import React from 'react';
import { useParams } from 'react-router-dom';

export default function AppendOGDataType(props) {
  const { taskName } = useParams();
  return <p>{taskName}</p>;
}
