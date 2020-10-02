import React, { useState, useEffect, useCallback, useReducer } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

import ErrorModal from '../UI/ErrorModal';

const Ingredients = () => {

  // const [userIngredients, setUserIngredients] = useState([])
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();
  
  // currentIngredients will reference to your variable when you define
  const ingredientReducer = (currentIngredients, action) => {
    switch (action.type){
      case 'SET':
        return action.ingredients;
      case 'ADD':
        return [...currentIngredients, action.ingredient];
      case 'DELETE':
        return currentIngredients.filter(ing => ing.id !== action.id)
      default:
        throw new Error('This should not happen');
    }
  }

  const httpReducer = (httpState, action) => {
    switch(action.type){
      case 'SEND':
        return {loading: true, error: null}
      case 'RESPONSE':
        // loading:false will replace whatever httpState in loading, and add on
        return {...httpState, loading: false}
        // return {loading: false, error: null}
      case 'ERROR':
        return {loading: false, error: action.errorMsg}
      case 'CLEAR':
        return {...httpState, error: null}
      default:
        throw new Error('this should not happen')
    }
  }

  // [state, action]. whatever returned in dispatch actions will be set to the userIngredients(currentIngredients in the reducer)
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []); //initialization on second para
  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null});

  // After first render, and every subsequent render update.
  // Good practice to put side-effects (API CALLS) here

  // useEffect(() => {
  //   fetch('https://react-hook-c6ab0.firebaseio.com/ingredients.json')
  //     .then(response => {
  //       return response.json()
  //     })
  //     .then(responseData => {
  //       const loadedIngredient = []
  //       for(const key in responseData){
  //         loadedIngredient.push({
  //           id: key,
  //           title: responseData[key].title,
  //           amount: responseData[key].amount
  //         });
  //       }
  //       // this causes a render too. setting state in useEffect
        
  //       setUserIngredients(loadedIngredient);  
  //     })
  // },[])

  // useEffect(() => {
  //   console.log('userIngredient state changed. Rendering from useEffect')
  // }, [userIngredients])

  const addIngredientHandler = (ingredient) => {
    // setIsLoading(true);
    dispatchHttp({type:'SEND'});
    fetch('https://react-hook-c6ab0.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      // setIsLoading(false);
      dispatchHttp({type:'RESPONSE'});
      // convert response to json. this returns a promise, passed as responseData
      return response.json();
    }).then(responseData => {
      // setUserIngredients(prevIngredients => {
      // return [...prevIngredients, {id: responseData.name, ...ingredient}];
      // });
      dispatch({type: 'ADD', ingredient: {id: responseData.name, ...ingredient}})
    }).catch(error => {
      // setError("Something went wrong!");
      // setIsLoading(false);
      dispatchHttp({type:'ERROR', errorMsg:'Something went wrong!'});

    });


  }

  const removeIngredientHandler = ingredientId => {
    // setIsLoading(true);
    dispatchHttp({type: 'SEND'})
    fetch(`https://react-hook-c6ab0.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    }).then(response => {
      
      dispatchHttp({type:'RESPONSE'})
      // setIsLoading(false);

      // setUserIngredients(prevIngredients => { 
      //   return prevIngredients.filter( ingredient => {
      //     return ingredient.id !== ingredientId; 
      //   })
      // })
      dispatch({type: 'DELETE', id: ingredientId})

    }).catch(error => {
      // setError("Something went wrong!");
      // setIsLoading(false);
      dispatchHttp({type: 'ERROR'})
    });


  }

  const clearError = () => {
    // setError(null);
    dispatchHttp({type:'CLEAR'})
  }

  // useCallBack wraps a function and renders on dependency you set
  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    // setUserIngredients(filteredIngredients);
    dispatch({type: 'SET', ingredients: filteredIngredients});
  }, [])

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError} >{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading}/>
  
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
