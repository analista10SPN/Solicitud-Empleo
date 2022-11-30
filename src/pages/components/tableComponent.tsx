import React, { SetStateAction, useEffect, useState } from "react";

import Select, { OptionsOrGroups } from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import {
  Column,
  Table,
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  RowData,
} from "@tanstack/react-table";

interface keyable {
  [key: string]: any;
}

type columnProperties = {
  name: string;
  property: string;
};

interface tableProps {
  data: Record<string, unknown>[];
  setData: any;
  columnProps: columnProperties[];
  selectOptions: any;
}

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (
      rowIndex: number,
      columnId: string,
      value: unknown,
      isSelect: boolean
    ) => void;
  }
}

export default function TableComponent({
  data,
  setData,
  columnProps,
  selectOptions,
}: tableProps) {
  const deleteRow = (index: number) => {
    const popElement = data.at(index);
    const dataAux = data.filter((element) => {
      return element !== popElement;
    });

    setData(dataAux);
  };

  const defaultColumn: Partial<ColumnDef<any>> = {
    cell: function Cell({ getValue, row: { index }, column: { id }, table }) {
      // try {
      //   getValue();
      // } catch {
      //   return;
      // }
      const initialValue = getValue();

      let dataType = "text";
      let isSelectInput = false;
      let options: OptionsOrGroups<any, any> | undefined = [];
      let selectedOption = {};

      if (id.split(".")[1] === "value") {
        isSelectInput = true;
        selectOptions.forEach((_element: { id: any; optionsArray: any }) => {
          if (_element.id === id.split(".")[0]) {
            options = _element.optionsArray;
          }
        });
        options.forEach((optionObject) => {
          if (optionObject.value === initialValue) {
            selectedOption = optionObject;
          }
        });
      }
      console.log(
        "DATA SPLIT TO DATE TRY:",
        String(initialValue)?.split("/")?.length
      );
      if (
        String(initialValue)?.split("-")[0]?.length === 4 &&
        String(initialValue)?.split("-")[1]?.length === 2 &&
        String(initialValue)?.split("-")[2]?.length === 2
      ) {
        dataType = "date";
      }

      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(index, id, value, isSelectInput);
      };

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);

      if (!isSelectInput)
        return (
          <input
            type={dataType}
            required={dataType === "date" ? true : false}
            className="bg-gray-200 text-center"
            value={value as string}
            onChange={(e) => {
              if (
                dataType === "date" &&
                e?.target?.value?.split("-")?.length !== 3
              ) {
                return;
              } else if (e?.target?.value?.length === 0) {
                return;
              }
              setValue(e.target.value);
            }}
            onBlur={onBlur}
          />
        );
      else {
        return (
          <Select
            placeholder="Seleccione..."
            className="min-w-max border-0 px-2 pt-1 outline-none focus:outline-0"
            options={options}
            defaultValue={selectedOption}
            isSearchable={false}
            onChange={(e) => {
              setValue(e);
            }}
            onBlur={() => {
              onBlur;
            }}
          />
        );
      }
    },
  };

  console.log("DATA:", data);

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: "",
        id: "1",
        footer: (props) => props.column.id,
        columns: columnProps?.map((column) => {
          return {
            id: column?.property,
            accessorKey: column?.property,
            header: () => <span>{column?.name}</span>,
            // footer: props => props.column.id,
          };
        }),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex, columnId, value, isSelect) => {
        // Skip age index reset until after next rerender
        setData((old: any) =>
          old?.map((row: any, index: number) => {
            if (index === rowIndex) {
              let columnString: any = columnId;
              if (columnId.split(".")[1] === "value") {
                columnString = columnId.split(".")[0];
              }
              return {
                ...old[rowIndex]!,
                [columnString]: value,
              };
            }
            return row;
          })
        );
      },
    },
  });

  return (
    <div className="w-72 overflow-x-scroll p-2 lg:w-[40rem]">
      <div className="h-2 w-72 lg:w-[40rem]" />
      <table>
        <thead className="bg-[color:var(--stepperColor)] text-white">
          {table.getHeaderGroups()?.map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers?.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="bg-gray-200">
          {table.getRowModel()?.rows?.map((row) => {
            return (
              <tr key={row?.id}>
                {row.getVisibleCells()?.map((cell) => {
                  return (
                    <td className="text-center" key={cell?.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
                <td className="bg-white">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      deleteRow(row?.index);
                    }}
                  >
                    {" "}
                    <FontAwesomeIcon
                      className="h-6 w-6 pl-2 text-red-500"
                      icon={faTrash}
                    />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="h-2" />
    </div>
  );
}
