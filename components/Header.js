import Link from 'next/link'

const linkStyle = {
  marginRight: 15
}

const Header = () => (
    <div>
        <Link href="/">
          <a style={linkStyle}>Accueil</a>
        </Link>
        <Link href="/about">
          <a style={linkStyle}>A propos</a>
        </Link>
    </div>
)

export default Header