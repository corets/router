import React from "react"
import { useHistory } from "../../src/location/useHistory"
import { useLocation } from "../../src/location/useLocation"

export const UpdateParams = () => {
  const history = useHistory()
  const location = useLocation()

  const handleUpdateParams = () => {
    history.push(location.pathname + "/1")
  }

  return <button onClick={handleUpdateParams}>update params</button>
}
