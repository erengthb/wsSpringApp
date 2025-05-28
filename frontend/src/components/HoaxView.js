import React from 'react'

const HoaxView = (props) => {
  const { hoax } = props;
  return (
    <div>
      <div className='card p-1'>{hoax.content}</div>
    </div>
  )
}

export default HoaxView