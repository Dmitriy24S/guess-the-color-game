import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [color, setColor] = useState<string>('')
  const [options, setOptions] = useState<string[]>([])
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [score, setScore] = useState(0)
  const [result, setResult] = useState<JSX.Element | undefined>()

  const scoreRef = useRef<HTMLParagraphElement>(null)
  // const answerOptionsRef = useRef<HTMLDivElement>(null)
  const answerOptionsRef = useRef<HTMLFormElement>(null)

  const resetGame = () => {
    setGameColors()
    setScore(0)
    setResult(undefined)
    setUserAnswer('')
  }

  const getRandomColor = () => '#' + Math.floor(Math.random() * 16_777_215).toString(16)

  const setGameColors = () => {
    // Set question color:
    const answerColor = getRandomColor()
    setColor(answerColor)

    // Set wrong answer + correct answer options:
    const colorOptionOne = getRandomColor()
    const colorOptionTwo = getRandomColor()
    const optionsList = [answerColor, colorOptionOne, colorOptionTwo]
    console.log('optionsList:', optionsList) // optionsList: (3) ['#176638', '#8bc584', '#419909']
    const shuffledList = optionsList.sort(() => Math.random() - 0.5)
    console.log('shuffledList:', shuffledList) // shuffledList: (3) ['#176638', '#419909', '#8bc584']
    setOptions(shuffledList)
  }

  // Set colors on page load
  useEffect(() => {
    setGameColors()
  }, [])

  // Show result text, update score and score color
  const showResult = () => {
    if (color && userAnswer) {
      // return userAnswer === color ? <p className='correct'>Correct</p> : <p className='wrong'>Wrong Answer</p>;
      if (userAnswer === color) {
        // If correct answer:
        setScore((prev) => prev + 1)
        if (scoreRef.current) {
          scoreRef.current.style.color = 'rgb(19, 206, 19)'
        }
        setGameColors() // update game -> set new colors after correct answer
        // return/show message
        return <p className='correct'>Correct {color}</p>
      } else {
        // If wrong answer:
        if (scoreRef.current) {
          scoreRef.current.style.color = 'red'
        }
        setScore((prev) => prev - 1)
        // return/show message
        return <p className='wrong'>Wrong Answer</p>
      }
    }
  }

  // After player selects answer -> show result text, update score -> after 1500ms clear result message
  useEffect(() => {
    setResult(showResult()) // show result text, update score
    const clearColorAndResult = setTimeout(() => {
      // clear result message and score color
      setResult(undefined)
      if (scoreRef.current) {
        // scoreRef.current.style.color = 'inherit'
        scoreRef.current.style.color = 'rgb(184, 178, 178)'
      }
    }, 1500)

    // Cleanup result text message timeout:
    return () => {
      clearTimeout(clearColorAndResult)
    }
  }, [userAnswer])

  return (
    <div className='App'>
      <h1 className='title'>Guess the color</h1>
      <p className='score' ref={scoreRef}>
        Score: {score}
      </p>
      <div className='color' style={{ backgroundColor: `${color ? color : 'pink'}` }} />
      <div className='options'>
        {options.map((answerOption) => (
          <button
            onClick={(e) => {
              setUserAnswer(answerOption)
            }}
          >
            {answerOption}
          </button>
        ))}
      </div>
      <div className='result'>{result}</div>
      <button onClick={resetGame} className='reset'>
        Reset
      </button>
    </div>
  )
}

export default App
