import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import {Helmet} from 'react-helmet';
const Layout = ({children, title, description, keywords, author}) => {
  return (
    <div>
    <Helmet>
          <meta charSet='utf-8' />
          <meta name="description" content={description} />
          <meta name="keywords" content={keywords}/>
          <meta name="author" content={author}/>
      <title>{title}</title>
    </Helmet>
    <main style={{minHeight: '80vh'}}>
        {children}
    </main>
    <Footer />
    </div>
  );
}

Layout.defaultProps = {
  title: 'Ecommerce App',
  description: 'MERN Stack Project',
  keywords: 'mern, react, node, mongodb',
  author: 'Fly'
}

export default Layout