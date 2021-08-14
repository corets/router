import React from "react"
import { render } from "react-dom"
import { RenderedPage } from "./pages/RenderedPage"
import { Link } from "../src/router/Link"
import { ExactPage } from "./pages/ExactPage"
import { SlowPageWithCallbacks } from "./pages/SlowPageWithCallbacks"
import { Counter } from "./components/Counter"
import { RenderedWithParamsPage } from "./pages/RenderedWithParamsPage"
import { useParams } from "../src/location/useParams"
import { UpdateParams } from "./components/UpdateParams"
import { Switch } from "../src/router/Switch"
import { SlowPage } from "./pages/SlowPage"
import { SlowPageViaRoute } from "./pages/SlowPageViaRoute"
import { ProgressIndicator } from "./components/ProgressIndicator"
import { Router } from "../src/router/Router"
import { Route } from "../src/route/Route"
import { UpdateQuery } from "./components/UpdateQuery"
import { SlowControlledPage } from "./pages/SlowControlledPage"

const App = () => {
  return (
    <Router loadable unloadable base={"/foo"} debug>
      <ProgressIndicator />
      <ul>
        {[
          "/loaded-element",
          "/loaded-component",
          "/render-component",
          "/render-element",
          "/render-element/foo",
          "/render-element-params/foo",
          "/render-fn-params/foo",
          "/render-fn/foo",
          "/children/foo?yolo=swag",
          "/children-fn/foo",
          "/children-fn-params/foo",
          "/exact/foo",
          "/exact/fail",
          "/exact-optional",
          "/exact-optional/foo",
          "/slow",
          "/slow-controlled",
          "/switch/foo",
          "/switch/foo/bar",
          "/switch/foo/bar/nested",
          "/switch/404",
          "/nested",
          "/nested/nested",
          "/nested-manual",
          "/nested-manual/nested",
          "/nested-route",
          "/nested-route/nested",
        ].map((path, index) => (
          <li key={index}>
            <Link to={path}>{path}</Link>
          </li>
        ))}
      </ul>

      <hr />

      <Route
        path={"/loaded-element"}
        load={() => import("./pages/LoadedPage").then((m) => m.LoadedPage)}
      />
      <Route
        path={"/loaded-component"}
        load={() =>
          import("./pages/LoadedPage").then((m) => {
            const Page = m.LoadedPage

            return <Page />
          })
        }
      />
      <Route path={"/render-component"} render={<RenderedPage />} />
      <Route path={"/render-element/:foo?"} render={RenderedPage} />
      <Route path={"/render-fn"} render={() => <RenderedPage />} />
      <Route path={"/render-element-params"} render={RenderedWithParamsPage} />
      <Route
        path={"/render-fn-params"}
        render={(params) => <RenderedWithParamsPage {...params} />}
      />
      <Route path={"/exact/foo"} exact render={<ExactPage />} />
      <Route path={"/exact-optional/:foo?"} exact render={<ExactPage />} />
      <Route path={"/slow"} render={<SlowPageWithCallbacks />} />
      <Route
        path={"/slow-controlled"}
        controlled
        render={<SlowControlledPage />}
      />
      <Route path={"/children"}>
        <>
          children (props can not be passed)
          <br />
          <Counter />
          <br />
          <UpdateParams />
          <br />
          <UpdateQuery />
        </>
      </Route>
      <Route path={"/children-fn"}>
        {() => {
          const params = useParams()

          return (
            <div>
              children fn {JSON.stringify(params)} (from context)
              <br />
              <Counter />
              <br />
              <UpdateParams />
            </div>
          )
        }}
      </Route>
      <Route path={"/children-fn-params"}>
        {(props) => {
          return (
            <div>
              children fn {JSON.stringify(props)} (passed directly)
              <br />
              <Counter />
              <br />
              <UpdateParams />
            </div>
          )
        }}
      </Route>
      <Route
        path={"/nested"}
        render={() => <SlowPageWithCallbacks nested={true} />}
      />
      <Route
        path={"/nested-manual"}
        render={() => <SlowPage nested={true} />}
      />
      <Route
        path={"/nested-route"}
        render={() => <SlowPageViaRoute nested={true} />}
      />
      <Route path={"/switch"}>
        <Switch>
          <Route
            path={"/switch/foo/bar"}
            render={() => <SlowPageWithCallbacks />}
          />
          <Route path={"/switch/foo"}>
            <RenderedPage />
          </Route>
          <Route>
            <div>switch fallback (404)</div>
          </Route>
        </Switch>
      </Route>
      <Route>
        <div>
          <br />
          <hr />
          <br />
          Always visible (non switch catch all)
          <br />
          <Counter />
          <br />
          <UpdateParams />
        </div>
      </Route>
    </Router>
  )
}

render(<App />, document.querySelector("#root"))
