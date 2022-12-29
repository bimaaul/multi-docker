import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import styles from "./Fib.module.css"

type SeenIndex = Array<{
  number: number
}>
type Values = {
  [key: string]: string
}

const FibonacciPage = () => {
  const [seenIndexes, setSeenIndexes] = useState<SeenIndex>([])
  const [values, setValues] = useState<Values>({})
  const [index, setIndex] = useState("")

  useEffect(() => {
    const fetchIndexes = async () => {
      const seenIndexes = await axios.get("/api/values/all")
      setSeenIndexes(seenIndexes.data)
    }

    const fetchValues = async () => {
      const values = await axios.get("/api/values/current")
      setValues(values.data)
    }

    fetchIndexes()
    fetchValues()
  }, [])

  const renderValues = useCallback(() => {
    return Object.keys(values).map((index, key) => (
      <p key={`fib-${key}}`}>
        For index {index}, the value is {values[index]}
      </p>
    ))
  }, [values])

  const renderIndexes = useCallback(() => {
    return seenIndexes.map(({ number }) => number).join(", ")
  }, [seenIndexes])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    await axios.post("/api/values", {
      index,
    })
    setIndex("")
  }

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>Enter your index:</label>
        <input type="text" onChange={(e) => setIndex(e.target.value)} />
        <button>Submit</button>
      </form>

      <h3>Indexes seen:</h3>
      {renderIndexes()}

      <h3>Calculated values</h3>
      {renderValues()}
    </div>
  )
}

export default FibonacciPage
