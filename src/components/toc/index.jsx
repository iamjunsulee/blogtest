import React from 'react'
import './index.scss'

export const TableOfContents = ({ toc }) => {
  return (
    <div className="toc-container">
      <div
        className="toc-content"
        dangerouslySetInnerHTML={{ __html: toc }}
      />
    </div>
  )
}