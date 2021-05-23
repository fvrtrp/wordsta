import Index from './components';
import { Helmet } from 'react-helmet';

function App() {
  return (
    <div className="App">
       <Helmet>
            <meta charSet="utf-8" />
            <title>Wordsta - Learn words with flashcards</title>
            <link rel="canonical" href="http://fvrtrp.com/wordsta" />
            <meta name="description" content="Vocabulary app by Fevertrip" />
        </Helmet>
      <Index />
    </div>
  );
}

export default App;
