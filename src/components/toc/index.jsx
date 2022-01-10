import React from 'react'
import './index.scss'

export const TableOfContents = ({ toc }) => {
  return (
    <div
      className="toc"
      dangerouslySetInnerHTML={{ __html: toc }}
    />
  )
}