import React from 'react'
import { formatDate } from '../../helpers'

function IMDateTableCell(props) {
  const { date } = props
    if (!date) {
        return <div></div>
    }
    return (
        <div>
            {formatDate(date)}
        </div>
    )
}

export default IMDateTableCell