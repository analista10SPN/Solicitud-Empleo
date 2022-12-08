import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import Select, { OptionsOrGroups } from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import InputMask from "react-input-mask";
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";

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
import Alert from "./alert";
import CurrencyInput from "react-currency-input-field";
import Confirmation from "./confirmation";

interface keyable {
  [key: string]: any;
}

type columnProperties = {
  name: string;
  property: string;
  type: string;
};

interface tableProps {
  data: Record<string, unknown>[];
  setData: any;
  columnProps: columnProperties[];
  selectOptions: any;
  openDeleteConfirmationAlert: boolean;
  setOpenDeleteConfirmationAlert: Dispatch<React.SetStateAction<boolean>>;
  deleteConfirmation: boolean;
  setDeleteConfirmation: Dispatch<React.SetStateAction<boolean>>;
}

const defaultMaskOptions = {
  prefix: "$",
  suffix: "",
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ",",
  allowDecimal: true,
  decimalSymbol: ".",
  decimalLimit: 2, // how many digits allowed after the decimal
  integerLimit: 7, // limit length of integer numbers
  allowNegative: false,
  allowLeadingZeroes: false,
};

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
  openDeleteConfirmationAlert,
  setOpenDeleteConfirmationAlert,
  deleteConfirmation,
  setDeleteConfirmation,
}: tableProps) {
  const [openConfirmationAlert, setOpenConfirmationAlert] =
    useState<boolean>(false);

  const [rowIndex, setRowIndex] = useState<number>(0);

  const deleteRow = (index: number) => {
    const popElement = data.at(index);
    const dataAux = data.filter((element) => {
      return element !== popElement;
    });

    setData(dataAux);
    setDeleteConfirmation(false);
    setOpenDeleteConfirmationAlert(true);
  };

  const defaultColumn: Partial<ColumnDef<any>> = {
    cell: function Cell({ getValue, row: { index }, column: { id }, table }) {
      let initialValue: any = "";
      try {
        initialValue = getValue();
      } catch (error) {
        console.log(error);
      }

      let dataType = "text";

      dataType =
        columnProps.find((column) => column.property === id)?.type || "text";

      let isSelectInput = false;
      let options: OptionsOrGroups<any, any> | undefined = [];
      let selectedOption = {};

      if (dataType === "select") {
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
      console.log("DATA selected", initialValue, selectedOption);
      // if (
      //   String(initialValue)?.split("-")[0]?.length === 4 &&
      //   String(initialValue)?.split("-")[1]?.length === 2 &&
      //   String(initialValue)?.split("-")[2]?.length === 2
      // ) {
      //   dataType = "date";
      // }

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

      switch (dataType) {
        case "select":
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
              onBlur={onBlur}
            />
          );
        case "text":
          return (
            <input
              type={dataType}
              required={id === "nombre" ? true : false}
              className="text-md border-t-0 border-r-0 border-l-0 border-b border-gray-300 bg-gray-200 pt-1 text-center"
              value={value as string}
              onChange={(e) => {
                if (e?.target?.value?.length === 0 && id === "nombre") {
                  return;
                }
                setValue(e.target.value);
              }}
              onBlur={onBlur}
            />
          );
        case "textarea":
          return (
            <textarea
              required={id === "nombre" ? true : false}
              className="border border-gray-300 bg-gray-200 lg:w-[20rem]"
              value={value as string}
              onChange={(e) => {
                if (e?.target?.value?.length === 0 && id === "nombre") {
                  return;
                }
                setValue(e.target.value);
              }}
              onBlur={onBlur}
            />
          );
        case "date":
          return (
            <input
              type={dataType}
              required={true}
              className="bg-gray-200 text-center"
              value={value as string}
              onChange={(e) => {
                if (e?.target?.value?.split("-")?.length !== 3) {
                  return;
                } else if (e?.target?.value?.length === 0) {
                  return;
                }
                setValue(e.target.value);
              }}
              onBlur={onBlur}
            />
          );
        case "cedula":
          return (
            <InputMask
              mask="999-9999999-9"
              type="text"
              alwaysShowMask={false}
              className="text-md min-w-max border-t-0 border-r-0 border-l-0 border-b border-gray-300 bg-gray-200 pt-1 text-center focus:outline-0"
              value={value as string}
              onChange={(e) => {
                if (
                  e?.target?.value?.length > 0 &&
                  e?.target?.value?.length < 13
                ) {
                  return;
                }
                setValue(e.target.value);
              }}
              onBlur={onBlur}
            />
          );
        case "telefono":
          return (
            <input
              type="text"
              maxLength={20}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              value={value as string}
              inputMode="numeric"
              className="text-md min-w-max border-t-0 border-r-0 border-l-0 border-b border-gray-300 bg-gray-200 pt-1 pl-2 text-center focus:outline-0"
              onChange={(e) => {
                if (
                  e?.target?.value?.length > 0 &&
                  e?.target?.value?.length < 9
                ) {
                  return;
                }
                setValue(e.target.value);
              }}
              onBlur={onBlur}
            />
          );
        case "salario":
          return (
            <CurrencyInput
              className="text-md min-w-max border-t-0 border-r-0 border-l-0 border-b border-gray-300 bg-gray-200 pt-1 text-center focus:outline-0"
              defaultValue={0.0}
              decimalsLimit={2}
              decimalScale={2}
              prefix={"$"}
              value={
                isNaN(value)
                  ? 0
                  : String(value).replace("$", "").replaceAll(",", "")
              }
              allowNegativeValue={false}
              decimalSeparator={"."}
              groupSeparator={","}
              onChange={(e) => {
                setValue(
                  Number(e.target.value.replace("$", "").replaceAll(",", ""))
                );
              }}
              onBlur={onBlur}
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
              console.log("columnId", columnId);
              let columnString: any = columnId;
              if (columnId.split(".")[1] === "value") {
                columnString = columnId.split(".")[0];
                console.log("columnString", columnString);
                console.log("old", old[rowIndex]);
                console.log("value", [columnString], value);
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
    <>
      <Confirmation
        title="Eliminar Registro"
        messages={["Está a punto de eliminar este registro. ¿Desea continuar?"]}
        open={openConfirmationAlert}
        setClose={setOpenConfirmationAlert}
        setConfirmDeletion={setDeleteConfirmation}
        deleteRow={deleteRow}
        index={rowIndex}
      />
      <Alert
        title="Registro Eliminado"
        messages={["Registro eliminado satisfactoriamente."]}
        open={openDeleteConfirmationAlert}
        setClose={() => setOpenDeleteConfirmationAlert(false)}
      />
      <div className="w-72 overflow-x-scroll p-2 lg:w-full lg:max-w-5xl">
        <div className="h-2 w-72 lg:w-[40rem]" />
        <table>
          <thead className="bg-[color:var(--stepperColor)] text-white">
            {table.getHeaderGroups()?.map((headerGroup) => (
              <tr key={headerGroup.id}>
                <th className="bg-white"></th>
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
                  <td className="bg-white">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        // deleteRow(row?.index);
                        setRowIndex(row?.index);
                        setOpenConfirmationAlert(true);
                      }}
                    >
                      {" "}
                      <FontAwesomeIcon
                        className="h-6 w-6 pr-2 text-red-500"
                        icon={faTrash}
                      />
                    </button>
                  </td>
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
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="h-2" />
      </div>
    </>
  );
}
