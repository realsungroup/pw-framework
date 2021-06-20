import * as getRenderedPwTableColumnsWidthModule from './getRenderedPwTableColumnsWidth';
import {
  getUpdatedWithColumns,
  getColumnMaxWithByBEWith,
  getDealedTableBlankIssueColumns
} from './utils';

describe('utils', () => {
  describe('tests getUpdatedWithColumns function', async () => {
    it('when columnMaxWidth is 100, return the correct columns', async () => {
      const columnMaxWidth = 100;
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

      jest
        .spyOn(
          getRenderedPwTableColumnsWidthModule,
          'getRenderedPwTableColumnsWidth'
        )
        .mockReturnValue(
          Promise.resolve([
            {
              title: 'name1',
              dataIndex: 'name1',
              key: 'name1',
              width: 80 // less then 100
            },
            {
              title: 'name2',
              dataIndex: 'name2',
              key: 'name2',
              width: 120 // greater then 100
            }
          ])
        );

      const result = await getUpdatedWithColumns(columns, {
        columnMaxWidth,
        containerSelector: '.containerSelector',
        dataSource
      });

      expect(result).toEqual([
        {
          title: 'name1',
          dataIndex: 'name1',
          key: 'name1',
          width: 80
        },
        {
          title: 'name2',
          dataIndex: 'name2',
          key: 'name2',
          width: 100
        }
      ]);
    });

    it('when columnMaxWidth is object:{ name1: 100, name2: 100 }, return the correct columns', async () => {
      const columnMaxWidth = {
        name1: 100,
        name2: 100
      };

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
        },
        {
          title: 'name3',
          dataIndex: 'name3',
          key: 'name3',
          width: 200
        }
      ];

      const dataSource = [
        {
          name1: '111',
          name2: '222',
          name3: '333'
        },
        {
          name1: '111',
          name2: '222',
          name3: '333'
        },
        {
          name1: '111',
          name2: '222',
          name3: '333'
        }
      ];

      jest
        .spyOn(
          getRenderedPwTableColumnsWidthModule,
          'getRenderedPwTableColumnsWidth'
        )
        .mockReturnValue(
          Promise.resolve([
            {
              title: 'name1',
              dataIndex: 'name1',
              key: 'name1',
              width: 80 // less then 100
            },
            {
              title: 'name2',
              dataIndex: 'name2',
              key: 'name2',
              width: 120 // greater then 100
            }
          ])
        );

      const result = await getUpdatedWithColumns(columns, {
        columnMaxWidth,
        containerSelector: '.containerSelector',
        dataSource
      });

      expect(result).toEqual([
        {
          title: 'name1',
          dataIndex: 'name1',
          key: 'name1',
          width: 80
        },
        {
          title: 'name2',
          dataIndex: 'name2',
          key: 'name2',
          width: 100
        },
        {
          title: 'name3',
          dataIndex: 'name3',
          key: 'name3',
          width: 200
        }
      ]);
    });
  });

  it('tests getColumnMaxWithByBEWith function', () => {
    const cmsColumnInfo = [
      {
        id: '111',
        text: 'name',
        111: {
          CS_SHOW_WIDTH: 100 // 后端的 column max width
        }
      }
    ];

    const result = getColumnMaxWithByBEWith(cmsColumnInfo);

    expect(result).toEqual({
      111: 100
    });
  });

  describe('tests getDealedTableBlankIssueColumns function', () => {
    it('when all columns have width, and options.tableWidth greater than sum of all columns, return the correct columns', () => {
      const columns = [
        {
          width: 100
        },
        { width: 100 }
      ];

      const rowSelectionWidth = 50;
      const tableWidth = 300;
      const actionBarWidth = 10;

      const result = getDealedTableBlankIssueColumns(columns, {
        rowSelectionWidth,
        tableWidth,
        actionBarWidth
      });

      expect(result).toEqual([
        {
          width: 120
        },
        { width: 120 }
      ]);
    });

    it('when all columns have width, and options.tableWidth less than sum of all columns, return the correct columns', () => {
      const columns = [
        {
          width: 100
        },
        { width: 100 }
      ];

      const rowSelectionWidth = 50;
      const tableWidth = 200;
      const actionBarWidth = 10;

      const result = getDealedTableBlankIssueColumns(columns, {
        rowSelectionWidth,
        tableWidth,
        actionBarWidth
      });

      expect(result).toEqual([
        {
          width: 100
        },
        { width: 100 }
      ]);
    });

    it('when a column has no width, return the correct columns', () => {
      const columns = [
        {
          width: 100
        },
        {}
      ];

      const rowSelectionWidth = 50;
      const tableWidth = 300;

      const result = getDealedTableBlankIssueColumns(columns, {
        rowSelectionWidth,
        tableWidth
      });

      expect(result).toEqual([
        {
          width: 100
        },
        {}
      ]);
    });
  });
});
