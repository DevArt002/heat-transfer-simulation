import { ErrorPage, LandingPage } from 'src/pages';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

function Routing() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Switch>
        <Route exact path={['/']}>
          <LandingPage />
        </Route>
        <Route>
          <ErrorPage error={{ message: '404', name: '' }} resetErrorBoundary={() => {}} />
        </Route>
      </Switch>
    </Router>
  );
}

export default Routing;
