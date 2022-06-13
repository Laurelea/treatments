import './App.css';
import React from 'react'
import Header from './containers/header'
import { Route, Switch } from "react-router-dom";
import ShowTemplates from './partials/show-templates'
import { ShowTreatments } from './partials/show-treatments'
import { ShowComponents } from './partials/show-components'
import { ShowPhases } from './partials/show-phases'

const App = () => {
  return (
      <div id='treatment' className='mainPage' >
        <header className="header mainElement">
            <Header/>
        </header>
        {/*<div className='controller'>*/}
        {/*    */}
        {/*</div>*/}
        <div className="center mainElement">
          <Switch>
            <Route path="/" exact render={() =>
                <React.Fragment>
                  <h1>Treatments Home Page</h1>
                  <p id="welcome">
                    Тут будут обработки
                  </p>
                </React.Fragment>
            }/>
            <Route path="/show-templates" exact component={ShowTemplates}/>
            <Route path="/show-treatments" exact component={ShowTreatments}/>
            <Route path="/show-components" exact component={ShowComponents}/>
            <Route path="/show-phases" exact component={ShowPhases}/>
            <Route render={() => <h2>404 not found</h2>}/>
          </Switch>
        </div>
      </div>
  );
}

export default App
