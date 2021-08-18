import React from 'react'
import { getFormattedTime } from './helper'

interface FormattedTimeProps {
  seconds: number
}

const FormattedTime = ({ seconds }: FormattedTimeProps) => (
  <span>{getFormattedTime(seconds)}</span>
)

export default FormattedTime
