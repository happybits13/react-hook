import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    // setTimeout is similar to sleep
    const timer = setTimeout(() => {
      // enteredFilter (state) will be set upon useEffect was called. Means 500ms before the inputRef.currentvalue in this case.
      if (enteredFilter === inputRef.current.value) {
        const query = 
        enteredFilter.length === 0
        ? ''
        : `?orderBy="title"&equalTo="${enteredFilter}"`;
  
        fetch('https://react-hook-c6ab0.firebaseio.com/ingredients.json' + query)
        .then(response => {
          return response.json()
        })
        .then(responseData => {
          const loadedIngredient = []
          for(const key in responseData){
            loadedIngredient.push({
             id: key,
             title: responseData[key].title,
             amount: responseData[key].amount
            });
         }
        // this causes a render too. setting state in useEffect
  
        onLoadIngredients(loadedIngredient);  
      })
      }
    }, 500);

    // this cleanup will happen after render, before what happens above
    return () => {
      // clear timer because a new timer is created on every timeout
      clearTimeout(timer);
    }

  }, [enteredFilter, onLoadIngredients, inputRef])


  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
