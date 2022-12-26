import React, { Dispatch, SetStateAction, useState } from "react";
import { trpc } from "../../../utils/trpc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import DragDropFiles from "../dragAndDrop";
import StepperController from "../stepperController";
import parameters from "../../../personalization/parameters.json";
import Alert from "../alert";

interface adjuntarDocumentosProps {
  fileArray: fileProps[];
  setFileArray: Dispatch<SetStateAction<fileProps[]>>;
  step: number;
  openWarning: boolean;
  setOpenWarning: Dispatch<SetStateAction<boolean>>;
  handleClick: (direccion: string) => void;
}

interface fileProps {
  nombre: string;
  extension: string;
  descripcion: string;
  binary: string;
}

const AdjuntarDocumentos = ({
  fileArray,
  setFileArray,
  step,
  openWarning,
  setOpenWarning,
  handleClick,
}: adjuntarDocumentosProps) => {
  const [fileSelected, setFileSelected] = useState<any[]>([{}, {}, {}, {}, {}]);

  const categorias = [
    "CV",
    "Título Universitario",
    "Cédula",
    "Lincencia de Conducir",
    "Foto 2x2",
  ];

  console.log("FILE ARRAY", fileArray);

  return (
    <>
      <Alert
        title="Advertencia"
        messages={["Si retrocede tendrá que adjuntar sus archivos nuevamente."]}
        open={openWarning}
        setClose={() => setOpenWarning(false)}
      />
      <div>
        <h2 className="pl-2 text-lg font-semibold text-[color:var(--fontColor)]">
          Adjuntar Documentos
        </h2>
        <span className="block pl-2 text-sm text-gray-500 lg:w-full">
          Adjunte uno o más documentos
        </span>
        <div className="flex justify-center px-2 pt-4 pb-2 shadow-sm">
          <div className="block">
            <div className="flex h-max w-max justify-center rounded-2xl px-2 align-middle">
              <div className="block">
                {" "}
                {categorias.map((categoria, index) => {
                  return (
                    <div key={categoria} className="py-6">
                      <span className="font-semibold text-[color:var(--fontColor)]">
                        {index + 1}. {categoria}
                      </span>
                      <DragDropFiles
                        descripcion={categoria}
                        fileArray={fileArray}
                        setFileArray={setFileArray}
                        key={index}
                        fileSelected={fileSelected}
                        setFileSelected={setFileSelected}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <StepperController
          steps={parameters.steps}
          currentStep={step}
          handleClick={handleClick}
          submit={false}
        ></StepperController>
      </div>
    </>
  );
};

export default AdjuntarDocumentos;
