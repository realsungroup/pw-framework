import { getRenderedPwTableColumnsWidth } from './getRenderedPwTableColumnsWidth';

describe('getRenderedPwTableColumnsWidth', () => {
  it('getRenderedPwTableColumnsWidth', async () => {
    let containerDOM = document.createElement('div');
    containerDOM.setAttribute('class', 'pw-table');
    document.body.appendChild(containerDOM);

    const containerSelector = '.pw-table';
    const columns = [
      {
        title: 'name1',
        dataIndex: 'name1',
        key: 'name1',
        width: 200
      },
      {
        title: 'name2',
        dataIndex: 'name2',
        key: 'name2',
        width: 200
      }
    ];
    const dataSource = [
      {
        name1: '111',
        name2: '222'
      },
      {
        name1: '111',
        name2: '222'
      }
    ];
    const result = await getRenderedPwTableColumnsWidth(
      containerSelector,
      columns,
      dataSource
    );

    expect(result).toEqual([
      {
        title: 'name1',
        dataIndex: 'name1',
        key: 'name1',
        className: 'table-data__pw-table-column-name1',
        sorter: true,
        width: 0
      },
      {
        title: 'name2',
        dataIndex: 'name2',
        key: 'name2',
        className: 'table-data__pw-table-column-name2',
        sorter: true,
        width: 0
      }
    ]);
  });
});
