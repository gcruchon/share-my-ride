import Layout from '../components/Layout.js'
import Markdown from 'react-markdown'

const content = `
# A propos de "Share My Ride"
    
Cette application vise à encourager le co-voiturage en récompensant les
conducteurs et les passagers via un système de points.
`

export default () => (
  <Layout>
    <div className="markdown">
      <Markdown source={content} />
    </div>
  </Layout>
  )