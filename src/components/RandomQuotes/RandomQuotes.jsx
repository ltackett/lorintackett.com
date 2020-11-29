import React from 'react'

// import { AGhostMadeFromStardust } from './AGhostMadeFromStardust'
import { DontJust } from './DontJust'

// Put components into array, to be called later
const quotes = [
  DontJust,
  // AGhostMadeFromStardust
]

export const RandomQuotes = () => {
  // Get rando from the length of quote components in the array
  const rando = Math.round((quotes.length-1)*Math.random())

  // Assign component to JSX compatible var using rando
  const Quote = quotes[rando]
  return (
    <>
      <Quote />
    </>
  )
}

