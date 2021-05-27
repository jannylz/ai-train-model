import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch,Redirect } from 'react-router-dom'
/* 组件 */
import SiderDemo from './App';
import ConfigTrain from './views/configTrain';
import Project from './views/project';
import reportWebVitals from './reportWebVitals';
import Task from './views/task';

const Web = () => {
  return (
    <BrowserRouter>
      <div>
        <SiderDemo className="aiLab" content={
          <div>
            <Switch>
              <Route exact path='/' component={Project} />
              <Route path="/configTrain" component={ConfigTrain} />
              <Route path="/mytask" component={Task} />
              <Route path="/myproject" component={Project} />
              <Redirect to="/"/>
            </Switch>
          </div>
        } />
      </div>
    </BrowserRouter>
  )
}
ReactDOM.render(<Web />, document.getElementById('root'))
reportWebVitals();
