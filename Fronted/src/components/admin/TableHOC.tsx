import {
  useTable,
  Column,
  TableOptions,
  useSortBy,
  TableState,
  UseTableColumnProps,
} from "react-table";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { useMemo } from "react";

interface SortableColumn<T extends object> extends UseTableColumnProps<T> {
  getSortByToggleProps: () => any;
  isSorted: boolean;
  isSortedDesc: boolean;
}

function TableHOC<T extends object>(
  columns: Column<T>[],
  data: T[],
  containerClassname: string,
  heading: string,
  showPagination: boolean = false
): () => JSX.Element {
  return function HOC() {
    const memoizedColumns = useMemo(() => columns, []);
    const memoizedData = useMemo(() => data, []);

    const options: TableOptions<T> = {
      columns: memoizedColumns,
      data: memoizedData,
      initialState: {
        pageIndex: 0,
        pageSize: showPagination ? 6 : memoizedData.length,
      } as Partial<TableState<T>>,
    };

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    } = useTable(options, useSortBy);

    return (
      <div className={containerClassname}>
        <h2 className="heading">{heading}</h2>
        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => {
              const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
              return (
                <tr key={key} {...headerGroupProps}>
                  {headerGroup.headers.map((column) => {
                    const sortableColumn = column as unknown as SortableColumn<T>;
                    const { key: headerKey, ...headerProps } = column.getHeaderProps(sortableColumn.getSortByToggleProps());
                    return (
                      <th key={headerKey} {...headerProps}>
                        {column.render("Header")}
                        {sortableColumn.isSorted && (
                          <span>
                            {" "}
                            {sortableColumn.isSortedDesc ? (
                              <AiOutlineSortDescending />
                            ) : (
                              <AiOutlineSortAscending />
                            )}
                          </span>
                        )}
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              const { key: rowKey, ...rowProps } = row.getRowProps();
              return (
                <tr key={rowKey} {...rowProps}>
                  {row.cells.map((cell) => {
                    const { key: cellKey, ...cellProps } = cell.getCellProps();
                    return (
                      <td key={cellKey} {...cellProps}>
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };
}

export default TableHOC;
