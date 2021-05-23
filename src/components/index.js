import { useEffect, useState } from 'react';
import './index.scss';
import { useSwipeable } from 'react-swipeable';

const SwipeConfig = {
    delta: 10,                            // min distance(px) before a swipe starts
    preventDefaultTouchmoveEvent: true,  // call e.preventDefault *See Details*
    trackTouch: true,                     // track touch input
    trackMouse: true,                    // track mouse input
    rotationAngle: 0,                     // set a rotation angle
    //enableMouseEvents: true
  }

export default function Index(props) {
    const [config, setConfig ] = useState({
        loadedOnce: false,
        error: false,
        words: [],
    })
    const [ loading, setLoading ] = useState(true);
    const [ cardConfig, setCardConfig ] = useState({
        currentWord: null,
        showMeaning: false,
        alignLeft: false,
        alignRight: false,
    })
    
//to fetch a new source
    useEffect(() => {
        if(!config.loadedOnce) {
            //fetch words from database
            loadData();
        }
        
    }, [config.loadedOnce]);

//to generate a random word
    useEffect(() => {
        pickRandomWord();
    }, [config.words]);

    const loadData = (source="baron-334") => {
        import(`../database/${source}.json`)
        .then(( Dictionary ) => {
          let result = Dictionary.default["words"];
          if(typeof result === 'undefined'){
            setConfig({ ...config, error: true });
          }
          else {
            setConfig({ ...config, words: result, loadedOnce: true, error: false });
          } 
        })
        .catch(err => {
          setConfig({ ...config, error: true });
        });
    }

    const pickRandomWord = () => {
        const { words } = config;
        const length = words.length;
        const randomWord = words[Math.floor(Math.random()*length)];
        setCardConfig({ ...cardConfig, currentWord: randomWord, showMeaning: false, alignLeft: false, alignRight: false });
        setLoading(false);
    }

    const expandWord = (e) => {
        if(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setCardConfig({ ...cardConfig, showMeaning: true });
    }
    const condenseWord = (e) => {
        if(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setCardConfig({ ...cardConfig, showMeaning: false });
    }

    const handlers = useSwipeable({
        onSwiped: (eventData) => {handleSwipe(eventData)},
        ...SwipeConfig,
        onTap: () => {toggleWord();}
    });

    const handleSwipe = (data) => {
        switch(data.dir) {
            case 'Right' : {
                updateCard();
                break;
            }
            case 'Up':
            case 'Left': {
                expandWord();
                break;
            }
            case 'Down': {
                condenseWord();
                break;
            }
            default: 
                return;
        }
    }

    const toggleWord = () => {
        if(cardConfig.showMeaning)
            condenseWord();
        else
            expandWord();
    }

    const updateCard = () => {
        moveCardRight();
        setTimeout(() => moveCardLeft(), 100); 
    }

    const moveCardLeft = () => {
        setCardConfig({ ...cardConfig, alignLeft: true, alignRight: false, showMeaning: false });
        setTimeout(() =>pickRandomWord(), 200);
    }
    const moveCardRight = () => {
        setCardConfig({ ...cardConfig, alignLeft: false, alignRight: true });
    }

    const resetCardStatus = () => {
        setCardConfig({
            ...cardConfig,
            alignLeft: false,
            alignRight: false,
        });
    }
    


    if(loading) {
        return (
            <div>Loading</div>
        )
    }

    const { currentWord, showMeaning, alignLeft, alignRight } = cardConfig;

    return (
        <div className="appContainer" {...handlers}>
           {
               currentWord &&
               <div
                    className={`wordContainer
                    ${showMeaning ? 'expand' : ''} 
                    ${alignLeft ? 'alignLeft' : ''}
                    ${alignRight ? 'alignRight' : ''}
                    `}
                    //onContextMenu={(e)=>{expandWord(e)}}
                    //onClick={expandWord}
                >
                    <div className="title">{currentWord.word}</div>
                    <div className={`meaning`}>{currentWord.definition}</div>
               </div>
            }
        </div>
    )
}