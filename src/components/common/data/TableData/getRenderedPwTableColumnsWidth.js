import React from 'react';
import ReactDOM from 'react-dom';
import PwTable from '../../ui/PwTable';
import { IntlProvider } from 'react-intl';
import zh_CN_antd from 'antd/lib/locale-provider/zh_CN';
import en_US_antd from 'antd/lib/locale-provider/en_US';
import 'moment/locale/zh-cn';
import zh_CN from '../../../../locales/zh-CN';
import en_US from '../../../../locales/en-US';
import { LocaleProvider } from 'antd';

export const getRenderedPwTableColumnsWidth = (
  containerSelector,
  columns,
  dataSource
) => {
  const container = document.querySelector(containerSelector);
  return new Promise((resolve, reject) => {
    const language = localStorage.getItem('language') || '中文';
    localStorage.setItem('language', language);

    let localeAntd = zh_CN_antd;
    let locale = 'zh',
      messages = zh_CN;
    if (language === 'English') {
      localeAntd = en_US_antd;
      locale = 'en';
      messages = en_US;
    }

    const renderedColumns = columns.map(column => {
      return {
        title: column.title,
        dataIndex: column.dataIndex,
        key: column.key,
        className: `table-data__pw-table-column-${column.dataIndex}`,
        sorter: true
      };
    });

    ReactDOM.render(
      <LocaleProvider locale={localeAntd}>
        <IntlProvider locale={locale} messages={messages}>
          <PwTable
            className="table-data__pw-table-column-max-width"
            height={200}
            columns={renderedColumns}
            pagination={{}}
            dataSource={dataSource}
            hasDownload={false}
            hasRefresh={false}
            hasAdvSearch={false}
            hasZoomInOut={false}
            headerExtra={false}
            hasSearch={false}
            hasAdd={false}
            hasModify={false}
            hasDelete={false}
            scroll={{ x: 'max-content' }}
          ></PwTable>
        </IntlProvider>
      </LocaleProvider>,
      container,
      function() {
        renderedColumns.forEach(column => {
          const columnHeaderClassName = `table-data__pw-table-column-${column.dataIndex}`;
          const columnHeader = container.querySelector(
            `.${columnHeaderClassName}`
          );

          if (columnHeader) {
            column.width = columnHeader.clientWidth;
          }
        });
        ReactDOM.unmountComponentAtNode(container);
        resolve(renderedColumns);
      }
    );
  });
};
