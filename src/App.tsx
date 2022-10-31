import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [color, setColor] = useState<string>('')
  const [options, setOptions] = useState<string[]>([])
  const [userAnswer, setUserAnswer] = useState<string>('')
  const answerOptionsRef = useRef<HTMLFormElement>(null)
  const [score, setScore] = useState(0)
  const scoreRef = useRef<HTMLParagraphElement>(null)
  const [result, setResult] = useState<JSX.Element | undefined>()
  const [darkTheme, setDarkTheme] = useState(localStorage.getItem('theme'))
  const root = document.getElementsByTagName('html')[0]

  console.log(
    'localStorage.getItem:',
    localStorage.getItem('theme'),
    'boolean:',
    Boolean(localStorage.getItem('theme')),
    111111
  )
  console.log({ darkTheme }) // {darkTheme: false}

  // Apple app/website theme (light/dark theme)
  const applyTheme = () => {
    // check system preference:
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    console.log({ prefersDark }) // prefersDark: false
    // check saved app/website theme preference:
    const localDarkTheme = localStorage.getItem('theme')
    console.log({ localDarkTheme }) // localTheme: null

    // if system preference dark theme and have not set app/website theme (e.g. first time visit) -> set dark theme
    if (prefersDark && localDarkTheme == null) {
      console.log('run prefersDark && localDarkTheme == null')
      localStorage.setItem('theme', 'true')
      root.classList.add('dark')
    }
  }

  // Set app/page theme on page load (paints the app before it renders elements)
  useLayoutEffect(() => {
    console.log('LAYOUT EFFECT')
    applyTheme()
  }, [])

  // Toggle theme on theme state change (toggle button)
  useEffect(() => {
    // if currently on dark theme -> switch to light theme
    if (darkTheme === 'true') {
      console.log('run IF DARKTHEME = TRUE')
      root.classList.add('dark')
      localStorage.setItem('theme', 'true')
    }
    // if currently on light theme -> switch to dark theme
    if (darkTheme === 'false') {
      console.log('run IF DARKTHEME = FALSE')
      root.classList.remove('dark')
      localStorage.setItem('theme', 'false')
    }
  }, [darkTheme])

  const resetGame = () => {
    setGameColors()
    setScore(0)
    setResult(undefined)
    setUserAnswer('')
    // clear focus (continuously playable with TAB)
    if (answerOptionsRef.current) {
      answerOptionsRef.current.focus()
    }
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

        // clear focus after correct guess (continuously playable with TAB)
        if (answerOptionsRef.current) {
          answerOptionsRef.current.focus()
        }

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
      <button
        className='dark-mode-toggle'
        onClick={() => {
          // if currently on dark theme -> switch to light theme
          if (darkTheme === 'true') {
            setDarkTheme('false')
          } else {
            // if currently on dark theme -> switch to light theme
            setDarkTheme('true')
          }
        }}
      >
        Dark mode
      </button>
      <h1 className='title'>Guess the color</h1>
      <div className='score-container'>
        <button onClick={resetGame} className='reset' tabIndex={0}>
          Reset
        </button>
        <p className='score' ref={scoreRef}>
          Score: {score}
        </p>
      </div>
      <div className='color' style={{ backgroundColor: `${color ? color : 'pink'}` }} />
      <div className='result' aria-live='polite' aria-atomic='true'>
        {result}
      </div>
      <form className='options' tabIndex={-1} ref={answerOptionsRef}>
        {options.map((answerOption) => (
          <button
            key={answerOption}
            type='button' // prevent form default reset not type submit
            onClick={(e) => {
              setUserAnswer(answerOption)
            }}
          >
            {answerOption}
          </button>
        ))}
      </form>
    </div>
  )
}

export default App
