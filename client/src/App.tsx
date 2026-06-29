import { ApiProvider } from "./context/ApiContext"
import { AuthProvider } from "./context/AuthContext"


function App() {
  return (
    <ApiProvider>
      <AuthProvider>
        <>
        </>
      </AuthProvider>
    </ApiProvider>
  )
}

export default App
