import React, { useEffect, useReducer, useState } from 'react';
import ReactDOM from 'react-dom';
import { useImmerReducer } from 'use-immer';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Axios from 'axios';
Axios.defaults.baseURL = 'http://localhost:8080';

import StateContext from './StateContext';
import DispatchContext from './DispatchContext';

import Header from './components/Header';
import Home from './components/Home';
import HomeGuest from './components/HomeGuest';
import Footer from './components/Footer';
import About from './components/About';
import Terms from './components/Terms';
import CreatePost from './components/CreatePost';
import ViewSinglePost from './components/ViewSinglePost';
import FlashMessages from './components/FlashMessages';
import Profile from './components/Profile';

function ExampleComponent() {
  const initialState = {
    logged: Boolean(localStorage.getItem('complexappToken')),
    flashMessages: [],
    user: {
      token: localStorage.getItem('complexappToken'),
      username: localStorage.getItem('complexappUsername'),
      avatar: localStorage.getItem('complexappAvatar'),
    },
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case 'login':
        draft.logged = true;
        draft.user = action.data;
        return;
      case 'logout':
        draft.logged = false;
        return;
      case 'flashMessage':
        draft.flashMessages.push(action.value);
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.logged) {
      localStorage.setItem('complexappToken', state.user.token);
      localStorage.setItem('complexappUsername', state.user.username);
      localStorage.setItem('complexappAvatar', state.user.avatar);
    } else {
      localStorage.removeItem('complexappToken');
      localStorage.removeItem('complexappUsername');
      localStorage.removeItem('complexappAvatar');
    }
  }, [state.logged]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />

          <Switch>
            <Route path="/profile/:username">
              <Profile />
            </Route>
            <Route path="/" exact>
              {state.logged ? <Home /> : <HomeGuest />}
            </Route>
            <Route path="/create-post">
              <CreatePost />
            </Route>
            <Route path="/post/:id">
              <ViewSinglePost />
            </Route>
            <Route path="/about" exact>
              <About />
            </Route>
            <Route path="/terms" exact>
              <Terms />
            </Route>
          </Switch>

          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

ReactDOM.render(<ExampleComponent />, document.querySelector('#app'));

if (module.hot) {
  module.hot.accept();
}
