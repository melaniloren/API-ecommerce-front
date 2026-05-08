import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ProductCard from './ejemplos/ProductCard.jsx'
import TwitterCard from './ejemplos/TwitterFollowCard.jsx'
import Video from './ejemplos/Video.jsx'
import OnOff from './ejemplos/OnOff.jsx'
import Card from './ejemplos/Card.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <OnOff /> */}
    {/* <ProductCard /> */}
    {/* <TwitterCard userName='jperez' initialIsFollowing={false} >
      @ssanchez
    </TwitterCard> */}
    <Card userName='jsuarez' onFollow='false' formatUserName={(name) => name.toUpperCase()}>
      <p>Me gustan los deportes</p>
    </Card>
    {/* <Card userName='jperez' onFollow='true' formatUserName={(name) => name.toUpperCase()}>
      <p>Me gustan la tecnología</p>
      <div>
        <a href="">Link a Facebook</a>
        <a href="">Link a Instagram</a>
      </div>
      <OnOff />
    </Card>
    <Card userName='hperez' onFollow='true' formatUserName={(name) => name.toUpperCase()}>
      <p>Me gustan viajar</p>
      <OnOff />
    </Card>     */}

  </StrictMode>,
)
