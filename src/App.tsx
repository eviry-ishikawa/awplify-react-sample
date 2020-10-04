import React from 'react';
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react"
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>We now have auth!</h1>
      </header>
      <AmplifySignOut></AmplifySignOut>
    </div>
  );
}

export default withAuthenticator(App);
