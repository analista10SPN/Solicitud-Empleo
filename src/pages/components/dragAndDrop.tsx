import React, { Dispatch, SetStateAction, useState } from "react";
import { trpc } from "../../utils/trpc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { input, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface fileProps {
  nombre: string;
  extension: string;
  descripcion: string;
  binary: string;
}

interface dragAndDropProps {
  descripcion: string;
  fileArray: fileProps[];
  setFileArray: Dispatch<SetStateAction<fileProps[]>>;
  key: number;
  fileSelected: any;
  setFileSelected: Dispatch<SetStateAction<any[]>>;
}

const schema = z.object({
  file: z.any().optional(),
});

function DragDropFiles({
  descripcion,
  fileArray,
  setFileArray,
  key,
  fileSelected,
  setFileSelected,
}: dragAndDropProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [filebase64, setFileBase64] = useState<string>("");

  const [file, setFile] = useState<File>();

  const [inputKey, setInputKey] = useState<string>("1");

  //   const postAnexos = trpc.solicitudEmpleoPost.anexo.useMutation({
  //     onSuccess(e) {
  //       console.log("ANEXOS POST", e);
  //     },
  //   });

  function formSubmit(e: any) {
    // Submit your form with the filebase64 as
    // one of your fields
    // try {
    //   postAnexos.mutate(file);
    // } catch (cause) {
    //   console.error({ cause }, "Failed Post");
    // }
  }

  // The Magic all happens here.
  function convertFile(files: FileList | null) {
    if (files) {
      const fileRef = files[0] || "";
      const fileType: string = fileRef ? fileRef.type : "";

      const fileName = fileRef ? fileRef.name : "DocumentWithoutName";
      let fileExt = fileType.split("/")[1] as string;
      fileExt = "." + fileExt;
      const reader = new FileReader();

      if (fileRef) {
        reader.readAsBinaryString(fileRef as Blob);
      }
      reader.onload = (ev: any) => {
        // convert it to base64

        setFileBase64(`data:${fileType};base64,${btoa(ev.target.result)}`);
        const file: fileProps = {
          nombre: fileName,
          extension: fileExt,
          descripcion: descripcion,
          binary: `data:${fileType};base64,${btoa(ev.target.result)}`,
        };

        setFileArray([...fileArray, file]);
      };
    }
  }

  return (
    <div className="flex justify-center pt-1">
      <form id="form" onSubmit={formSubmit} className={"justify-center"}>
        <div>
          <input
            id="fileUploader"
            className=" text-md block w-full rounded-md border-2 border-dotted border-gray-500 bg-gray-200 p-10 text-center text-gray-700    "
            type="file"
            required={false}
            key={descripcion + inputKey}
            onDragEnd={(e) => {
              convertFile(e.currentTarget.files);
              if (e.currentTarget.files) {
                setFile(e.currentTarget.files[0]);
              }
            }}
            onChange={(e) => {
              if (e.target.files) {
                let ext: any = e?.target?.files[0]?.name;
                if (ext) ext = ext.match(/\.([^\.]+)$/)[1];
                switch (ext) {
                  case "jpg":
                    break;
                  case "jpeg":
                    break;
                  case "bmp":
                    break;
                  case "png":
                    break;
                  case "tif":
                    break;
                  case "pdf":
                    break;
                  default:
                    alert(`No se permiten archivos tipo: ${ext}`);
                    setFileBase64("");
                    const fileArrayUpdated = fileArray.filter(
                      (file) => file?.descripcion !== descripcion
                    );
                    setFileArray(fileArrayUpdated);

                    const randomString = Math.random().toString(36);
                    setInputKey(randomString);

                    return;
                }

                convertFile(e.target.files);
                setFile(e.target.files[0]);
              }
            }}
          />
          {filebase64 && (
            <div className="flex justify-end">
              <button
                className="text-red-500"
                onClick={(e) => {
                  e.preventDefault();
                  setFileBase64("");
                  const fileArrayUpdated = fileArray.filter(
                    (file) => file?.descripcion !== descripcion
                  );
                  setFileArray(fileArrayUpdated);

                  const randomString = Math.random().toString(36);
                  setInputKey(randomString);
                }}
              >
                <FontAwesomeIcon
                  className="h-6 w-6 pt-2 text-red-500"
                  icon={faTrash}
                />
              </button>
            </div>
          )}
        </div>
        {filebase64 !== "" && (
          <p className="pt-4 text-center text-gray-500">
            Visualice su &apos;{descripcion}&apos; debajo:
          </p>
        )}

        {filebase64 !== "" && (
          <div className="flex justify-center pt-1">
            {/* if it's an image */}
            {/* if it's an image */}
            {/* if it's an image */}
            {filebase64.indexOf("image/") > -1 && (
              <img src={filebase64} width={300} />
            )}
            {/* if it's an image */}
            {/* if it's an image */}
            {/* if it's an image */}

            {/* if it's a video */}
            {/* if it's a video */}
            {/* if it's a video */}
            {filebase64.indexOf("video/") > -1 && (
              <video controls>
                <source src={filebase64} />
              </video>
            )}
            {/* if it's a video */}
            {/* if it's a video */}
            {/* if it's a video */}

            {/* if it's a audio (music, sound) */}
            {/* if it's a audio (music, sound) */}
            {/* if it's a audio (music, sound) */}
            {filebase64.indexOf("audio/") > -1 && (
              <audio controls>
                <source src={filebase64} />
              </audio>
            )}
            {/* if it's a audio (music, sound) */}
            {/* if it's a audio (music, sound) */}
            {/* if it's a audio (music, sound) */}

            {/* if it's a PDF */}
            {/* if it's a PDF */}
            {/* if it's a PDF */}
            {filebase64.indexOf("application/pdf") > -1 && (
              <embed src={filebase64} width="800px" height="2100px" />
            )}
            {/* if it's a PDF */}
            {/* if it's a PDF */}
            {/* if it's a PDF */}

            <hr />
          </div>
        )}
      </form>
    </div>
  );
}

export default DragDropFiles;
