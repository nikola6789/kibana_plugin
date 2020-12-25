import "@elastic/eui/dist/eui_theme_light.css";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext
 } from 'react';

import {
  EuiPage,
  EuiPageHeader,
  EuiTitle,
  EuiSpacer,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentHeader,
  EuiPageContentBody,
  EuiText,
  EuiDataGrid
} from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';
import { GridViewData } from './gridviewdata';

const DataContext = createContext();

export class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.raw_data = [];
  }

  componentDidMount() {
    const { httpClient } = this.props;

    httpClient.get('../api/quality_dashboard/elsData').then((resp) => {
      console.log(resp.data.returnData);
      this.setState({ collectedData: resp.data.returnData });
    });
  }

  renderDataTable() {
    return (
      <GridViewData />
    );
  }


  //Start rendering page content
  render() {
    const { title } = this.props;
    return (
      <EuiPage>
        <EuiPageBody>
          <EuiPageHeader>
            <EuiTitle size="l">
              <h1>
                <FormattedMessage
                  id="qualityDashboardPlugin.helloWorldText"
                  defaultMessage="{title}"
                  values={{ title }}
                />
              </h1>
            </EuiTitle>
          </EuiPageHeader>

          <EuiPageContent>
            <EuiPageContentHeader>
              <EuiTitle>
                <h3>
                  <FormattedMessage
                    id="qualityDashboardPlugin.updateTitle"
                    defaultMessage="Last update: 02/12/2020"
                  />
                </h3>
              </EuiTitle>
            </EuiPageContentHeader>

          </EuiPageContent>

          <EuiSpacer size="l" />

          <EuiPageContent>
            {this.renderDataTable()}
          </EuiPageContent>

        </EuiPageBody>

      </EuiPage>
    );
  }
}
