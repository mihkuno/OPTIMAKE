import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


function Root() {
    return (
        <StrictMode>
            <h1>hello aisha</h1>
        </StrictMode>
    )
}

createRoot(document.getElementById('root')).render(<Root/>,)
