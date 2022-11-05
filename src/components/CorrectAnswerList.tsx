import React from 'react'
import styles from './CorrectAnswerList.module.css'

interface Props {
  correctAnswerList: string[]
}

const CorrectAnswerList = ({ correctAnswerList }: Props) => {
  return (
    <ul className={`correct-answer-list ${styles.correctAnswerList}`}>
      {correctAnswerList.map((answer) => (
        <li className={styles.answer}>
          {answer}{' '}
          <span className='correct-color-block' style={{ backgroundColor: answer }} />
        </li>
      ))}
    </ul>
  )
}

export default CorrectAnswerList
