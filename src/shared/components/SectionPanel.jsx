import React from 'react';
export default function SectionPanel({ title, description, children }) {
  return <section className="card"><h3>{title}</h3>{description ? <div className="muted" style={{marginBottom:12}}>{description}</div> : null}{children}</section>;
}
